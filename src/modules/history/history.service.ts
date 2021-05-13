import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from "mongoose";
import { DATABASE_COLLECTIONS } from '../../constant';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { History, HistoryDocument } from './schema/history.schema';

@Injectable()
export class HistoryService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.HISTORY) private readonly historyModel: Model<HistoryDocument>,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {
     }

    async findAll(args?: {
        filter: FilterQuery<HistoryDocument>
    }): Promise<History[]> {
        const { filter } = args || { filter: {} }
        const historys = await this.historyModel.find(filter).populate('document').exec()
        return historys
    }

    async findOne(args?: {
        filter: FilterQuery<HistoryDocument>
    }): Promise<History> {
        const { filter } = args || { filter: {} }
        const history = await this.historyModel.findOne(filter).exec()
        return history
    }

    async createHistory(history: History) {
        const newHistory = await this.historyModel.create(history);
        return newHistory
    }

    async historiesOfUser(user: User | string): Promise<History[]> {
        if (typeof user === "string") user = await this.userService.findOne({ filter: { _id: user } });
        if (!user) return [];
        const histories = await this.historyModel.find({
            createdBy: user
        });
        return histories;
    }

}
