export type TransactionStatus = "PENDING" | "SUCCESS" | "REJECTED";
export type TransactionTransferType = "SENT" | "RECEIVED";

export interface TransactionUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionTransferType;
  userInfo: TransactionUserDTO;
  rejectionReason: string | null;
  timestamp: string;
}

export interface WalletBalance {
  balance: number;
}
