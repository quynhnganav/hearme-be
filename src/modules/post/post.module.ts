import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "src/constant";
import { PostResolver } from "./post.resolver";
import { PostService } from "./post.service";
import { PostSchema } from './schemas/post.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.POST, schema: PostSchema }
        ])
    ],
    providers: [PostService, PostResolver],
    exports: [PostService]
})
export class PostModule {}