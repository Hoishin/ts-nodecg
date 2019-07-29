import {CreateNodecgInstance} from '../browser';
import {expectType, expectError} from 'tsd';

class CustomError extends Error {}

type ThisBundle = CreateNodecgInstance<
	'this-bundle',
	{},
	{
		trashcan: {};
		game: {gameId: string; players: [string, string]};
	},
	{
		ping: {};
		increment: {data: 1 | 2 | 3};
		updateName: {data: string; result: {name: string; age: string}};
		updatePlace: {data: string; error: CustomError};
	}
>;
type OtherBundle = CreateNodecgInstance<
	'other-bundle',
	{},
	{
		player: {playerId: string; country: string};
	},
	{
		increment: {};
		updateNumber: {data: number; result: boolean; error: CustomError};
	},
	true
>;

declare const nodecg: ThisBundle & OtherBundle;

expectType<Promise<void>>(nodecg.sendMessage('ping'));
expectError(nodecg.sendMessage('ping', 'foobar'));
expectType<Promise<void>>(nodecg.sendMessage('increment', 2));
expectType<void>(
	nodecg.sendMessage('updateName', 'mr foo', (err, result) => {
		expectType<unknown>(err);
		expectType<string>(result.age);
	}),
);
expectError(nodecg.sendMessage('updatePlace', () => {}));
expectType<void>(
	nodecg.sendMessage('updatePlace', 'smile', (err) => {
		expectType<CustomError | null>(err);
	}),
);
expectError(nodecg.sendMessage('updateNumber'));

const gameRep = nodecg.Replicant('game');
expectType<typeof gameRep>(nodecg.Replicant('game', {}));
expectType<typeof gameRep>(nodecg.Replicant('game', 'this-bundle'));
expectType<typeof gameRep>(nodecg.Replicant('game', 'this-bundle', {}));
expectType<undefined | {}>(gameRep.value);
gameRep.on('change', (newVal) => {
	expectType<{gameId: string; players: [string, string]}>(newVal);
});
expectError(gameRep.on('changee', () => {}));
gameRep.once('change', (newVal) => {
	expectType<{gameId: string; players: [string, string]}>(newVal);
});
expectError(gameRep.once('cchange', () => {}));
gameRep.removeListener('change', () => {});
expectError(gameRep.removeListener('changeee', () => {}));
gameRep.removeAllListeners('change');
expectError(gameRep.removeAllListeners('chamge'));

expectError(nodecg.Replicant('game', 'other-bundle'));
expectError(nodecg.Replicant('game', 'other-bundle', {}));

expectError(nodecg.Replicant('player'));
expectError(nodecg.Replicant('player', {}));
expectError(nodecg.Replicant('player', 'this-bundle'));
expectError(nodecg.Replicant('player', 'this-bundle', {}));
nodecg.Replicant('player', 'other-bundle');
nodecg.Replicant('player', 'other-bundle', {});

nodecg.readReplicant('game', (value) => {
	console.log(value.players[1]);
});
nodecg.readReplicant('game', 'this-bundle', (value) => {
	console.log(value.players[1]);
});

expectError(
	nodecg.readReplicant('player', () => {
		// ...
	}),
);
nodecg.readReplicant('player', 'other-bundle', (value) => {
	console.log(value.country);
});
