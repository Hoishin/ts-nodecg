import {NodeCG} from './helper/nodecg';
import {ReplicantMap} from './helper/replicant';
import {MessageMap} from './helper/message';

interface Cue {
	name: string;
	assignable: boolean;
	defaultFile: string;
}

export type CreateNodecgInstance<
	TBundleConfig extends {},
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap
> = NodeCG<
	'browser',
	TBundleConfig,
	TBundleName,
	false,
	TReplicantMap,
	TMessageMap
> & {
	socket: SocketIOClient.Socket;
	getDialog(
		name: string,
		bundle?: string,
	): ReturnType<ParentNode['querySelector']>;
	getDialogDocument(name: string, bundle?: string): Document;
	findCue(cueName: string): Cue | undefined;
	playSound(
		cueName: string,
		opts?: {updateVolume?: boolean},
	): createjs.AbstractSoundInstance;
	stopSound(cueName: string): void;
	stopAllSounds(): void;
	soundReady?: boolean;
};

export type CreateNodecgConstructor<
	TBundleConfig extends {},
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap
> = {
	new (bundle: unknown, socket: SocketIOClient.Socket): CreateNodecgInstance<
		TBundleConfig,
		TBundleName,
		TReplicantMap,
		TMessageMap
	>;
	version: string;
};
