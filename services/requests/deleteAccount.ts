import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export type DeleteAccountResponse = {
  status: number;
  isOk?: boolean;
  message?: string;
  commitments?: { commitments?: Commitment[] } | Commitment[];
};

export async function deleteAccount(
  route: RouteIdentifier,
  session_id: string,
  reason: string
): Promise<DeleteAccountResponse> {
  try {
    const url = `${apiUrl}/api/requests/${route}/deleteAccount`;
    
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({ id: session_id, reason }),
      headers: {
        'Content-Type': 'application/json',
        'Origin': originHeader,
        'User-Agent': userAgent,
        'Authorization': authorization,
      },
    });

    const result = await res.json();
    
    return {
      isOk: res.ok,
      message: result.message || 'An error occurred',
      commitments: result.commitments,
      status: res.status,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error?.message || 'An error was encountered, please try again later or contact support',
      status: 500,
    };
  }
}

