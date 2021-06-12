import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "src/constant";
import { AuthModule } from "../auth/auth.module";
import { HistoryModule } from "../history/history.module";
import { PostResolver } from "./post.resolver";
import { PostService } from "./post.service";
import { PostSchema } from './schemas/post.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.POST, schema: PostSchema }
        ]),
        AuthModule,
        HistoryModule
    ],
    providers: [PostService, PostResolver],
    exports: [PostService]
})
export class PostModule {}