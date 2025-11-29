import React from "react";
import { Feather } from "@expo/vector-icons";

type VerifyResponse = {
  isOk: boolean;
  message?: string;
  status?: "completed" | "pending" | "failed";
  success?: boolean;
};

interface TransactionStatusIconProps {
  verified: VerifyResponse | null;
  color: string;
}

export const TransactionStatusIcon = ({ verified, color }: TransactionStatusIconProps) => {
  if (!verified?.isOk)
    return <Feather name="x-circle" size={48} color={color} />;
  if (verified.status === "completed")
    return (
      <Feather name="check-circle" size={48} color={color} />
    );
  if (verified.status === "pending")
    return <Feather name="clock" size={48} color={color} />;
  return <Feather name="x-circle" size={48} color={color} />;
};
