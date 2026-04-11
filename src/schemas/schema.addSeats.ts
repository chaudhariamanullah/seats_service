import { z } from "zod";

export const AddSeatsSchema = z.object({
    total_seats:z.coerce.number().max(100),
    showtime_public_id: z.string()
}).strict();

export type AddSeatsInput = z.infer<typeof AddSeatsSchema>;
