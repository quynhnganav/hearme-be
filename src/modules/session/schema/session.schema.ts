import { Schema, Prop, SchemaFactory, } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { User } from '../../user/schema/user.schema'
import { DATABASE_COLLECTIONS } from '../../../constant'

export type SessionDocument = Session & Document

@Schema({
    collection: DATABASE_COLLECTIONS.SESSION,
    timestamps: true
})
export class Session {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        type: Boolean,
        default: true
    })
    active: boolean

    @Prop({
        type: String,
        default : null
    })
    device?: string

    @Prop({
        type: Number,
        default: null
    })
    location?: number

    @Prop({
        type: Boolean,
        default: false
    })
    isDeleted: boolean

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
        default: null
    })
    createdBy: User

    @Prop({
        type: SchemaTypes.Number,
        default: Date.now
    })
    createdAt: number

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
        default: null
    })
    updatedBy: User

    @Prop({
        type: SchemaTypes.Number,
        default: Date.now
    })
    updatedAt: number

    constructor(props: Partial<Session>) {
        Object.assign(this, props)
    }

}

export const SessionSchema = SchemaFactory.createForClass(Session)
