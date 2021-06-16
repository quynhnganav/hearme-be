import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IsDoctor, UserGQL, DoctorGQL } from '../auth/decorator';
import { Doctor } from '../doctor/schema/doctor.schema';
import { User } from '../user/schema/user.schema';
import { BookScheduleInputDTO } from './dto/create-BookScheduleInput.dto';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schema/schedule.schema'
import { ClientDoctor } from '../../schema'
import { isEqual } from 'lodash'
import { DoctorService } from '../doctor/doctor.service';

@Resolver('GSchedule')
export class ScheduleResolver {

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly doctorService: DoctorService
    ) { }

    @Query()
    async myBookSchedules(
        @UserGQL() user: User
    ) {
        const myBook = await this.scheduleService.myBookSchedules(user._id)
        return myBook
    }

    @Query()
    @IsDoctor()
    async myBeBookSchedules(
        @DoctorGQL() doctor: Doctor
    ) {
        const myBook = await this.scheduleService.myBeBookSchedules(doctor._id)
        return myBook
    }

    @Query()
    async rSScheduleOfDoctor(
        @Args('time') time: number
    ) {
        return []
    }

    @Mutation()
    async bookSchedule(
        @Args('input') input: BookScheduleInputDTO,
        @UserGQL() user: User
    ) {
        const schedule = await this.scheduleService.createSchedule(input, user._id)
        console.log(schedule)
        return schedule
    }

    @Mutation()
    async confirmSchedule(
        @Args('id') id: string,
        @UserGQL() user: User,
    ) {
        return this.scheduleService.confirm(id, user._id)
    }

    @Mutation()
    async cancelSchedule(
        @Args('id') id: string,
        @UserGQL() user: User,
    ) {
        return this.scheduleService.cancel(id, user._id)
    }

    @ResolveField('isMe')
    async resolClient(
        @Parent() schedule: Schedule,
        @UserGQL() user: User,
    ) {
        if (isEqual(schedule.doctor._id, user?._id)) return ClientDoctor.DOCTOR
        if (isEqual(schedule.client._id, user?._id)) return ClientDoctor.CLIENT
        return ClientDoctor.OTHER
    }

    @ResolveField('doctor')
    async resolDoctor(
        @Parent() schedule: Schedule,
    ) {
        const doctor = await this.doctorService.findByUserId(schedule.doctor._id)
        if (doctor) doctor.user = schedule.doctor
        return doctor
    }

}