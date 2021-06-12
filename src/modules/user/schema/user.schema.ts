import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from 'src/modules/common/base.schema'
import { DATABASE_COLLECTIONS } from '../../../constant'
// import { IDFactory } from 'src/helper'
import { Permission } from '../../auth/schema/permission.schema'
import { Role } from '../../auth/schema/role.schema'

export type UserDocument = User & Document

@Schema({
    collection: DATABASE_COLLECTIONS.USER,
    timestamps: true
})
export class User{

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
    })
    username: string

    @Prop({
        required: true,
    })
    firstName: string

    @Prop({
        required: true,
    })
    lastName: string

    @Prop({
        type: SchemaTypes.Number
    })
    dob?: number

    @Prop()
    picture?: string

    @Prop({
        default: null
    })
    password?: string

    @Prop({
        default: null
    })
    email?: string

    @Prop([{
        type: SchemaTypes.ObjectId,
        ref: DATABASE_COLLECTIONS.ROLE
    }])
    roles: Role[]   // Chức vụ của user

    @Prop([{
        type: SchemaTypes.ObjectId,
        ref: DATABASE_COLLECTIONS.PERMISSION
    }])
    rejectPermissions: Permission[] // Loại bỏ những quyền của user

    @Prop([{
        type: SchemaTypes.ObjectId,
        ref: DATABASE_COLLECTIONS.PERMISSION
    }])
    permissions: Permission[] // Quyền thêm cho user

    @Prop({
        required: true,
        default: false
    })
    isDeleted: boolean

    @Prop({
        required: true,
        default: false
    })
    isLocked: boolean

    @Prop({
        required: true,
        default: false
    })
    isActive: boolean

    @Prop({
        required: true,
        default: false
    })
    isNoDelete: boolean

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

    constructor(props: Partial<User>) {
        // super()
        Object.assign(this, props)
    }

}

export const UserSchema = SchemaFactory.createForClass(User)