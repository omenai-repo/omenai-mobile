import { EntityType, SupportCategory } from "#types/types";
import { apiUrl } from "#constants/apiUrl.constants";
import { Message } from "#store/account/support/supportChatStore";
import { apiRequest } from "#utils/network/apiRequest";

export async function sendAiChatMessage(messages: Message[]) {
  const response = await apiRequest(`${apiUrl}/api/ai/chat`, {
    method: "POST",
    body: JSON.stringify({
      messages,
      pageContext: "mobile_app",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  return await response.text();
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
    const response = await apiRequest(`${apiUrl}/api/support`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    return {
      isOk: response.ok,
      message: result.message,
      ticketId: result.ticketId,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error was encountered, please try again later or contact support",
      },
    };
  }
}

export async function fetchUserSupportTickets(params: URLSearchParams) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/support/fetchUserTickets?${params.toString()}`,
    );

    const result = await response.json();

    return {
      isOk: response.ok,
      data: result.data,
      message: result.message,
      pagination: result.pagination,
      success: result.success,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error was encountered, please try again later or contact support",
      },
    };
  }
}
