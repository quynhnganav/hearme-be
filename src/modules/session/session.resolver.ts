import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SessionService } from "./session.service";
import { APP_PERMISSIONS, DATABASE_COLLECTIONS, PERMS } from '../../constant';
import { Session } from './schema/session.schema';
import { NotAuthentication } from '../auth/decorator';
import { UserService } from '../user/user.service';
import { isValidObjectId } from 'mongoose';
import { NotObjectId } from '../graphql/gql.error';

@Resolver()
export class SessionResolver {

    constructor(
        private readonly sessionService: SessionService,
    ) {
    }

    @Query()
    @NotAuthentication()
    async sessions(): Promise<Session[]> {
        const sessions = await this.sessionService.findAll();
        return sessions
    }

    // @Query()
    // @NotAuthentication()
    // async sessionsOfUser(@Args('userId') userId: string): Promise<Session[]> {
    //     if (!isValidObjectId(userId)) throw new NotObjectId("userId not eq ObjectID");
    //     const sessions = await this.sessionService.sessionsOfUser(userId);
    //     return sessions;
    // }

}
