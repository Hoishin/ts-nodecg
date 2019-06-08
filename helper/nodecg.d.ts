import {Logger} from './logger';
import {ReplicantMap, ReplicantFactory, ReadReplicant} from './replicant';
import {NodeCGConfig} from './config';
import {Platform} from './platform';
import {
	MessageMap,
	SendMessageToBundle,
	ListenFor,
	SendMessage,
} from './message';

type NodeCG<
	TPlatform extends Platform,
	TBundleConfig extends {},
	TBundleName extends string,
	TForOthers extends boolean,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap
> = {
	readonly config: NodeCGConfig;

	bundleName: TBundleName;
	bundleVersion: string;
	bundleConfig: TBundleConfig;
	readonly bundleGit: {
		branch: string;
		hash: string;
		shortHash: string;
		date?: Date;
		message?: string;
	};

	log: Logger;
	Logger: typeof Logger;

	Replicant: ReplicantFactory<
		TBundleName,
		TReplicantMap,
		TPlatform,
		TForOthers
	>;
	readReplicant: ReadReplicant<
		TPlatform,
		TForOthers,
		TReplicantMap,
		TBundleName
	>;

	sendMessageToBundle: SendMessageToBundle<
		TMessageMap,
		TPlatform,
		TBundleName
	>;
	listenFor: ListenFor<TMessageMap, TBundleName, TPlatform, TForOthers>;
	unlinsten: ListenFor<TMessageMap, TBundleName, TPlatform, TForOthers>;
} & (TForOthers extends true
	? {}
	: {sendMessage: SendMessage<TMessageMap, TPlatform>});
