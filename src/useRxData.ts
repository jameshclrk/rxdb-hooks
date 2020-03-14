import { useMemo } from 'react';
import { RxCollection, RxQuery } from 'rxdb';
import useRxCollection from './useRxCollection';
import useRxQuery, {
	UseRxQueryOptions,
	RxQueryResult,
	RxQueryResultJSON,
	RxQueryResultDoc,
} from './useRxQuery';

type QueryConstructor<T> = (
	collection: RxCollection<T>
) => RxQuery<T> | undefined;

function useRxData<T>(
	collectionName: string,
	queryConstructor: QueryConstructor<T> | undefined
): RxQueryResultDoc<T>;

function useRxData<T>(
	collectionName: string,
	queryConstructor: QueryConstructor<T> | undefined,
	options?: UseRxQueryOptions & { json?: false }
): RxQueryResultDoc<T>;

function useRxData<T>(
	collectionName: string,
	queryConstructor: QueryConstructor<T> | undefined,
	options?: UseRxQueryOptions & { json: true }
): RxQueryResultJSON<T>;

/**
 * Convenience wrapper around useRxQuery that expects a collection name
 * & a query constructor function
 */
function useRxData<T>(
	collectionName: string,
	queryConstructor: QueryConstructor<T> | undefined,
	options: UseRxQueryOptions = {}
): RxQueryResult<T> {
	const collection = useRxCollection<T>(collectionName);

	const query = useMemo(() => {
		if (!collection || typeof queryConstructor !== 'function') {
			return null;
		}
		return queryConstructor(collection);
	}, [collection, queryConstructor]);

	// get around type-narrowing issue
	return options.json
		? useRxQuery(query, { ...options, json: true })
		: useRxQuery(query, { ...options, json: false });
}

export default useRxData;
