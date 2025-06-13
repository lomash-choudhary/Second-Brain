"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleWareForAuthAndPublic = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const userMiddleWareForAuthAndPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharedBrainLink = req.params.sharedBrainLink;
        console.log(sharedBrainLink);
        const authToken = req.headers.authorization || req.headers.Authorization;
        // target user id is the user id of the person whose brain we are targeting to edit
        let targetUserId;
        let authenticatedUserId;
        // so we check for the shared brain link and if it is not present then we check for the auth token if that to is not present then we send a 404 code
        if (sharedBrainLink) {
            const doesLinkExists = yield db_1.LinkModel.findOne({
                hash: sharedBrainLink
            });
            if (!doesLinkExists) {
                res.status(400).send("Invalid Shared Link");
                return;
            }
            const isPublicEditAllowed = yield db_1.UserModel.findOne({
                _id: doesLinkExists.userId,
                publicEditAllowed: true
            });
            if (!isPublicEditAllowed) {
                res.status(400).send("This content can only be viewed");
                return;
            }
            targetUserId = doesLinkExists.userId.toString();
        }
        // this middlelware atleast want one of the two things
        /*
            either auth token in the headers
            or the shared link
        */
        if (authToken) {
            const decodedUser = jsonwebtoken_1.default.verify(authToken, process.env.JWT_USER_SECRET);
            authenticatedUserId = decodedUser.id;
        }
        if (!targetUserId && !authenticatedUserId) {
            res.status(400).send("Authorization is required");
            return;
        }
        // what the below does is this
        /*
            if some one is accessing the shared brain then the userId becomes the user id of the person who is sharing the brain

            and if someone  is using their own token then it becomes the their own id
        */
        req.userId = targetUserId || authenticatedUserId;
        /*
            this stores the authenticated token id of the user who had their token and it remains undefined if no token was provided
        */
        req.authenticatedUserId = authenticatedUserId;
        /*
            this stores the target user id i.e. id of the user whose brain is shared and it remains undefined if the brain is not shared
        */
        req.targetUserId = targetUserId;
        next();
    }
    catch (err) {
        res.status(400).send(`Error occured while validating the user ${err}`);
    }
});
exports.userMiddleWareForAuthAndPublic = userMiddleWareForAuthAndPublic;
