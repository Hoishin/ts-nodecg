import {NodeCG} from './helper/nodecg';
import {
	ReplicantMap,
	ReplicantFactory,
	ReadReplicant,
	WaitForReplicants,
} from './helper/replicant';
import {
	MessageMap,
	SendMessageToBundleBrowser,
	SendMessageToBundle,
} from './helper/message';

interface Cue {
	name: string;
	assignable: boolean;
	defaultFile: string;
}

export type CreateNodecgInstance<
	TBundleConfig extends {},
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap,
	TForOthers extends boolean = false
> = NodeCG<
	'browser',
	TBundleConfig,
	TBundleName,
	TForOthers,
	TReplicantMap,
	TMessageMap
> & {
	socket: SocketIOClient.Socket;

	getDialog(
		name: string,
		bundle?: string,
	): ReturnType<ParentNode['querySelector']>;
	getDialogDocument(name: string, bundle?: TBundleName): Document;

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
	TMessageMap extends MessageMap,
	TForOthers extends boolean = false
> = {
	new (bundle: unknown, socket: SocketIOClient.Socket): CreateNodecgInstance<
		TBundleConfig,
		TBundleName,
		TReplicantMap,
		TMessageMap
	>;
	version: string;

	sendMessageToBundle: SendMessageToBundle<
		TMessageMap,
		'browser',
		TBundleName
	>;

	Replicant: ReplicantFactory<
		TBundleName,
		TReplicantMap,
		'browser',
		TForOthers
	>;
	readReplicant: ReadReplicant<
		'browser',
		TForOthers,
		TReplicantMap,
		TBundleName
	>;
	waitForReplicants: WaitForReplicants<TReplicantMap, TBundleName, 'browser'>;
};
