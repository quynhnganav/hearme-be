import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from "mongoose";
import { DATABASE_COLLECTIONS } from '../../constant';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { Session, SessionDocument } from './schema/session.schema';

@Injectable()
export class SessionService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.SESSION) private readonly sessionModel: Model<SessionDocument>,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {
     }

    async findAll(args?: {
        filter: FilterQuery<SessionDocument>
    }): Promise<Session[]> {
        const { filter } = args || { filter: {} }
        const sessions = await this.sessionModel.find(filter).populate('document').exec()
        return sessions
    }

    async findOne(args?: {
        filter: FilterQuery<SessionDocument>
    }): Promise<Session> {
        const { filter } = args || { filter: {} }
        const session = await this.sessionModel.findOne(filter).exec()
        return session
    }

    async createSession(session) {
        const newsession = new this.sessionModel(session);
        await newsession.save()
        return newsession
    }

    async updateOne(args?: {
        filter?: FilterQuery<SessionDocument>,
        update: Partial<Session>,
        userUpdate: User
    }): Promise<Session> {
        const { filter, update, userUpdate } = args || { filter: {}, update: {} }
        const session = await this.sessionModel.findOneAndUpdate(
            filter,
            {
                $set: {
                    ...update,
                    updatedBy: userUpdate
                }
            },
            {
                new: true
            }
        ).exec()
        return session
    }

    async sessionsOfUser(user: User | string): Promise<Session[]> {
        if (typeof user === "string") user = await this.userService.findOne({ filter: { _id: user } });
        if (!user) return [];
        const histories = await this.sessionModel.find({
            createdBy: user
        });
        return histories;
    }

}
