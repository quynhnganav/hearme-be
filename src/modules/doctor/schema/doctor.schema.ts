import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { IDFactory } from 'src/helper'
import { DATABASE_COLLECTIONS } from '../../../constant'
import { User } from '../../user/schema/user.schema'

export type DoctorDocument = Doctor & Document

@Schema({
    collection: DATABASE_COLLECTIONS.DOCTOR
})
export class Doctor {

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
        default: ''
    })
    slogan?: string

    @Prop({
        default: ''
    })
    note?: string

    @Prop({
        default: 0
    })
    experience: number

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    })
    user: User

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
        type: SchemaTypes.ObjectId
    })
    updatedBy?: User

    @Prop({
        type: SchemaTypes.Number
    })
    updatedAt?: number

    constructor(props: Partial<Doctor>) {
        Object.assign(this, props)
    }

}

export const DoctorSchema = SchemaFactory.createForClass(Doctor)
