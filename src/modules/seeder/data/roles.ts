import { AppRole, AppPermission } from "../../../constant";
import { permissionsObj } from "./permissions";

const rolesObj: { [key in AppRole]: { description: string, permissions: string[] } } = {
    APP_SUPERADMIN: {
        description: "Người quản trị hệ thống",
        permissions: Object.keys(permissionsObj)
    },
    APP_ADMIN: {
        description: "Quản trị viên",
        permissions: []
    },
    APP_MEMBER: {
        description: "Người dùng cơ bản",
        permissions: []
    },
}

export const roles: {
    type: string
    code: AppRole
    permissions: any[]
    description: string
}[] = Object.keys(rolesObj).map((k: AppRole) => ({
    type: "APP",
    code: k,
    permissions: rolesObj[k].permissions,
    description: rolesObj[k].description,
}))