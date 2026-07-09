export type PaymentGateway = "stripe" | "flutterwave";

export interface PaymentCustomer {
  email: string;
  name: string;
  phone?: string;
  phonenumber?: string;
}

export interface PaymentInitiateParams {
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  orderId: string;
  customer: PaymentCustomer;
  metadata: Record<string, any>;
  sellerId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  txRef?: string;
  error?: string;
}
