import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { APP_PERMISSIONS, DATABASE_COLLECTIONS } from "../../constant";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/schema/user.schema";
import { RegisterDoctorInputDTO } from "./dto/RegisterDoctorInput.dto";
import { Doctor, DoctorDocument } from "./schema/doctor.schema";
import { GQLDoctorExists } from './errors'


@Injectable()
export class DoctorService {

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.DOCTOR) private readonly doctorModel: Model<DoctorDocument>,
        private readonly authService: AuthService,
    ) { }

    async findAll(args?: {
        filter?: FilterQuery<DoctorDocument>,
        sort?: any
    }): Promise<Doctor[]> {
        const { filter, sort } = args || { filter: {}, sort: {} }
        const doctors = await this.doctorModel.find({
            isDeleted: false,
            ...filter
        }).sort(sort).populate('user');
        // console.log(doctors)
        return doctors;
    }


    async findOne(id: string): Promise<Doctor> {
        return this.doctorModel.findOne({ _id: id, isActive: true, isDeleted: false }).exec()
    }

    async findByUserId(id: string): Promise<Doctor> {
        const doctor = await this.doctorModel.findOne({
            user: new User({ _id: id }),
            // isActive: true,
            isDeleted: false
        }).populate('user').exec()
        // console.log(doctor)
        return doctor
    }

    async saveDoctor(doctor: any) {
        return this.doctorModel.create(doctor);
    }

    async registerDoctor(input: RegisterDoctorInputDTO, user: User): Promise<Doctor> {
        const checkDoctorExists = await this.doctorModel.findOne({ user: new User({ _id: user._id }), isDeleted: false }).exec()
        if (checkDoctorExists) throw new GQLDoctorExists()
        const doctor = new this.doctorModel({
            ...input,
            user
        })
        await doctor.save()
        await this.authService.addPermissionOfUser(APP_PERMISSIONS.DOCTOR_USER_PENDING, user._id)
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

    async getDoctorRs(user_id: string) {

    }

}