import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { _FilterQuery, _AllowStringsForIds, _LeanDocument, FilterQuery, Model } from "mongoose";
import { DATABASE_COLLECTIONS } from "src/constant";
import { HistoryService } from "../history/history.service";
import { User } from "../user/schema/user.schema";
import { Post, PostDocument } from "./schemas/post.schema";
import * as moment from 'moment'
import { CreatePostInputDTO } from "./dto/create-post.dto";
import { UpdatePostInputDTO } from "./dto/update-post.dto";
import { GQLPostNotFound } from "./errors";

@Injectable()
export class PostService {
    constructor(
        @InjectModel(DATABASE_COLLECTIONS.POST) private readonly postModel: Model<PostDocument>,
        private readonly historyService: HistoryService,
    ) { }

    async findAll(args?: {
        filter: FilterQuery<PostDocument>
        sort?: any
    }): Promise<Post[]> {
        const { filter, sort } = args || { filter: {}, sort: {} }
        const posts = await this.postModel.find({
            isDeleted: false,
            ...filter
        }).sort(sort).exec()
        return posts
    }

    async findOne(args?: {
        filter?: FilterQuery<PostDocument>,
        sort?: any
    }): Promise<Post> {
        const { filter } = args || { filter: {} }
        const post = await this.postModel.findOne({
            isDeleted: false,
            ...filter
        }).exec()
        return post
    }

    async create(args: {
        input: CreatePostInputDTO
        context?: any
    }): Promise<Post | null> {
        try {
            const { input, context } = args
            const newPost = new this.postModel({
                ...input,
                createdBy: new User({ _id: context?.currentUser?._id })
            })
            await newPost.save()
            return newPost
        } catch (error) {
            throw (error)
        }
    }

    async updateOne(args: {
        update: UpdatePostInputDTO
        context?: any
        id: string
    }): Promise<Post> {
        const { id, update, context } = args
        const post = await this.findOne({
            filter: { _id: id, createdBy: context?.currentUser?._id }
        })
        const input: any = {
            ...update,
            updatedBy: new User({ _id: context?.currentUser?._id }),
            updatedAt: moment.now()
        }
        const newPost = await this.postModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: input
            },
            {
                new: true
            }
        ).exec()
        if (!newPost) throw new GQLPostNotFound()
        return newPost
    }

    async deleteMany(args: {
        filter?: FilterQuery<PostDocument>,
        ids?: string[]
        context?: any
    }): Promise<Post[]> {
        const { filter, ids, context } = args
        const [posts] = await Promise.all([
            this.findAll({ filter: { _id: { $in: ids || [] }, ...filter, isDeleted: false } }),
            this.postModel.updateMany(
                { _id: { $in: ids || [] }, ...filter, isDeleted: false },
                {
                    $set: {
                        isDeleted: true,
                        deletedBy: new User({ _id: context?.currentUser?._id }),
                        deletedAt: moment.now()
                    }
                }
            )

        ])
        return posts
    }
}