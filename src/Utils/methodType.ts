export const methodType = {
  NULL: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI",
  CRP: "CRP",
} as const;

export type MethodType = (typeof methodType)[keyof typeof methodType];
