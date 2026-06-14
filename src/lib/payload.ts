interface Props {
  endpoint: string;
  global: boolean;
  wrappedByKey?: string;
  lang?: string;
  menu?: boolean;
  searchString?: string;
  sort?: string;
}

type FetchApi = <T>(props: Props) => Promise<T>;
type FetchImplementation = typeof fetch;

function normalizeBaseUrl(value: string | undefined): URL {
  if (!value?.trim()) {
    throw new Error('PUBLIC_PAYLOAD_URL is missing or empty');
  }

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch (error) {
    throw new Error('PUBLIC_PAYLOAD_URL must be a valid absolute URL', { cause: error });
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`PUBLIC_PAYLOAD_URL must use http or https, received ${url.protocol}`);
  }

  url.search = '';
  url.hash = '';
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  return url;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/^\/+/, '');
}

function localeFor(lang?: string): string {
  return lang === 'en' ? 'en' : lang === 'fi' ? 'fi' : '*';
}

function mergeSearchParams(target: URLSearchParams, searchString?: string): void {
  if (!searchString) return;
  new URLSearchParams(searchString).forEach((value, key) => target.set(key, value));
}

export function createPayloadClient(
  baseUrlValue: string | undefined,
  fetchImplementation: FetchImplementation = fetch
): FetchApi {
  const baseUrl = normalizeBaseUrl(baseUrlValue);
  const requests = new Map<string, Promise<unknown>>();

  return async function fetchApi<T>({
    endpoint,
    global,
    wrappedByKey,
    lang,
    menu,
    searchString,
    sort,
  }: Props): Promise<T> {
    const normalizedEndpoint = normalizeEndpoint(endpoint);
    const isGlobal = global || menu;
    const url = new URL(baseUrl);
    const basePath = baseUrl.pathname.replace(/\/+$/, '');
    url.pathname = `${basePath}/api/${isGlobal ? 'globals/' : ''}${normalizedEndpoint}`;
    url.searchParams.set('locale', localeFor(lang));

    if (menu) {
      url.searchParams.set('depth', '2');
      url.searchParams.set('draft', 'false');
      url.searchParams.set('trash', 'false');
    } else if (!isGlobal) {
      url.searchParams.set('pagination', 'false');
      if (sort) url.searchParams.set('sort', sort);
    }

    if (normalizedEndpoint === 'search') {
      mergeSearchParams(url.searchParams, searchString);
      url.searchParams.set('pagination', 'false');
    }

    const requestUrl = url.toString();
    let request = requests.get(requestUrl);

    if (!request) {
      request = (async () => {
        try {
          const response = await fetchImplementation(requestUrl);
          if (!response.ok) {
            throw new Error(
              `Payload request failed for ${normalizedEndpoint}: ${response.status} ${response.statusText} (${requestUrl})`
            );
          }

          try {
            return await response.json();
          } catch (error) {
            throw new Error(
              `Payload response was not valid JSON for ${normalizedEndpoint} (${requestUrl})`,
              { cause: error }
            );
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.startsWith('Payload request failed')
          ) {
            throw error;
          }
          if (
            error instanceof Error &&
            error.message.startsWith('Payload response was not valid JSON')
          ) {
            throw error;
          }
          throw new Error(
            `Payload request failed for ${normalizedEndpoint} (${requestUrl})`,
            { cause: error }
          );
        }
      })();

      requests.set(requestUrl, request);
      request.catch(() => {
        if (requests.get(requestUrl) === request) requests.delete(requestUrl);
      });
    }

    const data = await request;
    if (!wrappedByKey) return data as T;

    if (
      typeof data !== 'object' ||
      data === null ||
      !Object.prototype.hasOwnProperty.call(data, wrappedByKey)
    ) {
      throw new Error(
        `Payload response for ${normalizedEndpoint} is missing wrapper key "${wrappedByKey}" (${requestUrl})`
      );
    }

    return (data as Record<string, unknown>)[wrappedByKey] as T;
  };
}

let defaultClient: FetchApi | undefined;

export default function fetchApi<T>(props: Props): Promise<T> {
  defaultClient ??= createPayloadClient(import.meta.env.PUBLIC_PAYLOAD_URL);
  return defaultClient<T>(props);
}
