import { Schema, Prop, SchemaFactory, } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { User } from '../../user/schema/user.schema'
import { DATABASE_COLLECTIONS, HISTORY_ACTION } from '../../../constant'
import { Role } from '../../auth/schema/role.schema'
import { Permission } from '../../auth/schema/permission.schema'

export type HistoryDocument = History & Document

@Schema({
    collection: DATABASE_COLLECTIONS.HISTORY,
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
})
export class History {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
        refPath: "onModal"
    })
    document: User | Role | Permission

    @Prop({
        type: String,
        default: '',
    })
    documentLog: string

    @Prop({
        type: String,
        required: true,
        enum: DATABASE_COLLECTIONS
    })
    onModal: DATABASE_COLLECTIONS

    @Prop({
        type: String,
        required: true,
        enum: HISTORY_ACTION
    })
    action: HISTORY_ACTION

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

    constructor(props: Partial<History>) {
        Object.assign(this, props)
    }

}

export const HistorySchema = SchemaFactory.createForClass(History)
