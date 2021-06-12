import { generateRandomString } from "../../common/fucntion";

export const doctors: {
    code: string,
    experience: number,
    username: string,
    slogan?: string,
    isActive: boolean
}[] = [
    {
        code: generateRandomString(6),
        experience: 0,
        username: 'doctor',
        slogan: 'Hết mình vì mọi người',
        isActive: true
    }
]