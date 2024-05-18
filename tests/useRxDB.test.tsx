const fake = jest.fn();
jest.mock('react', () => ({
	...(jest.requireActual('react') as any),
	useContext: fake,
}));

import { renderHook } from '@testing-library/react-hooks';
import useRxDB from '../src/useRxDB';
import Context from '../src/context';

describe('useRxDB', () => {
	it('should read rxdb instance from context', () => {
		fake.mockReturnValue({ dbs: { testDb: 'mock_rxdb_instance' } });
		const { result } = renderHook(() => useRxDB('testDb'));
		expect(fake.mock.calls[0][0]).toBe(Context);
		expect(result.current).toBe('mock_rxdb_instance');
	});
});
