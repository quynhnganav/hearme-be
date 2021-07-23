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
import { AuthService } from '../auth/auth.service';
import { EnumTypeSeesion } from '../session/schema/session.schema';

@Resolver('GSchedule')
export class ScheduleResolver {

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly doctorService: DoctorService,
        private readonly authService: AuthService
    ) { }

    @Query()
    async myBookSchedules(
        @UserGQL() user: User
    ) {
        const myBook = await this.scheduleService.myBookSchedules(user._id)
        return myBook
    }

    @Query()
    async myBookSchedulesApprove(
        @UserGQL() user: User
    ) {
        const myBook = await this.scheduleService.myBookSchedulesApprove(user._id)
        return myBook
    }

    @Query()
    async myBookSchedulesUpcoming(
        @UserGQL() user: User
    ) {
        const myBook = await this.scheduleService.myBookSchedulesUpcoming(user._id)
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
        @Args('time') time: number,
        @Args('user_id') user_id: string
    ) {
        return this.scheduleService.rSScheduleOfDoctor(user_id, time)
    }

    @Query()
    async genTokenMeeting(
        @UserGQL() user: User,
        @Args('id') id: string
    ) {
        await this.scheduleService.checkMeetingStart(id, user._id)
        const token = await this.authService.signUserToken(user._id, EnumTypeSeesion.MEETINGAUTH);
        return {
            token,
            userId: user._id
        };
    }

    @Mutation()
    async bookSchedule(
        @Args('input') input: BookScheduleInputDTO,
        @UserGQL() user: User
    ) {
        const schedule = await this.scheduleService.createSchedule(input, user._id)
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

    @Mutation()
    async deniedSchedule(
        @Args('id') id: string,
        @UserGQL() user: User,
    ) {
        return this.scheduleService.denied(id, user._id)
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