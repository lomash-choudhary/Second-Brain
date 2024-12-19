"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = require("./middleware");
const hashGenerator_1 = require("./hashGenerator");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.SERVER_PORT;
//user sign up end point
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requiredBody = zod_1.z.object({
            username: zod_1.z.string().min(3, "Please enter a valid username").max(20, "Username is too long"),
            password: zod_1.z.string().min(8, "password is too short")
                .regex(/[A-Z]/, "password should contain atleast one uppercase character")
                .regex(/[a-z]/, "password should contain atleast one lower case character")
                .regex(/[0-9]/, "password should contain atleast one numeric character")
                .regex(/[\W_]/, "password should contain atleast one special character")
        });
        const parsedBody = requiredBody.safeParse(req.body);
        if (parsedBody.error) {
            throw new Error("Error occured while parsing the json body");
        }
        try {
            const { username, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 5);
            yield db_1.UserModel.create({
                username: username,
                password: hashedPassword
            });
            res.status(200).send("user signed up successfully on the app");
        }
        catch (err) {
            res.status(400).send("please enter a unique username");
        }
    }
    catch (err) {
        res.status(400).send(`Error occured while signing up ${err}`);
    }
}));
//user sign in end point
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Please enter username and password to singup or enter a unique username");
        }
        const userData = yield db_1.UserModel.findOne({
            username: username,
        });
        if (!userData) {
            throw new Error("user does not exists in the database");
        }
        const comparedPassword = yield bcrypt_1.default.compare(password, userData.password);
        if (!comparedPassword) {
            throw new Error("Wrong password");
        }
        if (typeof process.env.JWT_USER_SECRET === "string") {
            const token = jsonwebtoken_1.default.sign({
                id: userData._id
            }, process.env.JWT_USER_SECRET);
            res.status(200).send(token);
        }
        else {
            throw new Error("Error occured while generatin a token");
        }
    }
    catch (err) {
        res.status(400).send(`Error occured while signing up on the app ${err}`);
    }
}));
//user content creation end point
app.post("/api/v1/content", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { type, link, title, tags } = req.body;
        if (!type || !link || !title) {
            throw new Error("enter all the field to create a content");
        }
        yield db_1.ContentModel.create({
            type: type,
            link: link,
            title: title,
            tags: tags,
            userId: userId
        });
        res.status(200).send("Content added to the database successfully");
    }
    catch (err) {
        res.status(400).send(`Error occured while creating the content ${err}`);
    }
}));
//user fatching the data from content table for user using token
app.get("/api/v1/content", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const userContentData = yield db_1.ContentModel.findOne({
            userId: userId
        }).populate("userId", "username"); //we populated the relationship by which we can get the content with the users details. we are saying that from userId give the user's username.
        res.status(200).json({
            userContentData: userContentData
        });
    }
    catch (err) {
        res.status(400).send(`Error occured while fetching the data from the database for the user ${err}`);
    }
}));
//content deletion end point
app.delete("/api/v1/content", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { contentId } = req.body;
        if (!contentId) {
            throw new Error("Please provide the contentId to delete the content");
        }
        const result = yield db_1.ContentModel.deleteOne({
            _id: contentId,
            userId: userId
        });
        console.log(result);
        if (result.deletedCount === 0) {
            res.status(400).send("You are not authorized to delete the data");
            return;
        }
        res.status(200).send("Content delete for the given id successfully");
    }
    catch (err) {
        res.status(400).send(`Error occured while deleting the content ${err}`);
    }
}));
app.get("/api/v1/brain/share", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        if (share === "true") {
            const existingHash = yield db_1.LinkModel.findOne({
                userId: req.userId
            });
            if (existingHash) {
                res.status(200).json({
                    hash: existingHash.hash
                });
                return;
            }
            const hash = (0, hashGenerator_1.hashGenerator)(20);
            const result = yield db_1.LinkModel.create({
                hash: hash,
                userId: req.userId
            });
            res.status(200).json({
                message: "Hash generated successfully",
                link: result.hash
            });
            return;
        }
        else {
            yield db_1.LinkModel.deleteOne({
                userId: req.userId
            });
            res.status(200).send("hash Deleted successfully");
        }
    }
    catch (err) {
        res.status(400).send(`Error occured while generating the hash ${err}`);
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield db_1.LinkModel.findOne({
            hash: hash
        });
        if (!link) {
            res.status(404).send("This Link does not exists");
            return;
        }
        const content = yield db_1.ContentModel.findOne({
            userId: link.userId
        }).populate("userId", "username");
        res.status(200).json({
            content
        });
    }
    catch (err) {
        res.status(400).send(`Error occured while loading the page ${err}`);
    }
}));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof process.env.MONGO_URL === "string") {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        console.log("connected to database successfully");
    }
    else {
        console.log("Error occured while connecting to the database");
    }
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`);
    });
});
main();
