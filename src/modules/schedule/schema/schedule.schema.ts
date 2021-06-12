import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { Doctor } from 'src/modules/doctor/schema/doctor.schema'
import { DATABASE_COLLECTIONS } from '../../../constant'
import { User } from '../../user/schema/user.schema'

export type ScheduleDocument = Schedule & Document

export enum ChannelSchedule {
    ONLINE,
    OFFLINE
}

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
        required: true
    })
    code: string

    @Prop({
        required: true
    })
    time: number

    @Prop({
        ref: DATABASE_COLLECTIONS.DOCTOR,
        type: SchemaTypes.ObjectId,
    })
    doctor: Doctor

    @Prop([{
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    }])
    clients: User[]

    @Prop({
        required: true,
        enum: ChannelSchedule,
        default: ChannelSchedule.OFFLINE
    })
    channel: ChannelSchedule

    @Prop({
        required: true,
        default: false
    })
    isDeleted: boolean

    @Prop({
        required: true,
        default: false
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
