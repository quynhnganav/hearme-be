
export const HEADER_TOKEN_KEY = "access-token"

export enum EnumDecorator {
    PERMISSIONS,
    ISAUTHEN,
    NOT_AUTHEN
}

export enum DATABASE_COLLECTIONS {
    PERMISSION = 'permissions',
    ROLE = 'roles',
    USER = 'users',
    HISTORY = 'histories',
    SESSION = 'sessions',
    POST = 'posts',
    COMMENT = 'comments'
}

export enum HISTORY_ACTION {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    RECOVERY = 'RECOVERY'
}


export const ROLE_TYPES = {
    APP_ROLE: 'APP_ROLE'
}

export const ROLES = {
    APP: {
        ADMIN: 'APP_ADMIN',
        SUPERADMIN: 'APP_SUPERADMIN',
        MEMBER: 'APP_MEMBER',
    } as const
}

export const PERMS = {

    /**
     * @description
     * APP (aka Application)
     * is the permission which
     * be assign to user through roles, the permissions grant user priviledges
     * that will be examined when particular user interact with app. For example, create user.
     */
    APP: {
        ADMIN_PAGE: 'APP_ADMIN_PAGE',
        ROLE_CREATE: 'APP_ROLE_CREATE',
        ROLE_VIEW: 'APP_ROLE_VIEW',
        ROLE_EDIT: 'APP_ROLE_EDIT',
        ROLE_DELETE: 'APP_ROLE_EDIT',
        PERMISSION_VIEW: 'APP_PERMISSION_VIEW',
        USER_VIEW: 'APP_USER_VIEW',
        USER_DELETE: 'APP_USER_DELETE',
        USER_EDIT: 'APP_USER_EDIT',
        USER_CREATE: 'APP_USER_CREATE',
    } as const,

}

type AppRoleKeys = keyof typeof ROLES.APP
export type AppRole = typeof ROLES.APP[AppRoleKeys]

type AppPermissionKeys = keyof typeof PERMS.APP
export type AppPermission = typeof PERMS.APP[AppPermissionKeys]

export const APP_PERMISSIONS = PERMS.APP;