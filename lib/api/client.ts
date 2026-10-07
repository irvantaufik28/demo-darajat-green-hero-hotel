// Public site API client. Next proxies these requests to the backend API
// (see next.config.ts rewrites), so the browser only ever talks to this origin.
const apiBaseUrl = "/api/v1/public";

type ApiErrorPayload = {
  error?: { code?: string; message?: string };
  message?: string;
};

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  bearerToken?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const raw = await response.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const payload = data as ApiErrorPayload | null;
    throw new ApiError(
      payload?.error?.message ?? payload?.message ?? response.statusText ?? "Request failed.",
      response.status,
      payload?.error?.code,
    );
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, bearerToken, headers: suppliedHeaders, ...requestOptions } = options;
  const headers = new Headers(suppliedHeaders);
  if (bearerToken) headers.set("Authorization", `Bearer ${bearerToken}`);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const requestBody =
    body === undefined ? undefined : isFormData ? body : JSON.stringify(body);
  const url = `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;

  const response = await fetch(url, {
    ...requestOptions,
    body: requestBody,
    headers,
    cache: requestOptions.cache ?? "no-store",
  });

  return readResponse<T>(response);
}
