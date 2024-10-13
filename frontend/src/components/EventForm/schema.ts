import * as z from 'zod';

// Define the Option type
export type Option = string;

// Define initial options
export const options: readonly string[] = [
    "chocolate",
    "strawberry",
    "vanilla",
];

// Define the form schema with Zod
export const eventFormSchema = z.object({
    title: z.string().min(1, "Event title is required"),
    location: z.string().min(1, "Location is required"),
    date: z.string().min(1, "Event date is required"),
    activities: z.array(z.object({
        value: z.string(),
        label: z.string()
    })).min(1, "At least one activity is required"),
    attendees: z.number().min(1, "Number of attendees must be at least 1"),
    // coverImage: z.instanceof(File).optional(),
    description: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;