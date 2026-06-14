# Payload Request Reliability Design

## Summary

Refactor the duplicated Payload request clients in `a11ying-front` and
`wcag-front` to validate configuration, build URLs through structured APIs,
and deduplicate identical successful requests during each Astro process.

The public `fetchApi({...})` call shape remains unchanged. Each site keeps its
own client because its endpoint rules and collection limits are site-specific.

## Goals

- Fail immediately with a clear configuration error when
  `PUBLIC_PAYLOAD_URL` is missing, malformed, or not HTTP(S).
- Normalize base URL and endpoint slashes consistently.
- Build query strings with `URL` and `URLSearchParams`.
- Correct malformed or contradictory query parameters.
- Preserve strict request failures with endpoint, status, and final URL
  context.
- Deduplicate identical requests for the lifetime of the current build or
  server process.
- Allow a failed request to be retried.
- Add focused unit coverage in both repositories without weakening either
  site's full quality gate.

## Non-Goals

- No Payload CMS schema or content changes.
- No HTTP response cache headers or CDN configuration.
- No time-based revalidation, persistent cache, or stale-content fallback.
- No retries, backoff, or timeout policy in this pass.
- No migration of Payload request infrastructure into `a11ying-ui`.
- No changes to existing `fetchApi({...})` call sites.
- No suppression or conversion of required CMS failures into empty content.

## Ownership

Each consumer retains `src/lib/payload.ts`.

The two implementations should use the same internal structure and semantics
where practical, but site-specific endpoint behavior remains local:

- `a11ying-front` owns its page, blog-card, glossary, and navigation request
  rules.
- `wcag-front` owns its principle, guideline, criterion, terminology, and WCAG
  hierarchy request rules.

This avoids putting CMS infrastructure into the shared visual component
package while still preventing further behavioral drift between the sites.

## Public Interface

The existing default export remains:

```ts
fetchApi<T>(options): Promise<T>
```

Existing option names and call sites remain valid. Internal types and helper
functions may be tightened or exported for unit testing, but consumers should
not need to change.

## Configuration Validation

The client reads `PUBLIC_PAYLOAD_URL` and validates it before constructing a
request.

Validation rules:

1. The value must exist and contain non-whitespace characters.
2. It must parse as an absolute URL.
3. Its protocol must be `http:` or `https:`.
4. A trailing slash is allowed and normalized.
5. The configured URL's existing path prefix, if any, is preserved.

Invalid configuration throws an error that names `PUBLIC_PAYLOAD_URL` and
describes whether it is missing, malformed, or uses an unsupported protocol.
There is no production or localhost fallback.

For testability, URL construction should accept an explicit base URL through
an internal factory or helper. The default exported client supplies
`import.meta.env.PUBLIC_PAYLOAD_URL`.

## URL Construction

The client normalizes a leading slash from `endpoint`, then uses `URL` and
`URLSearchParams` rather than manual string concatenation.

Common rules:

- Collection requests use `/api/{endpoint}`.
- Global requests use `/api/globals/{endpoint}`.
- `lang: "en"` sets `locale=en`.
- `lang: "fi"` sets `locale=fi`.
- An omitted language sets `locale=*`.
- Parameter values are passed as values, without embedded quotes or missing
  equals signs.
- Search query parameters supplied through `searchString` remain compatible
  with the serialized Payload `where` expression, but are merged through
  `URLSearchParams`.

`a11ying-front` rules:

- Normal collection requests set `pagination=false`.
- `sort` sets `sort={value}`.
- Globals do not add collection pagination.
- Menu globals set `depth=2`, `draft=false`, and `trash=false`.
- Menu globals retain the requested locale instead of forcing `locale=en`.
- Search requests set `pagination=false`.

`wcag-front` rules:

- Normal collection requests use the existing high collection limit, corrected
  to `limit=2000` without quote characters.
- Criteria use `sort=criterionSort` and `limit=200`.
- Guidelines use `sort=guidelineNumber` and `limit=200`.
- Principles use `sort=principleNumber` and `limit=200`.
- A caller-provided `sort` uses a valid `sort={value}` parameter.
- Globals do not add collection limits.
- Menu globals set `depth=2`, `draft=false`, and `trash=false`.
- Menu globals retain the requested locale instead of forcing `locale=en`.
- Search requests set `pagination=false`.

Endpoint-specific rules have precedence over generic collection defaults.
The final URL must not contain duplicate locale, sort, pagination, or limit
parameters.

## Request Deduplication

Each client owns a process-local:

```ts
Map<string, Promise<unknown>>
```

The final normalized URL string is the cache key.

Behavior:

1. If the URL is already cached, return the existing promise.
2. Otherwise, create the fetch-and-parse promise and cache it before awaiting.
3. Successful promises remain cached for the process lifetime.
4. If fetch, status validation, or JSON parsing fails, remove that exact
   promise from the cache.
5. A later call for the same URL may then retry.

Caching promises, rather than only resolved values, deduplicates both
concurrent and sequential requests. Different locales or query parameters
produce different keys.

The cached promise resolves to the complete parsed response. `wrappedByKey`
is applied after awaiting the cached promise, per caller. This allows two
callers to reuse the same request while selecting different response fields.

The cache is intentionally process-local. A new Astro build, development
server restart, or deployment starts with an empty cache.

## Response And Error Handling

Non-OK responses continue to throw. The message includes:

- the normalized endpoint;
- the HTTP status and status text;
- the final request URL.

Network and JSON parsing failures should also include the endpoint and final
URL while preserving the original error as the cause when supported.

If `wrappedByKey` is provided, the parsed response is unwrapped after the
cached request succeeds. A missing wrapper key is treated as an error rather
than silently returning `undefined`. The successful raw response may remain
cached because the wrapper selection is caller-specific.

Failed requests are never cached. Caller-specific response-selection errors
are reproduced from the successful cached response.

## Testing

Each repository receives focused unit tests for its local Payload client.
Tests use an explicit test client/base URL and mocked `fetch`; they do not
contact the live CMS.

Common coverage:

- missing, whitespace-only, malformed, relative, and unsupported-protocol base
  URLs;
- base URLs with and without trailing slashes;
- endpoints with and without leading slashes;
- English, Finnish, and all-locale requests;
- collection, global, menu, and search URL construction;
- caller-provided sorting;
- response unwrapping;
- missing wrapper keys;
- non-OK status error context;
- network and JSON parsing error context;
- concurrent identical-request deduplication;
- sequential successful-request caching;
- distinct URL keys remaining independent;
- failed-request eviction and retry.

Site-specific coverage:

- `a11ying-front` collection pagination and menu parameters;
- `wcag-front` corrected generic limit and principle, guideline, and criterion
  sort/limit rules.

After focused tests pass:

1. Run `npm run quality` in `a11ying-front`.
2. Run `npm run quality` in `wcag-front`.
3. Confirm no visual snapshots changed.
4. Confirm both repositories are clean and aligned after commits and pushes.

## Rollout

Implement and verify `a11ying-front` first to establish the internal client
shape. Apply the same structure to `wcag-front`, retaining its local endpoint
rules. Commit each repository independently, then update the cross-project
continuation note with test totals and final commit hashes.
