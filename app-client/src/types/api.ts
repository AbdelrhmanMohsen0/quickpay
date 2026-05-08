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

export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type NotificationType = "USER_REGISTERED" | "TRANSACTION_SENT" | "TRANSACTION_RECEIVED" | "PAYMENT_FAILED";
export type NotificationStatus = "UNREAD" | "READ";

export interface Notification {
  id: string;
  receiverId: string;
  receiverName: string;
  type: NotificationType;
  title: string;
  shortMessage: string;
  message: string;
  status: NotificationStatus;
  metadata: string;
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
}
