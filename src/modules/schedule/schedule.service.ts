import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { User } from "../user/schema/user.schema";
import { Schedule, ScheduleDocument } from "./schema/schedule.schema";


@Injectable()
export class ScheduleService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.SCHEDULE) private readonly scheduleModel: Model<ScheduleDocument> 
    ){}


    async findAll(args?: {
        filter?: FilterQuery<ScheduleDocument>,
        sort?: any
    }): Promise<Schedule[]> {
        const { filter, sort } = args || { filter: {}, sort: {} }
        const schedules = await this.scheduleModel.find({
            isDeleted: false,
            ...filter
        }).sort(sort);
        return schedules;
    }

    async findByUserId(id: string): Promise<Schedule> {
        return this.scheduleModel.findOne({
            user: new User({ _id: id }),
            isActive: true,
            isDeleted: false
        }).exec()
    }

    async saveDoctor(doctor: any) {
        return this.scheduleModel.create(doctor);
    }

}