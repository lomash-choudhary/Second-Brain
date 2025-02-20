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
        const authToken = req.headers.authorization || req.headers.Authorization;
        let targetUserId;
        let authenticatedUserId;
        if (sharedBrainLink) {
            const doesLinkExists = yield db_1.LinkModel.findOne({
                hash: sharedBrainLink
            });
            if (!doesLinkExists) {
                res.status(400).send("Invalid Shared Link");
                return;
            }
            const isPublicEditAllowed = yield db_1.UserModel.findOne({
                publicEditAllowed: true
            });
            if (!isPublicEditAllowed) {
                res.status(400).send("This content can only be viewed");
                return;
            }
            targetUserId = doesLinkExists.userId.toString();
        }
        if (authToken) {
            const decodedUser = jsonwebtoken_1.default.verify(authToken, process.env.JWT_USER_SECRET);
            authenticatedUserId = decodedUser.id;
        }
        if (!targetUserId && !authenticatedUserId) {
            res.status(400).send("Authorization is required");
            return;
        }
        req.userId = targetUserId || authenticatedUserId;
        req.authenticatedUserId = authenticatedUserId;
        req.targetUserId = targetUserId;
        next();
    }
    catch (err) {
        res.status(400).send(`Error occured while validating the user ${err}`);
    }
});
exports.userMiddleWareForAuthAndPublic = userMiddleWareForAuthAndPublic;
