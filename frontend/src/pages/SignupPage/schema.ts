import * as z from 'zod';

// Define the schema for both steps
export const schema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    dob: z.string().min(1, "Date of birth is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    occupation: z.string().min(1, "Occupation is required"),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Please select a gender" }) }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});



export type FormData = z.infer<typeof schema>;
