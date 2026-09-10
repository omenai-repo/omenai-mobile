import React from "react";
import { Feather } from "@expo/vector-icons";

type VerifyResponse = {
  isOk: boolean;
  message?: string;
  status?: "completed" | "pending" | "failed" | "successful";
  success?: boolean;
};

interface TransactionStatusIconProps {
  verified: VerifyResponse | null;
  color: string;
}

export const TransactionStatusIcon = ({
  verified,
  color,
}: TransactionStatusIconProps) => {
  if (
    verified?.success ||
    verified?.status === "completed" ||
    verified?.status === "successful"
  ) {
    return <Feather name="check-circle" size={48} color={color} />;
  }

  if (verified?.status === "pending") {
    return <Feather name="clock" size={48} color={color} />;
  }

  return <Feather name="x-circle" size={48} color={color} />;
};
