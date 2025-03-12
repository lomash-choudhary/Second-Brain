import {type Request, type Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { LinkModel, UserModel } from "./db"

export const userMiddleWareForAuthAndPublic = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const sharedBrainLink = req.params.sharedBrainLink
        const authToken = req.headers.authorization || req.headers.Authorization

        let targetUserId: string | undefined;
        let authenticatedUserId: string | undefined
        if(sharedBrainLink){
            const doesLinkExists = await LinkModel.findOne({
                hash:sharedBrainLink
            }) 
            if(!doesLinkExists){
                res.status(400).send("Invalid Shared Link")
                return;
            }
            const isPublicEditAllowed = await UserModel.findOne({
                _id:doesLinkExists.userId,
                publicEditAllowed:true
            })
            if(!isPublicEditAllowed){
                res.status(400).send("This content can only be viewed")
                return;
            }
            targetUserId = doesLinkExists.userId.toString();
        }

        if(authToken){
            const decodedUser = jwt.verify(authToken as string, process.env.JWT_USER_SECRET as string) as JwtPayload
            authenticatedUserId = decodedUser.id;
        }
        if(!targetUserId && !authenticatedUserId){
            res.status(400).send("Authorization is required")
            return;
        }

        req.userId =  targetUserId || authenticatedUserId;
        req.authenticatedUserId = authenticatedUserId;
        req.targetUserId = targetUserId;

        next();
        
    }
    catch(err){
        res.status(400).send(`Error occured while validating the user ${err}`)
    }
}