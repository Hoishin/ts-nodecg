/// <reference types="socket.io" />

import {Application, RequestHandler} from 'express';
import {NodecgCommon} from './helper/nodecg';
import {
	ReplicantMap,
	ReplicantCommon,
	ReplicantOptions,
} from './helper/replicant';
import {MessageMap} from './helper/message';

export class Replicant<
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TName extends keyof ReplicantMap & string,
	TValue extends TReplicantMap[TName] | undefined
> extends ReplicantCommon<TBundleName, TName, TReplicantMap[TName], TValue> {
	on(
		event: 'change',
		listener: (
			newValue: TReplicantMap[TName],
			oldValue: TReplicantMap[TName] | undefined,
		) => void,
	): this;
	once(
		event: 'change',
		listener: (
			newValue: TReplicantMap[TName],
			oldValue: TReplicantMap[TName] | undefined,
		) => void,
	): this;
	removeListener(
		event: 'change',
		listener: (
			newValue: TReplicantMap[TName],
			oldValue: TReplicantMap[TName] | undefined,
		) => void,
	): this;
	removeAllListeners(event: 'change'): this;
}

export type CreateNodecgInstance<
	TBundleName extends string,
	TBundleConfig,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap,
	TForOtherBundle extends boolean = false
> = NodecgCommon<TBundleName, TBundleConfig> & {
	getSocketIOServer(): SocketIO.Server;
	mount: Application['use'];
	util: {
		authCheck: RequestHandler;
	};
	extensions: {
		[BundleName in TBundleName]: (
			nodecg: CreateNodecgInstance<
				TBundleName,
				TBundleConfig,
				TReplicantMap,
				TMessageMap,
				TForOtherBundle
			>,
		) => void;
	};
	sendMessageToBundle<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? TName : never,
		bundleName: TBundleName,
	): void;
	sendMessageToBundle<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? never : TName,
		bundleName: TBundleName,
		data: TMessageMap[TName]['data'],
	): void;
	listenFor<TName extends keyof TMessageMap & string>(
		messageName: TForOtherBundle extends true ? TName : never,
		bundleName: TBundleName,
		handlerFunc: (
			data: TMessageMap[TName]['data'],
			cb:
				| undefined
				| {handled: true}
				| (unknown extends TMessageMap[TName]['result']
						? {
								handled: false;
								<
									TError extends
										| TMessageMap[TName]['error']
										| null
								>(
									error: TError,
								): void;
						  }
						: {
								handled: false;
								<
									TError extends
										| TMessageMap[TName]['error']
										| null
								>(
									error: TError extends null ? TError : never,
									result: TMessageMap[TName]['result'],
								): void;
								<
									TError extends
										| TMessageMap[TName]['error']
										| null
								>(
									error: TError extends null ? never : TError,
								): void;
						  }),
		) => void,
	): void;
	readReplicant<TName extends keyof TReplicantMap & string>(
		name: TName,
		bundleName: TBundleName,
	): TReplicantMap[TName];
	Replicant<
		TName extends keyof TReplicantMap & string,
		TOptions extends ReplicantOptions<TReplicantMap[TName]>
	>(
		name: TName,
		bundleName: TBundleName,
		options?: TOptions,
	): Replicant<
		TBundleName,
		TReplicantMap,
		TName,
		TOptions extends {defaultValue: TReplicantMap[TName]}
			? TReplicantMap[TName]
			: TReplicantMap[TName] | undefined
	>;
} & (TForOtherBundle extends true
		? {}
		: {
				sendMessage<TName extends keyof TMessageMap & string>(
					name: unknown extends TMessageMap[TName]['data']
						? TName
						: never,
				): void;
				sendMessage<TName extends keyof TMessageMap & string>(
					name: unknown extends TMessageMap[TName]['data']
						? never
						: TName,
					data: TMessageMap[TName]['data'],
				): void;
				listenFor<TName extends keyof TMessageMap & string>(
					name: TForOtherBundle extends true ? never : TName,
					handlerFunc: (
						data: TMessageMap[TName]['data'],
						cb:
							| undefined
							| {handled: true}
							| (unknown extends TMessageMap[TName]['result']
									? {
											handled: false;
											<
												TError extends
													| TMessageMap[TName]['error']
													| null
											>(
												error: TError,
											): void;
									  }
									: {
											handled: false;
											<
												TError extends
													| TMessageMap[TName]['error']
													| null
											>(
												error: TError extends null
													? TError
													: never,
												result: TMessageMap[TName]['result'],
											): void;
											<
												TError extends
													| TMessageMap[TName]['error']
													| null
											>(
												error: TError extends null
													? never
													: TError,
											): void;
									  }),
					) => void,
				): void;
				readReplicant<TName extends keyof TReplicantMap & string>(
					name: TName,
				): TReplicantMap[TName];
				Replicant<
					TName extends keyof TReplicantMap & string,
					TOptions extends ReplicantOptions<TReplicantMap[TName]>
				>(
					name: TName,
					options?: TOptions,
				): Replicant<
					TBundleName,
					TReplicantMap,
					TName,
					TOptions extends {defaultValue: TReplicantMap[TName]}
						? TReplicantMap[TName]
						: TReplicantMap[TName] | undefined
				>;
		  });
