import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isEqual } from "lodash";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { EnumStatusSchedule } from "../../schema";
import { DATABASE_COLLECTIONS } from "../../constant";
import { DoctorService } from "../doctor/doctor.service";
import { GQLDoctorNotFound } from "../doctor/errors";
import { Doctor } from "../doctor/schema/doctor.schema";
import { User } from "../user/schema/user.schema";
import { BookScheduleInputDTO } from "./dto/create-BookScheduleInput.dto";
import { GQLScheduleNotFound, GQLScheduleConfirmError, GQLScheduleSpamError } from "./errors";
import { Appointment, Schedule, ScheduleDocument } from "./schema/schedule.schema";
import * as moment from 'moment'
import { EnumEvent, PubSubSocket } from "../pubsub/pubsub.gateway";
import { TimerFactory } from "../../helper";


@Injectable()
export class ScheduleService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.SCHEDULE) private readonly scheduleModel: Model<ScheduleDocument>,
        private readonly doctorService: DoctorService,
        private readonly pubSub: PubSubSocket
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
        // const user_spam = await this.scheduleModel.find({
        //     client: new User({ _id: user_id }),
        //     isDeleted: false,
        //     $and: [
        //         { time: { $gt: moment().startOf('day').valueOf() } },
        //         { time: { $lt: moment().endOf('day').valueOf() } }
        //     ]
        // }).countDocuments()
        // if (user_spam >=3) throw new GQLScheduleSpamError()
        console.log(input)
        const doctor = await this.doctorService.findOne(idDoctor)
        if (!doctor || isEqual(doctor.user._id, user_id)) throw new GQLDoctorNotFound()
        const newSchedule = new this.scheduleModel({
            ...input,
            doctor: doctor.user,
            client: new User({ _id: user_id })
        })
        await newSchedule.save()
        const findSc = await this.scheduleModel.findById(newSchedule._id).populate('client').populate('doctor')
        await this.pubSub.sendMessageToUser(EnumEvent.NEW_SCHEDULES, doctor.user._id, "New schedule")
        // console.log(newSchedule)
        return findSc
    }

    async myBookSchedules(user_id: string) {
        const client = new User({ _id: user_id })
        const schedules = await this.scheduleModel.find({
            client,
            isDeleted: false
        }).sort({ time: -1 }).populate('client').populate('doctor')
        return schedules
    }

    async myBookSchedulesApprove(user_id: string) {
        const client = new User({ _id: user_id })
        const doctor = new User({ _id: user_id })
        const schedules = await this.scheduleModel.find({
            $or: [
                { client },
                { doctor }
            ],
            status: { $ne: EnumStatusSchedule.ACCEPTED },
            time: { $gt: moment().valueOf() },
            isActive: true,
            isDeleted: false
        }).sort({ time: -1 }).populate('client').populate('doctor')
        return schedules
    }

    async myBookSchedulesUpcoming(user_id: string) {
        const client = new User({ _id: user_id })
        const schedules = await this.scheduleModel.find({
            client,
            $or: [
                { status: EnumStatusSchedule.ACCEPTED },
                { time: { $lte: moment().valueOf() } }
            ],
            isActive: true,
            isDeleted: false
        }).sort({ time: -1 }).populate('client').populate('doctor')
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
        const schedule = await (await this.findOne({
            _id: id,
            status: { $ne: EnumStatusSchedule.ACCEPTED },
            isActive: true,
        }))?.populate('client')?.populate('doctor')
        console.log(schedule)
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
        const appointment = TimerFactory.timeToAppointment(timespan)
        const schedules = await this.scheduleModel.find({
            $and: [
                { "appointment.date": { $gte: moment(appointment.date).startOf('day').valueOf() } },
                { "appointment.date": { $lte: moment(appointment.date).endOf('day').valueOf() } },
            ],
            isActive: true,
            isDeleted: false,
            status: EnumStatusSchedule.ACCEPTED,
            doctor: new User({ _id: user_id })
        }).exec()
        console.log(schedules)
        const results: Appointment[] = []
        TimerFactory.TimeAccept.forEach(t => {
            console.log((moment(appointment.date).startOf('day').add(t.from, 'hour')))
            if ((moment(appointment.date).startOf('day').add(t.from, 'hour').valueOf() > moment().valueOf()) && 
            !schedules.some(s => (s.appointment.from == t.from && s.appointment.to == t.to))) {
                results.push({
                    ...t,
                    date: appointment.date
                })
            }
        })
        return results
    }

}