import { Prop } from "@nestjs/mongoose"
import { SchemaTypes } from "mongoose"
import { DATABASE_COLLECTIONS } from "src/constant"
import { User } from '../user/schema/user.schema'


export class BaseSchema {
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

    constructor() {
        // Object.assign(this, props)
    }

}