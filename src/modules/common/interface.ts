import { FilterQuery } from "mongoose";

export interface BaseService<SCHEMA, DOCUMENT, DTO_CREATE, DTO_UPDATE> {

    findAll(args?: {
        filter: FilterQuery<DOCUMENT>
        sort?: any
    }): Promise<SCHEMA[]>

    findOne(args?: {
        filter: FilterQuery<DOCUMENT>
        sort?: any
    }): Promise<SCHEMA>


    create(args: {
        input: DTO_CREATE
        context?: any
    }): Promise<SCHEMA>

    updateOne(args: {
        filter?: FilterQuery<SCHEMA>
        id: string
        update: DTO_UPDATE
        context?: any
    }): Promise<SCHEMA>

    updateMany(args: {
        filter?: FilterQuery<DOCUMENT>,
        update: DTO_UPDATE
        context?: any
    }): Promise<SCHEMA[]>

    deleteMany(args: {
        filter?: FilterQuery<DOCUMENT>
        ids?: string[]
        context?: any
    }): Promise<SCHEMA[]>

}