export async function fetcher(input: RequestInfo, init?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed ${res.status}: ${text}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function getJson<T>(path: string): Promise<T> {
  return fetcher(path) as Promise<T>;
}

