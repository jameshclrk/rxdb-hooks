import { Subject } from 'rxjs';
import { RxCollection } from 'rxdb';
import { RxDatabaseBase } from 'rxdb/dist/types/rx-database';

type CollectionRecord = Record<string, RxCollection>;
export type RxDatabaseBaseExtended = RxDatabaseBase & {
	newCollections$: Subject<CollectionRecord>;
};

/**
 * Extends RxDB prototype with a newCollections$ property: a stream emitting any
 * new collections added via addCollections().
 */
export const observeNewCollections = {
	rxdb: true,
	prototypes: {
		RxDatabase: (proto: RxDatabaseBaseExtended) => {
			const newCollections$ = new Subject<CollectionRecord>();
			proto.newCollections$ = newCollections$;

			const orig = proto.addCollections;
			proto.addCollections = async function(...args) {
				const col = await orig.apply(this, args);
				newCollections$.next(col);
				return col;
			};
		},
	},
};
