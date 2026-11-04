/** The address Sentry takes CSP violation reports on, for the project the DSN belongs to. */
export function cspReportUriFromDsn(dsn: string) {
  const { username: publicKey, host, pathname } = new URL(dsn);
  const projectId = pathname.slice(1);
  return `https://${host}/api/${projectId}/security/?sentry_key=${publicKey}`;
}
