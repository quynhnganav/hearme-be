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
    APP_ROLE_VIEW: "Xem danh sách chức vụ",
    APP_DOCTOR_CREATE: "Tạo mới bác sĩ",
    APP_DOCTOR_DELETE: "Xóa bác sĩ",
    APP_DOCTOR_EDIT: "Chỉnh sửa bác sĩ",
    APP_DOCTOR_USER: "Truy cập vào bác sĩ",
    APP_POST_DELETE: "Xóa bài viết của người dùng",
    APP_POST_LOCK: "Khóa bài viết của người dùng",
    DOCTOR_USER_PENDING: 'Chờ làm doctor'
}

export const permissions: {
    code: AppPermission,
    description: string
}[] = Object.keys(permissionsObj).map((p: AppPermission) => ({
    code: p,
    description: permissionsObj[p],
}))

// console.log(permissions)