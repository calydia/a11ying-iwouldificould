interface Props {
  endpoint: string;
  global: boolean
  wrappedByKey?: string;
  lang?: string;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param wrappedByKey - The key to unwrap the response from
 * @param lang - What languages to fetch
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  global,
  wrappedByKey,
  lang,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  if (lang) {
    if ( lang == 'en') {
      lang = 'locale=en';
    } else {
      lang = 'locale=fi';
    }
  } else {
    lang = 'locale=*';
  }

  let url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}`);

  if (global) {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/globals/${endpoint}?${lang}`);
  }

  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  return data as T;
}