import qs from "query-string";

/**
 * Creates a new URL by adding or updating a query parameter.
 *
 * @template T - The type of the value to be added to the query string
 * @param params - The current URL search parameters as a string
 * @param key - The query parameter key to add or update
 * @param value - The value to set for the specified key
 * @param path - The URL path to construct the full URL
 * @returns A formatted URL string with the updated query parameter
 *
 * @example
 * ```ts
 * createUrlQuery({
 *   params: "page=1&sort=date",
 *   key: "q",
 *   value: "react",
 *   path: "/search"
 * });
 * // Returns: "/search?page=1&sort=date&q=react"
 * ```
 */
export function createUrlQuery<T>({
  params,
  key,
  value,
  path,
}: {
  params: string;
  key: string;
  value: T;
  path: string;
}) {
  const queryParams = qs.parse(params);

  queryParams[key] = String(value);

  return qs.stringifyUrl(
    {
      url: path,
      query: queryParams,
    },
    { skipNull: true },
  );
}

/**
 * Creates a new URL by removing specified query parameters.
 *
 * @param params - The current URL search parameters as a string
 * @param keysToRemove - An array of query parameter keys to remove
 * @param path - The URL path to construct the full URL
 * @returns A formatted URL string with the specified query parameters removed
 *
 * @example
 * ```ts
 * removeKeysFromUrlQuery({
 *   params: "page=1&sort=date&filter=active",
 *   keysToRemove: ["filter", "sort"],
 *   path: "/questions"
 * });
 * // Returns: "/questions?page=1"
 * ```
 */
export function removeKeysFromUrlQuery({
  params,
  keysToRemove,
  path,
}: {
  params: string;
  keysToRemove: string[];
  path: string;
}) {
  const queryParams = qs.parse(params);

  for (const key of keysToRemove) {
    delete queryParams[key];
  }

  return qs.stringifyUrl(
    {
      url: path,
      query: queryParams,
    },
    { skipNull: true },
  );
}
