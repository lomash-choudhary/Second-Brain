"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new Error("please enter the authorization key to continue");
        }
        if (process.env.JWT_USER_SECRET) {
            const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_USER_SECRET);
            req.userId = decodedUser.id;
        }
        next();
    }
    catch (err) {
        res.status(400).send(`Error occured while validating the user ${err}`);
    }
};
exports.userMiddleWare = userMiddleWare;
