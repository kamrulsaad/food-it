export const VEHICLETYPES = ["BICYCLE", "MOTORCYCLE"] as const;

export type VehicleType = (typeof VEHICLETYPES)[number];
