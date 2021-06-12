import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { APP_PERMISSIONS } from "src/constant";
import { AuthService } from "../auth/auth.service";
import { RequirePermissions } from "../auth/decorator";
import { User } from "../user/schema/user.schema";
import { CreatePostInputDTO } from "./dto/create-post.dto";
import { UpdatePostInputDTO } from "./dto/update-post.dto";
import { PostService } from "./post.service";
import { Post } from "./schemas/post.schema";

@Resolver('GPost')
export class PostResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly postService: PostService,
    ) { }

    @Query()
    @RequirePermissions(APP_PERMISSIONS.USER_VIEW)
    async posts(@Context() ctx): Promise<Post[]> {
        const posts = await this.postService.findAll({
            sort: { createdAt: -1 },
            filter: { isDeleted: false }
        })
        return posts;
    }

    @Query()
    async postOfMe(@Context() ctx): Promise<Post[]> {
        const posts = await this.postService.findAll({
            filter: { createdBy: new User({ _id: ctx?.currentUser?._id }) },
            sort: { createdAt: -1 }
        });
        return posts;
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_CREATE)
    async createdPost(
        @Context() ctx,
        @Args('input') input: CreatePostInputDTO
    ): Promise<Post> {
        const newPost = await this.postService.create({
            input,
            context: ctx
        })
        return newPost;
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_EDIT)
    async updatedPost(
        @Context() context,
        @Args('input') update: UpdatePostInputDTO,
        @Args('id') id: string
    ): Promise<Post> {
        const newPost = await this.postService.updateOne({
            id, 
            update,
            context,
        })
        return newPost
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_DELETE)
    async removedPosts(
        @Context() context,
        @Args('ids') ids: string[]
    ): Promise<Post[]> {
        const posts = await this.postService.deleteMany({
            ids,
            context
        })
        return posts
    }

    @ResolveField('likes')
    async likesField(@Parent() post: Post): Promise<number>{
        return post?.likes?.length || 0
    }

    @ResolveField('comments')
    async commentsField(@Parent() post: Post): Promise<number>{
        return 0;
    }

}