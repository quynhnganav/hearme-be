import { Session } from "../session/schema/session.schema";
import { User } from "../user/schema/user.schema";

export interface JWTTokenPayload {
    userId: string
    sessionId: string
}

export interface JWTVerifyPayload {
    user: User,
    session: Session
}