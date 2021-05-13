import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { AppPermission, DATABASE_COLLECTIONS, PERMS } from '../../../constant'
export type PermissionDocument = Permission & Document

@Schema({
    collection: DATABASE_COLLECTIONS.PERMISSION
})
export class Permission {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
        type: String,
        enum: [PERMS.APP].reduce((acc, cur) => {
            acc.push(...Object.values(cur))
            return acc
        }, [])
    })
    code: AppPermission

    @Prop()
    description: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)
