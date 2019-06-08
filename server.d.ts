import {IRouter, RequestHandler} from 'express-serve-static-core';
import {NodeCG} from './helper/nodecg';
import {ReplicantMap} from './helper/replicant';
import {MessageMap} from './helper/message';

export type CreateNodecgInstance<
	TBundleConfig extends {},
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap
> = NodeCG<
	'server',
	TBundleConfig,
	TBundleName,
	false,
	TReplicantMap,
	TMessageMap
> & {
	getSocketIOServer(): SocketIO.Server;
	mount: IRouter['use'];
	util: {
		authCheck: RequestHandler;
	};
	extensions: {
		[bundleName in TBundleName]: (
			nodecg: NodeCG<
				'server',
				TBundleConfig,
				TBundleName,
				false,
				TReplicantMap,
				TMessageMap
			>,
		) => void;
	};
};
