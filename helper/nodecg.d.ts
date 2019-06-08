import {Logger, LoggerApi} from './logger';
import {
	ReplicantOptions,
	Replicant,
	TypedReplicantApi as ReplicantApi,
	ReplicantMap,
} from './replicant';
import {ConfigApi} from './config';
import {Platform} from './platform';
import {DialogApi} from './dialog';
import {MessageApi, MessageMap} from './message';
import {TypedSoundApi as SoundApi} from './sound';

type NodeCG<
	TPlatform extends Platform,
	TBundleConfig extends {},
	TBundleName extends string,
	TForOthers extends boolean,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap
> = {
	bundleName: TBundleName;
	bundleVersion: string;
	readonly bundleGit: {
		branch: string;
		hash: string;
		shortHash: string;
		date?: Date;
		message?: string;
	};
	log: Logger;
} & ConfigApi<TBundleConfig> &
	LoggerApi &
	DialogApi<TPlatform> &
	MessageApi<TMessageMap, TBundleName, TPlatform, TForOthers> &
	ReplicantApi<TBundleName, TReplicantMap, TPlatform, TForOthers> &
	SoundApi<TPlatform>;
