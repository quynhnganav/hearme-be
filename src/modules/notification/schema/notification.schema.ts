import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from "mongoose";
import { DATABASE_COLLECTIONS } from "src/constant";
import { User } from "src/modules/user/schema/user.schema";

export type NotificationDocument = Notification & Document

export enum EnumNotification {
    DEFAULT = 'DEFAULT',
}

@Schema({
    collection: DATABASE_COLLECTIONS.NOTIFICATION
})
export class Notification {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        type: String,
        default: null
    })
    content: string

    @Prop({
        type: EnumNotification,
        default: EnumNotification.DEFAULT
    })
    type: EnumNotification

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

    @Prop({
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId
    })
    deletedBy?: User

    @Prop({
        type: SchemaTypes.Number
    })
    deletedAt?: number

    constructor(props: Partial<Notification>) {
        // super()
        Object.assign(this, props)
    }

}