import {expectError, expectType} from 'tsd';
import {CreateNodecgInstance} from '../browser';

type OtherBundleRepMap = {
	player: {playerId: string; country: string};
};
type ThisBundleRepMap = {
	trashcan: {};
	game: {gameId: string; players: [string, string]};
};

type OtherBundle = CreateNodecgInstance<
	{},
	'other-bundle',
	OtherBundleRepMap,
	{},
	true
>;
type ThisBundle = CreateNodecgInstance<{}, 'this-bundle', ThisBundleRepMap, {}>;

declare const nodecg: OtherBundle & ThisBundle;

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
