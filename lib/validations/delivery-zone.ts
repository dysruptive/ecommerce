import { z } from "zod";

export const deliveryZoneSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    type: z.enum(["FIXED", "COURIER"]).default("FIXED"),
    regions: z.string().max(500).optional().or(z.literal("")),
    fee: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
      z.number().min(0, "Fee cannot be negative").nullable(),
    ),
    isActive: z.boolean(),
  })
  .refine(
    (data) => data.type === "COURIER" || (!!data.regions && data.regions.length > 0),
    { message: "Regions are required for fixed delivery zones", path: ["regions"] },
  )
  .refine(
    (data) => data.type === "COURIER" || data.fee !== null,
    { message: "Fee is required for fixed delivery zones", path: ["fee"] },
  );
