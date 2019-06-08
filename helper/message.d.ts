import {Platform} from './platform';

type Message = {
	data?: unknown;
	result?: unknown;
	error?: unknown;
};

type MessageMap = Record<string, Message>

type SendMessage<
	TMessageMap extends MessageMap,
	TPlatform extends Platform
> = TPlatform extends 'server'
	? <TMessageName extends keyof TMessageMap>(
			name: TMessageName,
			...args: unknown extends TMessageMap[TMessageName]['data']
				? []
				: [TMessageMap[TMessageName]['data']]
	  ) => void
	: TPlatform extends 'browser'
	? {
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				...args: unknown extends TMessageMap[TMessageName]['data']
					? [
							(
								error: TMessageMap[TMessageName]['error'],
								result: TMessageMap[TMessageName]['result'],
							) => void,
					  ]
					: [
							TMessageMap[TMessageName]['data'],
							(
								error: TMessageMap[TMessageName]['error'],
								result: TMessageMap[TMessageName]['result'],
							) => void,
					  ]
			): void;
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				...args: unknown extends TMessageMap[TMessageName]['data']
					? []
					: [TMessageMap[TMessageName]['data']]
			): Promise<TMessageMap[TMessageName]['result']>;
	  }
	: never;

type SendMessageToBundle<
	TMessageMap extends MessageMap,
	TPlatform extends Platform,
	TBundleName extends string
> = TPlatform extends 'server'
	? <TMessageName extends keyof TMessageMap>(
			name: TMessageName,
			bundleName: TBundleName,
			...args: unknown extends TMessageMap[TMessageName]['data']
				? []
				: [TMessageMap[TMessageName]['data']]
	  ) => void
	: TPlatform extends 'browser'
	? {
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				bundleName: TBundleName,
				...args: unknown extends TMessageMap[TMessageName]['data']
					? [
							(
								error: TMessageMap[TMessageName]['error'],
								result: TMessageMap[TMessageName]['result'],
							) => void,
					  ]
					: [
							TMessageMap[TMessageName]['data'],
							(
								error: TMessageMap[TMessageName]['error'],
								result: TMessageMap[TMessageName]['result'],
							) => void,
					  ]
			): void;
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				bundleName: TBundleName,
				...args: unknown extends TMessageMap[TMessageName]['data']
					? []
					: [TMessageMap[TMessageName]['data']]
			): Promise<TMessageMap[TMessageName]['result']>;
	  }
	: never;

type ListenForCb<
	TResult,
	TPlatform extends Platform
> = TPlatform extends 'server'
	? (
			| {handled: true}
			| {
					handled: false;
					(result: TResult): void;
			  })
	: TPlatform extends 'browser'
	? (result: TResult) => void
	: never;

type ListenFor<
	TMessageMap extends MessageMap,
	TBundleName extends string,
	TPlatform extends Platform,
	TForOthers extends boolean
> = TPlatform extends 'server'
	? ({
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				bundleName: TBundleName,
				cb: (
					data: TMessageMap[TMessageName]['data'],
					cb?: ListenForCb<
						TMessageMap[TMessageName]['result'],
						TPlatform
					>,
				) => void,
			): void;
	  } & (TForOthers extends false
			? {
					<TMessageName extends keyof TMessageMap>(
						name: TMessageName,
						cb: (
							data: TMessageMap[TMessageName]['data'],
							cb?: ListenForCb<
								TMessageMap[TMessageName]['result'],
								TPlatform
							>,
						) => void,
					): void;
			  }
			: {}))
	: TPlatform extends 'browser'
	? ({
			<TMessageName extends keyof TMessageMap>(
				name: TMessageName,
				bundleName: TBundleName,
				cb: (data: TMessageMap[TMessageName]['data']) => void,
			): void;
	  } & (TForOthers extends false
			? {
					<TMessageName extends keyof TMessageMap>(
						name: TMessageName,
						cb: (data: TMessageMap[TMessageName]['data']) => void,
					): void;
			  }
			: {}))
	: never;

export type MessageApi<
	TMessageMap extends MessageMap,
	TBundleName extends string,
	TPlatform extends Platform,
	TForOthers extends boolean
> = TForOthers extends false
	? {
			sendMessage: SendMessage<TMessageMap, TPlatform>;
			sendMessageToBundle: SendMessageToBundle<
				TMessageMap,
				TPlatform,
				TBundleName
			>;
			listenFor: ListenFor<
				TMessageMap,
				TBundleName,
				TPlatform,
				TForOthers
			>;
			unlinsten: ListenFor<
				TMessageMap,
				TBundleName,
				TPlatform,
				TForOthers
			>;
	  }
	: {
			sendMessageToBundle: SendMessageToBundle<
				TMessageMap,
				TPlatform,
				TBundleName
			>;
			listenFor: ListenFor<
				TMessageMap,
				TBundleName,
				TPlatform,
				TForOthers
			>;
			unlisten: ListenFor<
				TMessageMap,
				TBundleName,
				TPlatform,
				TForOthers
			>;
	  };
