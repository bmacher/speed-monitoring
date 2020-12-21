/**
 * JSON format of speedtest-cli result.
 */
export interface SpeedTestResult {
  client: Client;
  bytes_sent: number;
  download: number;
  timestamp: string;
  share: null;
  bytes_received: number;
  ping: number;
  upload: number;
  server: Server;
}

/**
 * Client part of speedtest-cli result.
 */
export interface Client {
  rating: string;
  loggedin: string;
  isprating: string;
  ispdlavg: string;
  ip: string;
  isp: string;
  lon: string;
  ispulavg: string;
  country: string;
  lat: string;
}

/**
 * Server part of speedtest-cli result.
 */
export interface Server {
  latency: number;
  name: string;
  url: string;
  country: string;
  lon: string;
  cc: string;
  host: string;
  sponsor: string;
  lat: string;
  id: string;
  d: number;
}
