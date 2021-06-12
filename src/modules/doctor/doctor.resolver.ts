import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserGQL } from '../auth/decorator';
import { User } from '../user/schema/user.schema';
import { DoctorService } from './doctor.service';
import { RegisterDoctorInputDTO } from './dto/RegisterDoctorInput.dto';
import { Doctor } from './schema/doctor.schema';

@Resolver('GDoctor')
export class DoctorResolver {

    constructor(
        private readonly doctorService: DoctorService
    ){}
    
    @Query()
    async doctors(): Promise<Doctor[]> {
        const doctors = await this.doctorService.findAll({
            sort: { createdAt: -1 },
            filter: { isDeleted: false }
        })
        return doctors
    }

    @Mutation()
    async registerDoctor(
        @Args('input') input: RegisterDoctorInputDTO,
        @UserGQL() user: User
    ): Promise<Doctor> {
        return this.doctorService.registerDoctor(input, user)
    }

    @Mutation()
    async confirmDoctor(
        @Args('id') id: string
    ): Promise<Doctor> {
        return this.doctorService.confirmDoctor(id)
    }

    @Mutation()
    async lookDoctor(
        @Args('id') id: string
    ): Promise<Doctor> {
        return this.doctorService.lookDoctor(id)
    }

}