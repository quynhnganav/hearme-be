import { Injectable } from "@nestjs/common";
import { _FilterQuery, _AllowStringsForIds, _LeanDocument, FilterQuery } from "mongoose";
import { BaseService } from "../common/interface";
import { Post, PostDocument } from "./schemas/post.schema";

@Injectable()
export class PostService implements BaseService<Post, PostDocument, {}, {}>{
    findAll(args?: { filter: _FilterQuery<_AllowStringsForIds<Pick<_LeanDocument<PostDocument>, "_id" | "__v" | "id" | "text" | "medias" | "likes" | "isDeleted" | "isLocked" | "isActive" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt">>>; sort?: any; }): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    findOne(args?: { filter: _FilterQuery<_AllowStringsForIds<Pick<_LeanDocument<PostDocument>, "_id" | "__v" | "id" | "text" | "medias" | "likes" | "isDeleted" | "isLocked" | "isActive" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt">>>; sort?: any; }): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    create(args: { input: {}; context?: any; }): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    updateOne(args: { filter?: _FilterQuery<_AllowStringsForIds<Pick<_LeanDocument<PostDocument>, "_id" | "__v" | "id" | "text" | "medias" | "likes" | "isDeleted" | "isLocked" | "isActive" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt">>>; input: {}; context?: any; }): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    updateMany(args?: { filter?: _FilterQuery<_AllowStringsForIds<Pick<_LeanDocument<PostDocument>, "_id" | "__v" | "id" | "text" | "medias" | "likes" | "isDeleted" | "isLocked" | "isActive" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt">>>; update: {}; }): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    deleteMany(args: { filter?: _FilterQuery<_AllowStringsForIds<Pick<_LeanDocument<PostDocument>, "_id" | "__v" | "id" | "text" | "medias" | "likes" | "isDeleted" | "isLocked" | "isActive" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt">>>; ids: string[]; }): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }

    
}