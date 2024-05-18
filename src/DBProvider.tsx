import React, { PropsWithChildren, useContext, useEffect } from 'react';
import { RxDatabase } from 'rxdb';
import Context from './context';
import { RxDatabaseBaseExtended } from './plugins';

export interface ProviderProps<Collections = any> {
	dbName?: string;
	db?: RxDatabase<Collections>;
}

const DBProvider = <C extends unknown>({
	dbName,
	db,
	children,
}: PropsWithChildren<ProviderProps<C>>): JSX.Element => {
	const { addDb } = useContext(Context);
	useEffect(() => {
		addDb(dbName, db as unknown as RxDatabaseBaseExtended);
	}, [dbName, db, addDb]);
	return <>{children}</>;
};

export default DBProvider;
