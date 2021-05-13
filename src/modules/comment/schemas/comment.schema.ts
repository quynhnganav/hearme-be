import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { DATABASE_COLLECTIONS } from 'src/constant'
import { BaseSchema } from 'src/modules/common/base.schema'
import { Post } from 'src/modules/post/schemas/post.schema'
import { User } from 'src/modules/user/schema/user.schema'

export type CommentDocument = Comment & Document

@Schema({
    collection: DATABASE_COLLECTIONS.COMMENT
})
export class Comment {

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
    })
    content: string

    @Prop({
        default: null
    })
    image?: string

    @Prop({
        required: true,
        type: SchemaTypes.ObjectId,
        ref: DATABASE_COLLECTIONS.POST
    })
    post: Post

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

    constructor(props: Partial<Comment>) {
        // super()
        Object.assign(this, props)
    }

}

export const UserSchema = SchemaFactory.createForClass(Comment)
