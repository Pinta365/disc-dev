import { BASE_API_URL } from "../constants.ts";

export async function makeAPIRequest(method: string, endpoint: string, data?: unknown, queryParams?: Record<string, any>) {
  const url = new URL(BASE_API_URL + endpoint);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString()); 
    });
  }

  const botToken = "";

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Authorization": `Bot ${botToken}`,
  };

  if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
}
