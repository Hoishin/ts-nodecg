import {Logger} from './logger';
import {ReplicantApi, ReplicantMap} from './replicant';
import {NodeCGConfig} from './config';
import {Platform} from './platform';
import {MessageApi, MessageMap} from './message';

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
	Logger: typeof Logger;
	bundleConfig: TBundleConfig;
	readonly config: NodeCGConfig;
} & MessageApi<TMessageMap, TBundleName, TPlatform, TForOthers> &
	ReplicantApi<TBundleName, TReplicantMap, TPlatform, TForOthers>;
