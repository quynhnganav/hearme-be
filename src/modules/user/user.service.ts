import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { DATABASE_COLLECTIONS, HISTORY_ACTION } from '../../constant';
import { AuthService } from '../auth/auth.service';
import { HistoryService } from '../history/history.service';
import { CreateUserInputDTO } from './dto/create-user.dto';
import { UpdateUserInputDTO } from './dto/update-user.dto';
import { GQLUsernameExists } from './errors';
import { User, UserDocument } from './schema/user.schema';
import * as moment from 'moment'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.USER) private readonly userModel: Model<UserDocument>,
        private readonly historyService: HistoryService,
    ) { }

    async findAll(args?: {
        filter: FilterQuery<UserDocument>
        sort?: any
    }): Promise<User[]> {
        const { filter, sort } = args || { filter: {}, sort: {} }
        const users = await this.userModel.find({
            isDeleted: false,
            ...filter
        }).sort(sort).exec()
        return users
    }

    async findOne(args?: {
        filter?: FilterQuery<UserDocument>,
        sort?: any
    }): Promise<User> {
        const { filter } = args || { filter: {} }
        const user = await this.userModel.findOne(filter).exec()
        return user
    }

    async create(args: {
        input: CreateUserInputDTO
        context?: any
    }): Promise<User | null> {
        try {
            const { input, context } = args
            const foundUser = await this.findOne({
                filter: {
                    username: input.username,
                    isDeleted: false
                }
            });
            if (foundUser) throw new GQLUsernameExists()
            const password = hashSync(input.password || "123456789", 10)
            const newUser = new this.userModel({
                ...input,
                password,
                // roles: input.roles || ["APP_MEMBER"],
                createdBy: new User({ _id: context?.currentUser?._id })
            })
            await newUser.save()
            return newUser
        } catch (error) {
            throw (error)
        }
    }

    async saveUser(user, context?: any): Promise<User> {
        const newUser = await this.userModel.create(user);
        // await this.historyService.createHistory({
        //     _id: null,
        //     action: HISTORY_ACTION.CREATE,
        //     document: newUser,
        //     documentLog: null,
        //     onModal: DATABASE_COLLECTIONS.USER,
        //     createdAt: null,
        //     createdBy: userCreate
        // })
        return newUser;
    }

    async updateOne(args: {
        update: UpdateUserInputDTO
        context?: any
        id: string
        updateQuery?: UpdateQuery<UserDocument>
        option?: QueryOptions
    }): Promise<User> {
        const { id, update, context, updateQuery = {}, option = {} } = args
        const password = update?.password ? { password: hashSync(update.password, 11) } : {};
        const input: any = {
            ...update,
            ...password,
            updatedBy: new User({ _id: context?.currentUser?._id }),
            updatedAt: moment.now()
        }
        const user = await this.userModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false, 
            },
            {
                $set: input,
                ...updateQuery
            },
            {
                new: true,
                ...option
            }
        ).exec()
        return user
    }

    async updateMany(args: {
        filter?: FilterQuery<UserDocument>,
        update: UpdateUserInputDTO
        context?: any
    }): Promise<User[]> {
        const { filter, update, context } = args
        const input: any = {
            ...update,
            updatedBy: new User({ _id: context?.currentUser?._id }),
            updatedAt: moment.now()
        }
        const [users] = await Promise.all([
            this.findAll({ filter }),
            this.userModel.updateMany(
                filter,
                {
                    $set: input
                }
            )

        ])
        return users
    }

    async deleteMany(args: {
        filter?: FilterQuery<UserDocument>,
        ids?: string[]
        context?: any
    }): Promise<User[]> {
        const { filter, ids, context } = args
        const [users] = await Promise.all([
            this.findAll({ filter: { _id: { $in: ids || [] }, ...filter, isDeleted: false } }),
            this.userModel.updateMany(
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
        return users
    }

}
