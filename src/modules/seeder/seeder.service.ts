import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { permissions, roles, users, doctors } from "./data";
import { DoctorService } from '../doctor/doctor.service';
import { User } from '../user/schema/user.schema';

@Injectable()
export class SeederService {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly doctorService: DoctorService
    ) { }

    async seederPermission() {
        const permissionsFound = await this.authService.findAllPermission();
        if (!permissionsFound || permissionsFound.length < 1) await this.authService.insertManyPermission(permissions);
        console.log("Permission Seeder");
        
        const rolesFound = await this.authService.findAllRole();
        if (!rolesFound || rolesFound.length< 1) {
             for await(const role of roles) {
                const permissionOfRoles = await this.authService.findAllPermission({ filter: { code: { $in: role.permissions } } })
                const newRole = await this.authService.saveRole({
                    _id: null,
                    code: role.code,
                    type: "APP_ROLE",
                    description: role.description,
                    permissions: permissionOfRoles
                });
                // const idsPermission = permissionsFound.map(k => k._id);
            }
        }
        console.log("Role Seeder");

        const usersFound = await this.userService.findAll();
        if (!usersFound || usersFound.length < 1) {
            for await(const user of users) {
                const rolesOfUser = await this.authService.findAllRole({ filter: { code: { $in: user.roles } } });
                const newUser = await this.userService.saveUser({
                    ...user,
                    isActive: true,
                    roles: rolesOfUser
                })
            }
            
        }

        console.log("User Seeder");

        const doctorsFound = await this.doctorService.findAll();
        
        if (!doctorsFound || doctorsFound.length < 1) {
            for await(const doctor of doctors) {
                const userOfDoctor = await this.userService.findOne({ filter: { username: doctor.username } });
                if (!userOfDoctor) continue
                await this.doctorService.saveDoctor({
                    ...doctor,
                    user: new User({ _id: userOfDoctor._id }),
                })
            }
        }

        console.log("Doctor Seeder");
        
    }

}
