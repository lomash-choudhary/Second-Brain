"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.TagsModel = exports.ContentModel = exports.UserModel = void 0;
//database schema
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const contentTypes = ["document", "youtube", "x", "links"]; //this is an ever increasing array
const ContentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: { type: mongoose_1.Types.ObjectId, ref: "tags" },
    userId: { type: mongoose_1.Types.ObjectId, ref: "users", required: true }
});
const TagsSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true }
});
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Types.ObjectId, ref: "users", required: true, unique: true }
});
exports.UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.ContentModel = (0, mongoose_1.model)("content", ContentSchema);
exports.TagsModel = (0, mongoose_1.model)("tags", TagsSchema);
exports.LinkModel = (0, mongoose_1.model)("links", LinkSchema);
