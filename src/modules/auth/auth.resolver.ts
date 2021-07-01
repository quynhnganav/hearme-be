import { Parent, Query, ResolveField, Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ROLES } from 'src/constant';
import { AuthenticationInfo } from '../../schema';
import { MicroserviceService } from '../microservices/microservice.service';
import { EnumTypeSeesion } from '../session/schema/session.schema';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { GQLUnauthenticatedError } from './auth.error';
import { AuthService } from './auth.service';
import { NotAuthentication, UserGQL } from './decorator';
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
    async genTokenMeeting(
        @UserGQL() user: User
    ) {
        const token = await this.authService.signUserToken(user._id, EnumTypeSeesion.MEETINGAUTH);
        return {
            token,
            userId: user._id
        };
    }

    @Query()
    @NotAuthentication()
    async getRoles(): Promise<Role[]> {
        const roles = await this.authService.findAllRole();
        return roles;
    }

    @NotAuthentication()
    @Mutation()
    async loginGoogle(@Args('token') token: string): Promise<AuthenticationInfo> {
        const payload = await this.authService.verifyGoogleToken(token);
        if (!payload || !payload.email) throw new GQLUnauthenticatedError();
        let user: User
        let foundUser = await this.userService.findUserMatchAny([
            { email: payload.email.toLowerCase() },
            { username: payload.email.toLowerCase() }
        ]);
        if (!foundUser) {
            const rolesOfUser = await this.authService.findAllRole({ filter: { code: { $in: ["APP_MEMBER"] } } });

            user = await this.userService.saveUser({
                username: payload.email,
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                password: null,
                roles: rolesOfUser,
                isVerified: true,
                picture: payload.picture,
                socials: [{
                    name: "GOOGLE",
                    hash: payload.at_hash
                }]
            });
        } else {
            if (foundUser.isDeleted) throw new GQLUnauthenticatedError();
            if (foundUser.isLocked) throw new GQLUnauthenticatedError();
        }
        await this.authService.sendMail(payload.email, `${payload.family_name} ${payload.given_name}`)
        const tokenSigned = await this.authService.signUserToken(user?._id)
        // const tokenSigned = await this.authService.signUserToken(user?._id || foundUser?._id)
        return {
            token: tokenSigned,
            userId: user?._id
        }
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
        // await this.authService.sendMail('maiquang1470@gmail.com', `Mai Văn Quang`)
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
