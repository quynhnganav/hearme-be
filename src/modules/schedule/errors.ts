import { ApolloError } from "apollo-server-express";

export class GQLScheduleExists extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Schedule is exists',
            code: 'GQL_SCHEDULE_EXISTS'
        }
        super(message, code)
    }
}

export class GQLScheduleNotFound extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Schedule is Not Found',
            code: 'GQL_SCHEDULE_NOT_FOUND'
        }
        super(message, code)
    }
}

export class GQLScheduleConfirmError extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Confirm error',
            code: 'GQL_SCHEDULE_CONFIRM_ERROR'
        }
        super(message, code)
    }
}

export class GQLScheduleSpamError extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'User is Spam',
            code: 'GQL_SCHEDULE_SPAM_ERROR'
        }
        super(message, code)
    }
}

export class GQLScheduleDoctorBusy extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'DOCTOR BUSY',
            code: 'GQL_SCHEDULE_DOCTOR_BUSY'
        }
        super(message, code)
    }
}