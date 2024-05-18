import React, { useMemo, useState, useCallback } from 'react';
import Context from './context';
import { RxDatabaseBaseExtended } from './plugins';

const Provider = ({ children }: { children: JSX.Element }): JSX.Element => {
	const [dbs, setDbs] = useState<Record<string, RxDatabaseBaseExtended>>({});
	const addDb = useCallback(
		(name: string, db: RxDatabaseBaseExtended) => {
			setDbs(prev => {
				return { ...prev, [name]: db };
			});
		},
		[setDbs]
	);
	const context = useMemo(
		() => ({
			dbs,
			addDb,
		}),
		[dbs, addDb]
	);
	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Provider;
