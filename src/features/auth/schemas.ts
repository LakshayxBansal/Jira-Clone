import {z} from "zod";


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1,"Required"),
});

export const RegisterSchema = z.object({
    name: z.string().trim().min(1,"Minimum 1 character required").max(256),
    email: z.string().email(),
    password: z.string().min(8,"Minimum 8 characters required"),
});