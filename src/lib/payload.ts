interface Props {
  endpoint: string;
  global: boolean
  wrappedByKey?: string;
  lang?: string;
  menu?: boolean;
  searchString?: string;
  sort?: string;
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
  menu,
  searchString,
  sort
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

  let sortBy = ''
  if (sort) {
    sortBy = '&sort=' + sort;
  }

  let url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}${sortBy}&pagination=false`);

  if (global) {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/globals/${endpoint}?${lang}${sortBy}`);
  }

  if (menu) {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/globals/${endpoint}?${lang}${sortBy}&depth=2&draft=false&locale=en&trash=false`);
  }

  if (endpoint == 'search') {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}$&${searchString}&pagination=false`);
  }

  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  return data as T;
}