const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';
const AUTH_EXPIRY_KEY = 'sessionExpiresAt';
const AUTH_SERVER_SESSION_KEY = 'serverSessionId';

const AUTH_API_BASE = 'http://localhost:5000/api/auth';

export const SESSION_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export const setAuthSession = (token, user = {}, durationMs = SESSION_DURATION_MS, serverSessionId = '') => {
  if (!token) return;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + durationMs));

  if (serverSessionId) {
    localStorage.setItem(AUTH_SERVER_SESSION_KEY, String(serverSessionId));
  }

  window.dispatchEvent(new Event('shop-data-updated'));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  localStorage.removeItem(AUTH_SERVER_SESSION_KEY);

  window.dispatchEvent(new Event('shop-data-updated'));
};

export const isAuthSessionValid = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiryRaw = localStorage.getItem(AUTH_EXPIRY_KEY);
  const expiry = Number(expiryRaw);

  if (!token || !expiryRaw || Number.isNaN(expiry)) {
    return false;
  }

  return Date.now() < expiry;
};

export const isLoggedInWithValidSession = () => {
  const valid = isAuthSessionValid();

  if (!valid) {
    clearAuthSession();
  }

  return valid;
};

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => isLoggedInWithValidSession();

export const isAdminUser = () => {
  if (!isAuthenticated()) return false;

  const user = getAuthUser();
  return String(user?.role || '').toLowerCase() === 'admin';
};

export const syncSessionWithServer = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;

  try {
    const response = await fetch(`${AUTH_API_BASE}/session-meta`);
    if (!response.ok) {
      return true;
    }

    const data = await response.json();
    const currentServerSessionId = String(data?.serverSessionId || '');
    if (!currentServerSessionId) {
      return true;
    }

    const savedServerSessionId = localStorage.getItem(AUTH_SERVER_SESSION_KEY);
    if (!savedServerSessionId) {
      localStorage.setItem(AUTH_SERVER_SESSION_KEY, currentServerSessionId);
      return true;
    }

    if (savedServerSessionId !== currentServerSessionId) {
      clearAuthSession();
      return false;
    }

    return true;
  } catch {
    return true;
  }
};
