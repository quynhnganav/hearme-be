import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { User } from "../user/schema/user.schema";
import { RegisterDoctorInputDTO } from "./dto/RegisterDoctorInput.dto";
import { Doctor, DoctorDocument } from "./schema/doctor.schema";


@Injectable()
export class DoctorService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.DOCTOR) private readonly doctorModel: Model<DoctorDocument> 
    ){}

    async findAll(args?: {
        filter?: FilterQuery<DoctorDocument>,
        sort?: any
    }): Promise<Doctor[]> {
        const { filter, sort } = args || { filter: {}, sort: {} }
        const doctors = await this.doctorModel.find({
            isDeleted: false,
            ...filter
        }).sort(sort);
        return doctors;
    }

    async findByUserId(id: string): Promise<Doctor> {
        return this.doctorModel.findOne({
            user: new User({ _id: id }),
            isActive: true,
            isDeleted: false
        }).exec()
    }

    async saveDoctor(doctor: any) {
        return this.doctorModel.create(doctor);
    }

    async registerDoctor(input: RegisterDoctorInputDTO, user: User ): Promise<Doctor> {
        const doctor = new this.doctorModel({
            ...input,
            user
        })
        await doctor.save()
        return doctor
    }

    async confirmDoctor(id: string): Promise<Doctor> {
        const doctor = await this.doctorModel.findOneAndUpdate({
            _id: id
        }, {
            isActive: true
        }, {
            new: true
        })
        return doctor
    }

    async lookDoctor(id: string): Promise<Doctor> {
        const doctor = await this.doctorModel.findOneAndUpdate({
            _id: id
        }, {
            isActive: false
        }, {
            new: true
        })
        return doctor
    }

}