import * as dotenv from "dotenv"
dotenv.config()
import express,{type Request, type Response} from "express"
import bcrypt, { hash } from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { ContentModel, LinkModel, UploadModel, UserModel } from "./db"
import mongoose from "mongoose"
import { userMiddleWare } from "./middleware"
import { hashGenerator } from "./hashGenerator"
import cors from "cors"
import multer from "multer"
import path from "path"
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.SERVER_PORT

//multer disc storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })

//user sign up end point
app.post("/api/v1/signup", async (req:Request, res:Response) => {
    try{
        const requiredBody = z.object({
            username:z.string().min(3,"Please enter a valid username").max(20,"Username is too long"),
            password: z.string().min(8,"password is too short")
            .regex(/[A-Z]/,"password should contain atleast one uppercase character")
            .regex(/[a-z]/,"password should contain atleast one lower case character")
            .regex(/[0-9]/,"password should contain atleast one numeric character")
            .regex(/[\W_]/,"password should contain atleast one special character")
        })

        const parsedBody = requiredBody.safeParse(req.body)
        if(parsedBody.error){
            throw new Error("Error occured while parsing the json body");
        }

        try{
            const {username, password} = req.body

            const hashedPassword = await bcrypt.hash(password,5)

            await UserModel.create({
                username:username,
                password:hashedPassword
            })
            res.status(200).send("user signed up successfully on the app");
        }
        catch(err){
            res.status(400).send("please enter a unique username")
        }
    }
    catch(err){
        res.status(400).send(`Error occured while signing up ${err}`)
    }
})

//user sign in end point
app.post("/api/v1/login", async (req:Request, res:Response) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            throw new Error("Please enter username and password to singup or enter a unique username");
        }
        const userData = await UserModel.findOne({
            username:username,
        })
        if(!userData){
            throw new Error("user does not exists in the database");
        }
        const comparedPassword = await bcrypt.compare(password, userData.password)
        if(!comparedPassword){
            throw new Error("Wrong password")
        }
        if(typeof process.env.JWT_USER_SECRET === "string"){
            const token = jwt.sign({
                id: userData._id
            },process.env.JWT_USER_SECRET)
            res.status(200).send(token)
        }
        else{
            throw new Error("Error occured while generatin a token")
        }
    }
    catch(err){
        res.status(400).send(`Error occured while signing up on the app ${err}`)
    }
})

//user content creation end point
app.post("/api/v1/content", userMiddleWare, async(req:Request, res:Response) => {
    try{
        const userId = req.userId
        const {type, link, title, tags} = req.body  
        if(!type || !link || !title){
            throw new Error("enter all the field to create a content")
        }
        await ContentModel.create({
            type: type,
            link: link,
            title: title,
            tags: tags,
            userId: userId
        })
        res.status(200).send("Content added to the database successfully");

    }
    catch(err){
        res.status(400).send(`Error occured while creating the content ${err}`)
    }
})

//user fatching the data from content table for user using token
app.get("/api/v1/content", userMiddleWare, async (req:Request, res:Response) => {
    try{
        const userId = req.userId
        const userContentData = await ContentModel.find({
            userId: userId
        }).populate("userId", "username")//we populated the relationship by which we can get the content with the users details. we are saying that from userId give the user's username.
        res.status(200).json({
            userContentData: userContentData 
        })
    }
    catch(err){
        res.status(400).send(`Error occured while fetching the data from the database for the user ${err}`)
    }
})

//put request to edit the content
app.put('/api/v1/content/:contentId', userMiddleWare, async (req:Request, res:Response) => {
    try{
        const userId = req.userId;
        const {type, link, title, tags} = req.body 
        const contentId = req.params.contentId
        if(!contentId){
            throw new Error('Please provide the content id to update the data')
        }
        const contentUpdation = await ContentModel.updateOne(
            {
                _id: contentId,
                userId:userId
            },
            {$set:{type, link, title, tags}}
        )
        res.status(200).send(`Updated the data successfully`)
    }catch(err){
        res.status(500).send(`Error occured while updating the data ${err}`)
    }
})


//content deletion end point
app.delete("/api/v1/content/:contentId", userMiddleWare, async (req:Request, res: Response) => {
    try{
        const userId = req.userId
        const contentId  = req.params.contentId
        if(!contentId){
            throw new Error("Please provide the contentId to delete the content");
        }
        const result = await ContentModel.deleteOne({
            _id: contentId,
            userId: userId
        })
        if(result.deletedCount === 0){
            res.status(400).send("You are not authorized to delete the data");
            return;
        }
        res.status(200).send("Content delete for the given id successfully");
    }
    catch(err){
        res.status(400).send(`Error occured while deleting the content ${err}`)
    }
})

app.post("/api/v1/brain/share", userMiddleWare, async (req:Request, res:Response) => {
    try{
        const { share } = req.body;
        if(share === true){
            const existingHash = await LinkModel.findOne({
                userId: req.userId
            })

            if(existingHash){
                res.status(200).json({
                    hash: existingHash.hash
                })
                return;
            }

            const hash = hashGenerator(20)
            const result = await LinkModel.create({
                hash: hash,
                userId: req.userId
            })
            res.status(200).json({
                message:"Hash generated successfully",
                link: result.hash
            })
            return;

        }
        else if(share === false){
            await LinkModel.deleteOne({
                userId: req.userId
            })
            res.status(200).send("hash Deleted successfully");
        }
    }
    catch(err){
        res.status(400).send(`Error occured while generating the hash ${err}`)
    }
})

app.get("/api/v1/brain/:shareLink", async (req:Request, res:Response) => {
    try{
        const hash = req.params.shareLink;
        const link = await LinkModel.findOne({
            hash: hash
        })
        if(!link){
            res.status(404).send("This Link does not exists");
            return;
        }
        const content = await ContentModel.find({
            userId: link.userId
        }).populate("userId","username");
        res.status(200).json({
            content
        })
    }
    catch(err){
        res.status(400).send(`Error occured while loading the page ${err}`)
    }
})

//upload content to the database
app.post("/api/v1/upload", upload.single("uploadImage"), userMiddleWare, async (req, res) => {
    console.log(req.file);
    try {
        const userId = req.userId
        const fileData = {
            fieldname: req.file?.fieldname,
            originalname: req.file?.originalname,
            path: req.file?.path,
            userId: userId
        }
        const response = await UploadModel.create(fileData)
        console.log(response);
        if(!response){
            throw new Error('Unable to upload the file')
        }
        res.status(200).send('Uploaded the document successfully')
    } catch (error) {
        res.status(500).send(`Error occured while uploading: ${error}`)
    }
})

app.get("/uploads/:id", async (req, res) => {
    try {
        const id = req.params.id
        const files = await UploadModel.findById(id);
        if(!files){
            throw new Error("File not found")
        }
        const imagePath = path.join(process.cwd(), files.path!)
        res.status(200).sendFile(imagePath)
    } catch (error:any) {
        console.log("error", error)
        res.status(500).send(`Error: ${error}`);
    }
})

const main = async () => {
    if(typeof process.env.MONGO_URL === "string"){
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to database successfully")
    }
    else{
       console.log("Error occured while connecting to the database"); 
    }

    app.listen(port,() => {
        console.log(`app is listening on port ${port}`)
    })
}

main()