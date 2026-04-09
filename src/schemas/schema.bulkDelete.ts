import { z } from "zod";

export const BulkDeleteSeatsSchema = z.object({
    total_seats:z.coerce.number().max(500),
    showtime_public_id: z.string()
}).strict();

export type BulkDeleteSeatsInput = z.infer<typeof BulkDeleteSeatsSchema>;