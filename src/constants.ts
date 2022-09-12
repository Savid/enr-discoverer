const dev = process.env.NODE_ENV === 'development';

export const LOG_LEVEL: string = process.env.LOG_LEVEL || (dev ? 'debug' : 'warn');

export const PORT_ADMIN: string = process.env.PORT_ADMIN ?? '8081';

export const { BOOT_NODES } = process.env;
export const MIN_CONNECTIONS = !Number.isNaN(Number(process.env.MAX_CONNECTIONS))
  ? Number(process.env.MAX_CONNECTIONS)
  : undefined;
export const MAX_CONNECTIONS = !Number.isNaN(Number(process.env.MAX_CONNECTIONS))
  ? Number(process.env.MAX_CONNECTIONS)
  : undefined;

export const REMOTE_SEND_ENDPOINT: string = process.env.REMOTE_URL ?? 'http://localhost:8080/enrs';
export const { SHARED_SECRET } = process.env;
export const REMOTE_SEND_INTERVAL = !Number.isNaN(Number(process.env.REMOTE_SEND_INTERVAL))
  ? Number(process.env.REMOTE_SEND_INTERVAL)
  : 10_000;
