export type UserStatus = "PENDING" | "SUCCESS" | "REJECTED";

export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export interface SystemConfig {
  minTransferAmount: number;
  maxTransferAmount: number;
  fixedFee: number;
  percentageFee: number;
}

