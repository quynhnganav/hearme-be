
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { EnumStatusSchedule } from 'src/schema';
import { ScheduleService } from '../schedule/schedule.service';
import * as moment from 'moment'
@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectQueue('mail') private readonly mailQueue: Queue,
        private readonly scheduleService: ScheduleService
    ) { }

    @Cron('0 45 * * * *')
    async handleCron() {
        this.logger.debug('Called when the current second is 45');
        const now = moment()
        const scs = await this.scheduleService.findAll({
            filter: {
                isActive: true,
                isDeleted: false,
                status: EnumStatusSchedule.ACCEPTED,
                "appointment.date": now.clone().startOf('day').valueOf(),
                "appointment.from": now.hour() + 1
            }
        })
        for await (const s of scs) {
            console.log(s.doctor.email, s.client.email)
            const tokenDoctor = await this.scheduleService.genTokenMeeting(s.doctor._id)
            const tokenUser = await this.scheduleService.genTokenMeeting(s.client._id)
            if (s.doctor.email)
            await this.mailQueue.add('sendMaill', {
                email: s.doctor.email,
                name: `${s.doctor.firstName} ${s.doctor.lastName}`,
                title: 'Thông báo cuộc hẹn của bạn sắp diễn ra',
                content: `<p>Cuộc hẹn của bạn sẽ bắt đầu trong 15 phút nữa. Mời bạn truy cập <strong>https://hearme.techmark.cf/</strong> để truy cập.
                        Hoặc truy cập vào phòng https://meeting.techmark.cf/join?roomId=${s.code}&token=${tokenDoctor.token}</p>`
            })
            if (s.client.email)
            await this.mailQueue.add('sendMaill', {
                email: s.client.email,
                name: `${s.client.firstName} ${s.client.lastName}`,
                title: 'Thông báo cuộc hẹn của bạn sắp diễn ra',
                content: `<p>Cuộc hẹn của bạn sẽ bắt đầu trong 15 phút nữa. Mời bạn truy cập <strong>https://hearme.techmark.cf/</strong> để truy cập.
                        Hoặc truy cập vào phòng https://meeting.techmark.cf/join?roomId=${s.code}&token=${tokenDoctor.token}</p>`
            })
        }
    }
}