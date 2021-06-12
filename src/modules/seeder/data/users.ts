import { hashSync } from "bcrypt";
import { AppRole } from "../../../constant";
import * as moment from 'moment'

export const users: {
    username: string,
    password: string,
    firstName: string
    lastName: string
    email?: string
    roles: AppRole[],
    rejectPermissions: string[]
    isNoDelete?: boolean,
    dob?: number
}[] = [
    {
        username: "appadmin",
        password: hashSync("12345678", 11),
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@gmail.com",
        roles: ["APP_SUPERADMIN"],
        rejectPermissions: [],
        isNoDelete: true,
        dob: moment.now(),
    },
    {
        username: "user1",
        password: hashSync("12345678", 11),
        firstName: "User",
        lastName: "1",
        roles: ["APP_MEMBER"],
        rejectPermissions: [],
        dob: moment.now(),
    },
    {
        username: "doctor",
        password: hashSync("12345678", 11),
        firstName: "Doctor",
        lastName: "1",
        roles: ["APP_DOCTOR"],
        rejectPermissions: [],
        dob: moment.now(),
    },
    
]