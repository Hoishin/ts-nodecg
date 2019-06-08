import {expectError} from 'tsd';
import {ReplicantApi} from '../helper/replicant';

type OtherBundleRepMap = {
	player: {playerId: string; country: string};
};
type ThisBundleRepMap = {
	game: {gameId: string; players: [string, string]};
};

type OtherBundle = ReplicantApi<
	'other-bundle',
	OtherBundleRepMap,
	'browser',
	true
>;
type ThisBundle = ReplicantApi<
	'this-bundle',
	ThisBundleRepMap,
	'browser',
	false
>;

declare const nodecg: OtherBundle & ThisBundle;

nodecg.Replicant('game');
nodecg.Replicant('game', {});
nodecg.Replicant('game', 'this-bundle');
nodecg.Replicant('game', 'this-bundle', {});
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
