import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { DATABASE_COLLECTIONS } from '../../../constant'
import { User } from '../../user/schema/user.schema'

export type MessageDocument = Message & Document

@Schema({
    collection: DATABASE_COLLECTIONS.MESSAGE
})
export class Message {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
        enum: EnumMessage
    })
    type: EnumMessage

    @Prop({
        required: true
    })
    text: string

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    })
    from: User

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId,
    })
    to: User

    @Prop({
        required: true,
        default: false
    })
    isDeleted: boolean

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId
    })
    updatedBy?: User

    @Prop({
        type: SchemaTypes.Number
    })
    updatedAt?: number

    constructor(props: Partial<Message>) {
        // super()
        Object.assign(this, props)
    }

}

export const MessageSchema = SchemaFactory.createForClass(Message)
