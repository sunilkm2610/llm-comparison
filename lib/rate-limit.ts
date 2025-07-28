type RateData = {
  count: number;
  lastRequestTime: number;
};

const ipMap = new Map<string, RateData>();

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;
export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const data = ipMap.get(ip);

  if (!data) {
    ipMap.set(ip, { count: 1, lastRequestTime: now });
    return true;
  }

  if (now - data.lastRequestTime > WINDOW_MS) {
    ipMap.set(ip, { count: 1, lastRequestTime: now });
    return true;
  }

  if (data.count >= RATE_LIMIT) {
    return false;
  }

  data.count++;
  ipMap.set(ip, data);
  return true;
}
