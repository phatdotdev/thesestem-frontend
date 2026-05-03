import { store } from "../app/store";
import { loginSuccess, logout } from "../features/auth/authSlice";

const REFRESH_INTERVAL_MS = 12 * 60 * 1000;

let activeSocketConsumers = 0;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let refreshingPromise: Promise<string | null> | null = null;

const readAccessToken = (payload: unknown): string | null => {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (typeof data === "object" && data !== null) {
    const token = (data as Record<string, unknown>).accessToken;
    if (typeof token === "string" && token.trim()) {
      return token;
    }
  }

  const topToken = root.accessToken;
  if (typeof topToken === "string" && topToken.trim()) {
    return topToken;
  }

  return null;
};

export const refreshWsAccessToken = async (): Promise<string | null> => {
  if (refreshingPromise) {
    return refreshingPromise;
  }

  refreshingPromise = (async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          store.dispatch(logout());
          return null;
        }

        return store.getState().auth.token;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        // Cookie-only refresh flow: no access token in body.
        return null;
      }

      const payload = (await response.json()) as unknown;
      const accessToken = readAccessToken(payload);

      if (!accessToken) {
        // Cookie-only refresh flow: no access token in body.
        return null;
      }

      store.dispatch(loginSuccess({ token: accessToken }));
      return accessToken;
    } catch {
      return store.getState().auth.token;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
};

const runPeriodicRefresh = async () => {
  await refreshWsAccessToken();
};

export const retainWsAuthRefresh = () => {
  activeSocketConsumers += 1;

  if (refreshTimer) {
    return;
  }

  void runPeriodicRefresh();
  refreshTimer = setInterval(() => {
    void runPeriodicRefresh();
  }, REFRESH_INTERVAL_MS);
};

export const releaseWsAuthRefresh = () => {
  if (activeSocketConsumers > 0) {
    activeSocketConsumers -= 1;
  }

  if (activeSocketConsumers !== 0 || !refreshTimer) {
    return;
  }

  clearInterval(refreshTimer);
  refreshTimer = null;
};
