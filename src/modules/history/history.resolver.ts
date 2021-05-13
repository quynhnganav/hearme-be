import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HistoryService } from "./history.service";
import { APP_PERMISSIONS, DATABASE_COLLECTIONS, PERMS } from '../../constant';
import { History } from './schema/history.schema';
import { NotAuthentication } from '../auth/decorator';
import { UserService } from '../user/user.service';
import { isValidObjectId } from 'mongoose';
import { NotObjectId } from '../graphql/gql.error';

@Resolver('GHistory')
export class HistoryResolver {

    constructor(
        private readonly historyService: HistoryService,
    ) {
    }

    @Query()
    @NotAuthentication()
    async histories(): Promise<History[]> {
        const histories = await this.historyService.findAll();
        return histories
    }

    @Query()
    @NotAuthentication()
    async historiesOfUser(@Args('userId') userId: string): Promise<History[]> {
        if (!isValidObjectId(userId)) throw new NotObjectId("userId not eq ObjectID");
        const histories = await this.historyService.historiesOfUser(userId);
        return histories;
    }

    @ResolveField('type')
    async resolverType(@Parent() history: History) {
        return Object.keys(DATABASE_COLLECTIONS).find(k => DATABASE_COLLECTIONS[k] == history.onModal)
    }

}
