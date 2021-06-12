import { ApolloError } from "apollo-server-express";

export class GQLPostExists extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Post is exists',
            code: 'GQL_POST_EXISTS'
        }
        super(message, code)
    }
}

export class GQLPostNotFound extends ApolloError {
    constructor(args?: {
        message?: string
        code?: string
    }) {
        const { code, message } = args || {
            message: 'Post is Not Found',
            code: 'GQL_POST_NOT_FOUND'
        }
        super(message, code)
    }
}