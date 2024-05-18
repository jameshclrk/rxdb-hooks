import { createContext } from 'react';
import { RxDatabaseBaseExtended } from './plugins';

export interface RxContext {
	dbs: Record<string, RxDatabaseBaseExtended>;
	addDb: (name: string, db: RxDatabaseBaseExtended) => void;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
const Context = createContext<RxContext>({ dbs: {}, addDb() {} });

export default Context;
