import React, { FC, useCallback } from 'react';
import {
	setup,
	teardown,
	CharacterList,
	Character,
	MyDatabase,
} from './helpers';
import { render, screen, waitFor } from '@testing-library/react';
import { addRxPlugin, RxCollection } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import useRxData from '../src/useRxData';
import DBProvider from '../src/DBProvider';
import Provider from '../src/Provider';
import { characters } from './mockData';

addRxPlugin(RxDBQueryBuilderPlugin);

describe('multiple databases', () => {
	const db1Name = 'testDb1';
	const db2Name = 'testDb2';
	let db1: MyDatabase;
	let db2: MyDatabase;

	const characters1 = characters.slice(0, 2);
	const characters2 = characters.slice(2);

	beforeAll(async done => {
		db1 = await setup(characters1, 'characters', db1Name);
		db2 = await setup(characters2, 'characters', db2Name);
		done();
	});

	afterAll(async done => {
		await teardown(db1);
		await teardown(db2);
		done();
	});

	const getChild = (dbName: string) => {
		const Child = () => {
			const queryConstructor = useCallback(
				(c: RxCollection<Character>) => c.find(),
				[]
			);
			const {
				result: characters,
				isFetching,
				isExhausted,
			} = useRxData<Character>(dbName, 'characters', queryConstructor);

			return (
				<CharacterList
					characters={characters}
					isFetching={isFetching}
					isExhausted={isExhausted}
				/>
			);
		};
		return Child;
	};

	it('should read data from innermost database', async done => {
		const Child = getChild(db2Name);
		render(
			<Provider>
				<DBProvider dbName={db1Name} db={db1}>
					<DBProvider dbName={db2Name} db={db2}>
						<Child />
					</DBProvider>
				</DBProvider>
			</Provider>
		);

		await waitFor(async () => {
			// data of db2 should now be rendered
			characters2.forEach(doc => {
				expect(screen.getByText(doc.name)).toBeInTheDocument();
			});
		});
		// data of db1 should not be rendered
		characters1.forEach(doc => {
			expect(screen.queryByText(doc.name)).not.toBeInTheDocument();
		});

		done();
	});

	it('should read data from outermost database', async done => {
		const Child = getChild(db1Name);
		render(
			<Provider>
				<DBProvider dbName={db1Name} db={db1}>
					<DBProvider dbName={db2Name} db={db2}>
						<Child />
					</DBProvider>
				</DBProvider>
			</Provider>
		);

		await waitFor(async () => {
			// data of db1 should now be rendered
			characters1.forEach(doc => {
				expect(screen.getByText(doc.name)).toBeInTheDocument();
			});
		});
		// data of db2 should not be rendered
		characters2.forEach(doc => {
			expect(screen.queryByText(doc.name)).not.toBeInTheDocument();
		});

		done();
	});
	it('should be able to read data from both databases at the same time', async done => {
		const Child = () => {
			const queryConstructor = useCallback(
				(c: RxCollection<Character>) => c.find(),
				[]
			);
			const {
				result: characters1,
				isFetching: isFetching1,
				isExhausted: isExhausted1,
			} = useRxData<Character>(db1Name, 'characters', queryConstructor);
			const {
				result: characters2,
				isFetching: isFetching2,
				isExhausted: isExhausted2,
			} = useRxData<Character>(db2Name, 'characters', queryConstructor);

			return (
				<>
					<CharacterList
						characters={characters1}
						isFetching={isFetching1}
						isExhausted={isExhausted1}
					/>
					<CharacterList
						characters={characters2}
						isFetching={isFetching2}
						isExhausted={isExhausted2}
					/>
				</>
			);
		};

		render(
			<Provider>
				<DBProvider dbName={db1Name} db={db1}>
					<DBProvider dbName={db2Name} db={db2}>
						<Child />
					</DBProvider>
				</DBProvider>
			</Provider>
		);

		await waitFor(async () => {
			// data of db1 should be rendered
			characters1.forEach(doc => {
				expect(screen.getByText(doc.name)).toBeInTheDocument();
			});
		});
		// data of db2 should be rendered
		characters2.forEach(doc => {
			expect(screen.queryByText(doc.name)).toBeInTheDocument();
		});

		done();
	});
});
