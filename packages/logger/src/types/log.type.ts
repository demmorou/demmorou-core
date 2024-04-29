export type Log = {
  level: 'INFO' | 'DEBUG' | 'ERROR' | 'TRACE' | 'FATAL';
  context: string | 'default';
  applicationName: string;
  timestamp: string;
  business: string;
  url_host: string;
  traceId: string;
  message: string;
  thread: string;
  logger: string;
  method: string;
  url: string;
  OS: string;
}