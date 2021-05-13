import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { DATABASE_COLLECTIONS, ROLE_TYPES } from '../../../constant'
import { Permission } from './permission.schema'

export type RoleDocument = Role & Document

@Schema({
    collection: DATABASE_COLLECTIONS.ROLE
})
export class Role {
    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop()
    code: string

    @Prop({ required: false })
    description?: string

    @Prop({ enum: Object.values(ROLE_TYPES) })
    type: string

    @Prop([{
        type: SchemaTypes.ObjectId,
        ref: DATABASE_COLLECTIONS.PERMISSION
    }])
    permissions?: Permission[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
