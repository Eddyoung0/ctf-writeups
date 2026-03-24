const SERVER_SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const SERVER_STARTED_AT = new Date().toISOString();

export const getServerSessionMeta = () => ({
  serverSessionId: SERVER_SESSION_ID,
  serverStartedAt: SERVER_STARTED_AT,
});
