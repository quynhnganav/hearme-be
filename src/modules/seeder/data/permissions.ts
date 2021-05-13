import { AppPermission } from "../../../constant";

export const permissionsObj: { [key in AppPermission]: string } = {
    APP_ADMIN_PAGE: "Truy cập trang admin",
    APP_USER_VIEW: "Xem danh sách người dùng",
    APP_USER_CREATE: "Tạo mới người dùng",
    APP_USER_EDIT: "Chỉnh sửa người dùng",
    APP_USER_DELETE: "Xóa người dùng",
    APP_PERMISSION_VIEW: "Xem danh sách quyền",
    APP_ROLE_CREATE: "Tạo mới chức vụ",
    APP_ROLE_EDIT: "Chỉnh sửa chức vụ",
    APP_ROLE_VIEW: "Xem danh sách chức vụ"
}

export const permissions: {
    code: AppPermission,
    description: string
}[] = Object.keys(permissionsObj).map((p: AppPermission) => ({
    code: p,
    description: permissionsObj[p],
}))

console.log(permissions)