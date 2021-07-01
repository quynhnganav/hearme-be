import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './schema/user.schema';
import { UserService } from "./user.service";
import { Permission } from '../auth/schema/permission.schema';
import { Role } from '../auth/schema/role.schema';
import { AuthService } from '../auth/auth.service';
import { differenceBy } from "lodash";
import { IsAuthentication, NotAuthentication, RequirePermissions } from '../auth/decorator';
import { APP_PERMISSIONS, PERMS } from '../../constant';
import { CreateUserInputDTO } from './dto/create-user.dto';
import { UpdateUserInputDTO } from './dto/update-user.dto';
import { TelegramService } from '../telegram/telegram.service';
import * as moment from "moment";

@Resolver('GUser')
export class UserResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly telegramService: TelegramService
    ) { }

    @Query()
    async me(@Context() ctx): Promise<User> {
        const { currentUser } = ctx;
        // this.telegramService.sendMessage(
        //     "-577272799",
        //     `[${currentUser.email}] - ${currentUser.firstName} ${currentUser.lastName}: Load at ${moment().format("HH:mm DD-MM-YYYY")}`
        // )
        return currentUser;
    }

    @Query()
    @RequirePermissions(APP_PERMISSIONS.USER_VIEW)
    async users(@Context() ctx): Promise<User[]> {
        const users = await this.userService.findAll({
            sort: { createdAt: -1 },
            filter: { isDeleted: false }
        })
        return users;
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_CREATE)
    async createUser(
        @Context() ctx,
        @Args('input') input: CreateUserInputDTO
    ): Promise<User> {
        const newUser = await this.userService.create({
            input,
            context: ctx
        })
        return newUser;
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_EDIT)
    async updateUser(
        @Context() context,
        @Args('input') update: UpdateUserInputDTO,
        @Args('id') id: string
    ): Promise<User> {
        const newUser = await this.userService.updateOne({
            id,
            update,
            context,
        })
        return newUser
    }

    @Mutation()
    @RequirePermissions(APP_PERMISSIONS.USER_DELETE)
    async removeUsers(
        @Context() context,
        @Args('ids') ids: string[]
    ): Promise<User[]> {
        const users = await this.userService.deleteMany({
            ids,
            context
        })
        return users
    }

    @ResolveField('role')
    async roles(@Parent() user: User): Promise<Role> {
        if (!user.roles[0]) return null
        const role = await this.authService.findOneRole({
            filter: {
                _id: user.roles[0] || ""
            }
        });
        return role
    }

    @ResolveField('permissions')
    async permissions(@Parent() user: User): Promise<string[]> {
        const permissions = await this.authService.findPermissionOfUser(user);
        return permissions.map(p => p.code)
    }

    @ResolveField('fullName')
    async fullName(@Parent() user: User): Promise<string> {
        return `${user.firstName} ${user.lastName}`;
    }

    @ResolveField('createdBy')
    async createdBy(@Parent() user: User): Promise<User> {
        return this.userService.findOne({
            filter: { _id: user?.createdBy?._id }
        })
    }

}
