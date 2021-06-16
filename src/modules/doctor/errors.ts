import { ApolloError } from "apollo-server-express"

export class GQLDoctorExists extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Doctor is exists',
            code: 'GQL_DOCTOR_EXISTS'
        }
        super(message, code)
    }
}


export class GQLDoctorNotFound extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Doctor is Not Found',
            code: 'GQL_DOCTOR_NOT_FOUND'
        }
        super(message, code)
    }
}