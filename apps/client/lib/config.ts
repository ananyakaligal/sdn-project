export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4001',
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || process.env.USE_MOCKS === 'true',
};

