import { createBrowserClient } from '@supabase/ssr';

const getSupabaseCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return { url, key };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();

  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    key.startsWith('sb_publishable_')
  );
};

export const createClient = () => {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createBrowserClient(url, key);
};