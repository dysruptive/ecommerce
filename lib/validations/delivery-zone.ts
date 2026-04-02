import { z } from "zod";

export const deliveryZoneSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  regions: z.string().min(1, "Regions are required").max(500),
  fee: z.coerce.number().min(0, "Fee cannot be negative"),
  isActive: z.boolean(),
});
