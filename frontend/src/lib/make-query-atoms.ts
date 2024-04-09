import { FetchStatus, QueryFunction } from "@tanstack/react-query";
import { Atom, Getter, atom } from "jotai";
import {
  AtomWithSuspenseQueryResult,
  atomWithSuspenseQuery,
  queryClientAtom,
} from "jotai-tanstack-query";

type QueryFn<TReturn, TParams> = QueryFunction<
  Awaited<TReturn>,
  (string | TParams)[],
  never
>;
/**
 * Generates an array of atoms for a query
 * Under the hood, this uses jotai/tanstack-query to create the relevant atoms
 *
 * It returns an array composed of three atoms :
 *
 * - The Stale-while-revalidate data atom, which is async until first fetch
 * - The status atom (fetchStatus)
 * - The query atom (which is async)
 *
 * Example :
 *
 * ```typescript
 * export const [productsAtom, productsStatusAtom] = makeQueryAtoms(
 *     'inventoryProducts',
 *     (get) => get(fetchProductsParamsAtom),
 *     (params) => () => {
 *         return fetch(params)
 *     }
 * )
 * ```
 * @param key React-Query query key
 * @param getParameters Function to get parameters for the query
 * @param queryFn Function to call to generate the query
 * @returns
 */
export function makeQueryAtoms<TParams, TReturn>(
  key: string,
  getParameters: (get: Getter) => TParams,
  queryFn: (params: TParams) => QueryFn<Promise<TReturn>, TParams>
): [
  Atom<AtomWithSuspenseQueryResult<TReturn, Error>>,
  Atom<{ fetchStatus: FetchStatus }>
] {
  const queryAtom = atomWithSuspenseQuery((get) => {
    const params = getParameters(get);

    const qParams = {
      queryKey: [key, params],
      queryFn: queryFn(params),
    };

    return qParams;
  });
  queryAtom.debugLabel = key;

  const statusAtom = atom((get) => {
    get(queryAtom);
    const params = getParameters ? getParameters(get) : undefined;
    const queryClient = get(queryClientAtom);
    const state = queryClient.getQueryState<QueryFn<TReturn, TParams>>([
      key,
      params,
    ]);
    return state
      ? {
          fetchStatus: state.fetchStatus,
        }
      : {
          fetchStatus: "idle" as FetchStatus,
        };
  });

  return [queryAtom, statusAtom];
}
