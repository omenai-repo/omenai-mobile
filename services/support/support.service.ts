import { EntityType, SupportCategory } from "../../types/types";
import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";
import { Message } from "../../store/support/supportChatStore";

export async function sendAiChatMessage(messages: Message[]) {
  try {
    const response = await fetch(`${apiUrl}/api/ai/chat`, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        messages,
        pageContext: "mobile_app",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response");
    }

    return await response.text();
  } catch (error) {
    throw error;
  }
}

type Payload = {
  category: SupportCategory;
  referenceId: string;
  message: string;
  pageUrl: string;
  entity: EntityType;
  userId: string;
  userEmail: string;
  meta: any;
  transactionDate?: string | null;
};

export async function createSupportTicket(payload: Payload) {
  try {
    const response = await fetch(`${apiUrl}/api/support`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
    });
    const result = await response.json();

    return {
      isOk: response.ok,
      message: result.message,
      ticketId: result.ticketId,
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
}

export async function fetchUserSupportTickets(params: URLSearchParams) {
  try {
    const response = await fetch(
      `${apiUrl}/api/support/fetchUserTickets?${params.toString()}`,
      {
        headers: {
          Origin: originHeader,
          "User-Agent": userAgent,
          Authorization: authorization,
        },
      },
    );

    const result = await response.json();

    return {
      isOk: response.ok,
      data: result.data,
      message: result.message,
      pagination: result.pagination,
      success: result.success,
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
}
