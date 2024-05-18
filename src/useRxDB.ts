import { useContext } from 'react';
import Context from './context';
import { RxDatabaseBaseExtended } from './plugins';

function useRxDB(dbName: string): RxDatabaseBaseExtended {
	const { dbs } = useContext(Context);
	return dbs[dbName];
}

export default useRxDB;
