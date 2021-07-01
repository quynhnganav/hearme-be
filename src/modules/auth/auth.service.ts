import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppPermission, DATABASE_COLLECTIONS, CLIENT_ID_GOOGLE } from '../../constant';
import { User } from '../user/schema/user.schema';
import { FilterQuery, isValidObjectId, Model } from "mongoose";
import { Permission, PermissionDocument } from './schema/permission.schema';
import { Role, RoleDocument } from "./schema/role.schema";
import { sign, verify } from 'jsonwebtoken'
import { JWTTokenPayload, JWTVerifyPayload } from './auth.interface';
import { ConfigurationService } from '../config/config.service';
import { compare, hash } from 'bcrypt'
import { differenceBy, uniqBy } from "lodash";
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { JwtService } from "@nestjs/jwt";
import { EnumTypeSeesion } from '../session/schema/session.schema';
import { OAuth2Client, TokenPayload } from "google-auth-library";
import * as nodemailer from "nodemailer";
import * as moment from 'moment';

@Injectable()
export class AuthService {

    private clientGoogle = new OAuth2Client(CLIENT_ID_GOOGLE);

    constructor(
        @InjectModel(DATABASE_COLLECTIONS.PERMISSION) private permissionModel: Model<PermissionDocument>,
        @InjectModel(DATABASE_COLLECTIONS.ROLE) private roleModel: Model<RoleDocument>,
        private readonly configSrv: ConfigurationService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly jwtService: JwtService
    ) { }

    async sendMail(email: string, name: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'vanquangmai20@gmail.com',
                pass: 'wosgwbrjwaypgnvb',
            }
        })
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'hearMe - ClosureJS Team',
            to: email,
            subject: 'Welcome to hearMe',
            text: 'You recieved message from vanquangmai20@gmail.com',
            html: `<h1>Dear ${name},</h1><p>Welcome to hearMe, designed by ClosureJS</p><p>Login at: ${moment().format("HH:mm DD-MM-YYYY")}</p>`
        }
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                console.log(err);
                // res.redirect('/');
            } else {
                console.log(info);
                // res.redirect('/');
            }
        });
    }

    async logout(sessionId: string, userUpdate: User): Promise<boolean> {
        try {
            if (!isValidObjectId(sessionId)) throw new Error()
            await this.sessionService.updateOne({
                filter: { _id: sessionId },
                update: {
                    active: false,
                    isDeleted: true,
                },
                userUpdate
            });
        } catch (error) {
            return false
        }
        return true
    }

    async verifyToken(token: string): Promise<JWTVerifyPayload> {
        const payload: JWTTokenPayload = await this.jwtService.verify(token);
        if (!payload || !payload.userId || !payload.sessionId) throw new Error()
        const { userId, sessionId } = payload;
        const session = await this.sessionService.findOne({
            filter: { _id: sessionId, isDeleted: { $ne: true } }
        });
        if (!session) throw new Error();
        const user = await this.userService.findOne({
            filter: {
                _id: userId, isDeleted: { $ne: true }, isLocked: { $ne: true }
            }
        });
        if (!user) throw new Error();
        return {
            user,
            session
        }
    }

    async verifyGoogleToken(idToken: string): Promise<TokenPayload> {
        try {
            const ticket = await this.clientGoogle.verifyIdToken({
                idToken,
                audience: [CLIENT_ID_GOOGLE],
            });
            const payload = ticket.getPayload();
            return payload;
        } catch (error) {
            console.log(error)
            return undefined;
        }
    }


    public async findPermission(userId: string): Promise<Permission[]> {
        return []
    }

    public hashPassword(rawPassword: string): Promise<string> {
        return hash(rawPassword, this.configSrv.getPasswordHashSalt())
    }

    public async compareWithHashPwd(rawPwd: string, hashedPwd: string) {
        return compare(rawPwd, hashedPwd)
    }

    public async signUserToken(userId: string, typeSeesion?: EnumTypeSeesion): Promise<string> {
        const session = await this.sessionService.createSession({
            createdBy: new User({ _id: userId }),
            type: typeSeesion ?? EnumTypeSeesion.LOGIN
        })
        const token = await this.jwtService.sign(
            { userId, sessionId: session._id }
        )
        return token
    }

    public async savePermission(permission: Permission) {
        const newPermission = new this.permissionModel(permission)
        return newPermission.save()
    }

    public async insertManyPermission(permissions: any[]) {
        return this.permissionModel.insertMany(permissions);
    }

    public async insertManyRole(roles: any[]) {
        return this.roleModel.insertMany(roles);
    }

    public async insertOneRole(role) {
        return this.roleModel.create(role)
    }

    public async saveRole(role: Role) {
        const newRole = new this.roleModel(role)
        return newRole.save()
    }

    public async findOnePermission(args?: {
        filter?: FilterQuery<PermissionDocument>
    }): Promise<Permission> {
        const { filter } = args || { filter: {} }
        return this.permissionModel.findOne(filter);
    }

    public async findOneRole(args?: {
        filter?: FilterQuery<RoleDocument>
    }): Promise<Role> {
        const { filter } = args || { filter: {} }
        return this.roleModel.findOne(filter);
    }

    public async findAllPermission(args?: {
        filter?: FilterQuery<PermissionDocument>
    }): Promise<Permission[]> {
        const { filter } = args || { filter: {} }
        return this.permissionModel.find(filter);
    }

    public async findAllRole(args?: {
        filter?: FilterQuery<RoleDocument>,
        populate?: any
    }): Promise<Role[]> {
        const { filter, populate } = args || { filter: {}, populate: [] }
        const roles = await this.roleModel.find(filter).populate(populate);
        return roles;
    }

    async findPermissionOfUser(user: User | string): Promise<Permission[]> {
        if (typeof user === "string") user = await this.userService.findOne({ filter: { _id: user, isDelete: false } });
        if (!user) return [];
        const roleIds = user.roles
        const roles = await this.findAllRole({
            filter: {
                _id: { $in: roleIds }
            }
        });
        const permissionsOfRole = roles.reduce((prev, r) => r.permissions, []);
        const permissionOfUser = uniqBy([...user.permissions, ...permissionsOfRole], '_id')
        const permissionIds = differenceBy(permissionOfUser, user.rejectPermissions, '_id');
        return this.findAllPermission({
            filter: {
                _id: { $in: permissionIds }
            }
        })
    }

    async addPermissionOfUser(permissionCode: AppPermission, user_id: string) {
        const permission = await this.findOnePermission({ filter: { code: permissionCode } })
        if (!permission) return null
        await this.clearPermi(permission._id, user_id)
        await this.userService.updateOne({
            id: user_id,
            update: {

            },
            context: {
                currentUser: {
                    _id: user_id
                }
            },
            updateQuery: {
                $push: {
                    "permissions": permission._id
                }
            }
        })
    }

    async removePermissionOfUser(permissionCode: AppPermission, user_id: string) {
        const permission = await this.findOnePermission({ filter: { code: permissionCode } })
        if (!permission) return null
        await this.clearPermi(permission._id, user_id)
        await this.userService.updateOne({
            id: user_id,
            update: {

            },
            context: {
                currentUser: {
                    _id: user_id
                }
            },
            updateQuery: {
                $push: {
                    "rejectPermissions": permission._id
                }
            }
        })
    }


    async clearPermi(permissionId: string, user_id: string) {
        await this.userService.updateOne({
            id: user_id,
            update: {

            },
            context: {
                currentUser: {
                    _id: user_id
                }
            },
            updateQuery: {
                $pull: {
                    "permissions": permissionId
                }
            }
        })
        await this.userService.updateOne({
            id: user_id,
            update: {

            },
            context: {
                currentUser: {
                    _id: user_id
                }
            },
            updateQuery: {
                $pull: {
                    "rejectPermissions": permissionId
                }
            }
        })
    }

}
