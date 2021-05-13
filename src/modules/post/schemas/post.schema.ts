import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose'
import { DATABASE_COLLECTIONS } from 'src/constant'
import { BaseSchema } from 'src/modules/common/base.schema'
import { User } from 'src/modules/user/schema/user.schema'

export type PostDocument = Post & Document

@Schema({
    collection: DATABASE_COLLECTIONS.POST
})
export class Post extends BaseSchema{

    @Prop({
        type: SchemaTypes.ObjectId,
        default: Types.ObjectId
    })
    _id: string

    @Prop({
        required: true,
    })
    text: string

    @Prop({
        default: null
    })
    medias?: string[]

    @Prop([{
        required: true,
        ref: DATABASE_COLLECTIONS.USER,
        type: SchemaTypes.ObjectId
    }])
    likes: User[]

    constructor(props: Partial<Post>) {
        super()
        Object.assign(this, props)
    }

}

export const UserSchema = SchemaFactory.createForClass(Post)
