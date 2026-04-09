let cachedApiBaseUrl: string | null = null;

export type ApiEnvelope<T> = {
  thanhCong?: boolean;
  ThanhCong?: boolean;
  thongDiep?: string;
  ThongDiep?: string;
  duLieu?: T;
  DuLieu?: T;
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function getApiBaseCandidates(): string[] {
  const configuredBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!configuredBase) {
    throw new Error("Thiếu biến môi trường bắt buộc: NEXT_PUBLIC_API_BASE_URL");
  }
  return [normalizeBaseUrl(configuredBase)];
}

export function getApiBaseUrl(): string {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  const candidates = getApiBaseCandidates();
  return candidates[0];
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const candidates = getApiBaseCandidates();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const initHeaders = new Headers(init?.headers);
  if (token && !initHeaders.has("Authorization")) {
    initHeaders.set("Authorization", `Bearer ${token}`);
  }

  const finalInit: RequestInit = {
    ...init,
    headers: initHeaders,
  };

  const prioritized = cachedApiBaseUrl
    ? [cachedApiBaseUrl, ...candidates.filter((x) => x !== cachedApiBaseUrl)]
    : candidates;

  const response = await fetchWithFallback(prioritized, normalizedPath, finalInit);
  if (response.status !== 404) {
    return response;
  }

  const legacyPath = getLegacyRouteFallbackPath(normalizedPath);
  if (!legacyPath) {
    return response;
  }

  return await fetchWithFallback(prioritized, legacyPath, finalInit);
}

function getLegacyRouteFallbackPath(path: string): string | null {
  // KHÔNG fallback cho /api/public/applications vì route legacy yêu cầu Admin role
  // if (path.startsWith("/api/public/applications")) {
  //   return path.replace("/api/public/applications", "/api/applications");
  // }

  if (path.startsWith("/api/public/services")) {
    return path.replace("/api/public/services", "/api/services");
  }

  if (path.startsWith("/api/public/profile")) {
    return path.replace("/api/public/profile", "/api/profile");
  }

  if (path.startsWith("/api/public/search")) {
    return path.replace("/api/public/search", "/api/search");
  }

  if (path.startsWith("/api/public/contact")) {
    return path.replace("/api/public/contact", "/api/contact");
  }

  if (path.startsWith("/api/public/departments")) {
    return path.replace("/api/public/departments", "/api/departments");
  }

  return null;
}

async function fetchWithFallback(
  candidates: string[],
  normalizedPath: string,
  init?: RequestInit,
): Promise<Response> {
  let lastError: unknown = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${normalizedPath}`, init);
      cachedApiBaseUrl = baseUrl;
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Khong the ket noi den API backend. Vui long kiem tra server dang chay.");
}

export function resolveMediaUrl(path: string | null | undefined, fallback: string): string {
  if (!path) return fallback;
  
  // Backward compatibility: If the DB has hardcoded old URLs like localhost:5000, rewrite them.
  let cleanPath = path;
  if (cleanPath.startsWith("http://localhost:5000")) {
    cleanPath = cleanPath.replace("http://localhost:5000", "");
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) return cleanPath;
  return buildApiUrl(cleanPath);
}

export function unwrapApiEnvelope<T>(payload: unknown): {
  success: boolean;
  message?: string;
  data?: T;
} {
  const value = payload as (ApiEnvelope<T> & { data?: T; Data?: T; message?: string; Message?: string; success?: boolean; Success?: boolean }) | null | undefined;
  if (!value || typeof value !== "object") {
    return { success: false, message: "Phan hoi API khong hop le." };
  }

  const success = value.thanhCong ?? value.ThanhCong ?? value.success ?? value.Success ?? false;
  const message = value.thongDiep ?? value.ThongDiep ?? value.message ?? value.Message;
  const data = value.duLieu ?? value.DuLieu ?? value.data ?? value.Data;

  return {
    success,
    message,
    data,
  };
}

export function isGuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}
