export const methodType = {
  NULL: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI",
  CRP: "CRP",
  LUC: "LUC",
  LTC: "LTC",
} as const;

export type MethodType = (typeof methodType)[keyof typeof methodType];
