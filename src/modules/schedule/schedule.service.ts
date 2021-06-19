import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isEqual } from "lodash";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { EnumStatusSchedule } from "src/schema";
import { DATABASE_COLLECTIONS } from "../../constant";
import { DoctorService } from "../doctor/doctor.service";
import { GQLDoctorNotFound } from "../doctor/errors";
import { Doctor } from "../doctor/schema/doctor.schema";
import { User } from "../user/schema/user.schema";
import { BookScheduleInputDTO } from "./dto/create-BookScheduleInput.dto";
import { GQLScheduleNotFound, GQLScheduleConfirmError } from "./errors";
import { Schedule, ScheduleDocument } from "./schema/schedule.schema";
import * as moment from 'moment'


@Injectable()
export class ScheduleService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.SCHEDULE) private readonly scheduleModel: Model<ScheduleDocument>,
        private readonly doctorService: DoctorService
    ) { }


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

    async findOne(
        filter: FilterQuery<ScheduleDocument>,
    ) {
        return this.scheduleModel.findOne({
            isDeleted: false,
            ...filter
        }).exec()
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

    async updateOne(
        filter: FilterQuery<ScheduleDocument>,
        update: UpdateQuery<ScheduleDocument>
    ) {
        const schedule = await this.scheduleModel.findOneAndUpdate(filter, update).exec()
        return schedule
    }

    async createSchedule(input: BookScheduleInputDTO, user_id: string) {
        const { idDoctor } = input
        const doctor = await this.doctorService.findOne(idDoctor)
        if (!doctor || isEqual(doctor.user._id, user_id)) throw new GQLDoctorNotFound()
        const newSchedule = new this.scheduleModel({
            ...input,
            doctor: doctor.user,
            client: new User({ _id: user_id })
        })
        await newSchedule.save()
        const findSc = await this.scheduleModel.findById(newSchedule._id).populate('client').populate('doctor')
        // console.log(newSchedule)
        return findSc
    }

    async myBookSchedules(user_id: string) {
        const client = new User({ _id: user_id })
        const schedules = await this.scheduleModel.find({
            client,
            isDeleted: false
        }).populate('client').populate('doctor')
        return schedules
    }

    async myBeBookSchedules(doctor_id: string) {
        const doctor = new Doctor({ _id: doctor_id })
        const schedules = await this.scheduleModel.find({
            doctor: doctor.user,
            isDeleted: false
        }).populate('client').populate('doctor')
        return schedules
    }

    async cancel(id: string, client_id: string) {
        const schedule = await (await this.findOne({ _id: id, isActive: true })).populate('client').populate('doctor')
        if (!schedule || (!isEqual(schedule.client._id, client_id) && !isEqual(schedule.doctor._id, client_id))) throw new GQLScheduleNotFound()
        if (isEqual(client_id, schedule.client._id)) {
            return this.updateOne({ _id: id },
                { isActive: false, updatedAt: moment().valueOf(), updatedBy: schedule.client, cancelBy: 'CLIENT' }
            )
        }
        return this.updateOne({ _id: id },
            { isActive: false, updatedAt: moment().valueOf(), updatedBy: schedule.doctor, cancelBy: 'DOCTOR' }
        )
    }

    async confirm(id: string, client_id: string) {
        const schedule = await (await this.findOne({ _id: id, isActive: true })).populate('client').populate('doctor')
        if (!schedule || (!isEqual(schedule.client._id, client_id) && !isEqual(schedule.doctor._id, client_id))) throw new GQLScheduleNotFound()
        if (isEqual(client_id, schedule.client._id) && schedule.status === EnumStatusSchedule.WAITING_CUSTOMER_CONFIRM) {
            return this.updateOne({ _id: id },
                { updatedAt: moment().valueOf(), updatedBy: schedule.client, status: EnumStatusSchedule.ACCEPTED }
            )
        }
        if (isEqual(client_id, schedule.doctor._id) && schedule.status === EnumStatusSchedule.WAITING_CUSTOMER_CONFIRM) {
            return this.updateOne({ _id: id },
                { updatedAt: moment().valueOf(), updatedBy: schedule.doctor, status: EnumStatusSchedule.ACCEPTED }
            )
        }
        throw new GQLScheduleConfirmError()
    }


    async rSScheduleOfDoctor(user_id: string, timespan: number) {
        const timeStart = moment(timespan).startOf('day').valueOf()
        const timeEnd = moment(timespan).endOf('day').valueOf()
        const schedulesOfDoctor = await this.scheduleModel.find({
            client: new User({ _id: user_id }),
            $and: [
                { time: { $gte: timeStart } },
                { time: { $lt: timeEnd } }
            ]
        }).sort({ time: 1 })
        const time = timeStart + 1000*60*60*6;
    }

}