import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { EnumDecorator } from "../../../constant";

export const RequirePermissions = (...perms: string[]) => SetMetadata(EnumDecorator.PERMISSIONS, perms)

export const IsAuthentication = () => SetMetadata(EnumDecorator.ISAUTHEN, true)
export const NotAuthentication = () => SetMetadata(EnumDecorator.NOT_AUTHEN, true)
export const IsDoctor = () => SetMetadata(EnumDecorator.IS_DOCTOR, true)

export const UserGQL = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { currentUser } = ctx.getArgByIndex(2) || { currentUser: null };
        return currentUser;
    }
)