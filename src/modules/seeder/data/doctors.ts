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
        slogan: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam ipsam qui doloribus? Deserunt doloribus voluptate veritatis provident voluptates voluptas, in nesciunt soluta iure pariatur alias laborum cum, corporis consectetur ad dignissimos officia incidunt. 
        Maiores, dolorem nemo delectus animi blanditiis incidunt doloremque, asperiores ut exercitationem ex sit illo esse sed tempore.`,
        isActive: true
    },
    {
        code: generateRandomString(6),
        experience: 0,
        username: 'doctor',
        slogan: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam ipsam qui doloribus? Deserunt doloribus voluptate veritatis provident voluptates voluptas, in nesciunt soluta iure pariatur alias laborum cum, corporis consectetur ad dignissimos officia incidunt. 
        Maiores, dolorem nemo delectus animi blanditiis incidunt doloremque, asperiores ut exercitationem ex sit illo esse sed tempore.`,
        isActive: true
    },
    {
        code: generateRandomString(6),
        experience: 0,
        username: 'doctor',
        slogan: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam ipsam qui doloribus? Deserunt doloribus voluptate veritatis provident voluptates voluptas, in nesciunt soluta iure pariatur alias laborum cum, corporis consectetur ad dignissimos officia incidunt. 
        Maiores, dolorem nemo delectus animi blanditiis incidunt doloremque, asperiores ut exercitationem ex sit illo esse sed tempore.`,
        isActive: true
    }
]