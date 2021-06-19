
export const HEADER_TOKEN_KEY = "access-token"

export enum EnumDecorator {
    PERMISSIONS,
    ISAUTHEN,
    NOT_AUTHEN,
    IS_DOCTOR
}

export enum DATABASE_COLLECTIONS {
    PERMISSION = 'permissions',
    ROLE = 'roles',
    USER = 'users',
    HISTORY = 'histories',
    SESSION = 'sessions',
    POST = 'posts',
    COMMENT = 'comments',
    MESSAGE = 'messages',
    DOCTOR = 'doctors',
    SCHEDULE = 'schedules'
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
        DOCTOR: 'APP_DOCTOR'
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
        POST_LOCK : 'APP_POST_LOCK',
        POST_DELETE: 'APP_POST_DELETE',
        DOCTOR_CREATE: 'APP_DOCTOR_CREATE',
        DOCTOR_DELETE: 'APP_DOCTOR_DELETE',
        DOCTOR_EDIT: 'APP_DOCTOR_EDIT',
        DOCTOR_USER: 'APP_DOCTOR_USER',
        DOCTOR_USER_PENDING: 'DOCTOR_USER_PENDING'
    } as const,

}

type AppRoleKeys = keyof typeof ROLES.APP
export type AppRole = typeof ROLES.APP[AppRoleKeys]

type AppPermissionKeys = keyof typeof PERMS.APP
export type AppPermission = typeof PERMS.APP[AppPermissionKeys]

export const APP_PERMISSIONS = PERMS.APP;