import {NodeCG} from './helper/nodecg';
import {ReplicantMap} from './helper/replicant';
import {MessageMap} from './helper/message';

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
