import { Parent, Query, ResolveField, Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthenticationInfo } from 'src/schema';
import { MicroserviceService } from '../microservices/microservice.service';
import { UserService } from '../user/user.service';
import { GQLUnauthenticatedError } from './auth.error';
import { AuthService } from './auth.service';
import { NotAuthentication } from './decorator';
import { LoginInputDTO } from './dto/login.dto';
import { Permission } from './schema/permission.schema';
import { Role, RoleDocument } from './schema/role.schema';

@Resolver()
export class AuthResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly micrService: MicroserviceService
    ) { }

    @Query()
    @NotAuthentication()
    async getRoles(): Promise<Role[]> {
        const roles = await this.authService.findAllRole();
        return roles;
    }

    @Mutation()
    @NotAuthentication()
    async login(@Args("info") input: LoginInputDTO): Promise<AuthenticationInfo> {
        this.micrService.sendNoti()
        const { username, password } = input;
        const user = await this.userService.findOne({
            filter: {
                isDeleted: false,
                $or: [
                    { username },
                    { email: username }
                ]
            }
        });
        if (!user) throw new GQLUnauthenticatedError('Tài khoản hoặc mật khẩu không đúng')
        const checkPassword = await this.authService.compareWithHashPwd(password, user.password)
        if (!checkPassword) throw new GQLUnauthenticatedError('Tài khoản hoặc mật khẩu không đúng')
        const token = await this.authService.signUserToken(user._id);
        return {
            token,
            userId: user._id
        };
    }

    @Mutation()
    async logout(@Context() ctx): Promise<boolean> {
        const { session, currentUser } = ctx;
        return this.authService.logout(session?.id, currentUser);
    }
}

@Resolver('GRole')
export class RoleResolver {

    constructor(
        private readonly authService: AuthService
    ) { }

    @ResolveField('permissions')
    async resolverPermission(@Parent() role: Role): Promise<Permission[]> {
        const ids = role.permissions
        const permissions = await this.authService.findAllPermission({
            filter: {
                _id: { $in: ids }
            }
        });
        return permissions
    }

}
