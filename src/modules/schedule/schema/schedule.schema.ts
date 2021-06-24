import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { Doctor } from 'src/modules/doctor/schema/doctor.schema'
import { DATABASE_COLLECTIONS } from '../../../constant'
import { User } from '../../user/schema/user.schema'
import { EnumChannelSchedule, EnumStatusSchedule } from "../../../schema";
import { IDFactory } from '../../../helper'

export type ScheduleDocument = Schedule & Document

@Schema({
    collection: DATABASE_COLLECTIONS.SCHEDULE
})
export class Schedule {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
        default: IDFactory.generateCode
    })
    code: string

    @Prop({
        required: true
    })
    time: number

    @Prop({
        required: true,
        default: 1000*60*30
    })
    duration: number

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    })
    doctor: User

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    })
    client: User

    @Prop({
        required: true,
        type: EnumChannelSchedule,
        enum: EnumChannelSchedule,
        default: EnumChannelSchedule.OFFLINE
    })
    channel: EnumChannelSchedule

    @Prop({
        required: true,
        type: EnumStatusSchedule,
        enum: EnumStatusSchedule,
        default: EnumStatusSchedule.WAITING_DOCTOR_CONFIRM
    })
    status: EnumStatusSchedule

    @Prop({
        default: null
    })
    note?: string

    @Prop({
        default: false
    })
    confirm?: boolean

    @Prop({
        default: null
    })
    cancelBy: 'DOCTOR' | 'CLIENT'

    @Prop({
        required: true,
        default: false
    })
    isDeleted: boolean

    @Prop({
        required: true,
        default: true
    })
    isActive: boolean

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
        default: null
    })
    createdBy: User

    @Prop({
        type: SchemaTypes.Number
    })
    createdAt: number

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId
    })
    updatedBy?: User

    @Prop({
        type: SchemaTypes.Number
    })
    updatedAt?: number

    constructor(props: Partial<Schedule>) {
        Object.assign(this, props)
    }

}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule)
