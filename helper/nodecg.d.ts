import {Logger} from './logger';
import {ReplicantMap} from './replicant';
import {NodeCGConfig} from './config';
import {MessageMap} from './message';

export type NodecgCommon<TBundleName extends string, TBundleConfig> = {
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
};
