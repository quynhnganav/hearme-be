import { ApolloError } from "apollo-server-express";

export class GQLUsernameExists extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'username is exists',
            code: 'GQL_USERNAME_EXISTS'
        }
        super(message, code)
    }
}

export class GQLUserNotFound extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'User not found',
            code: 'GQL_USER_NOTFOUND'
        }
        super(message, code)
    }
}