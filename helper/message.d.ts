import {Platform} from './platform';

type Message = {
	data?: unknown;
	result?: unknown;
	error?: unknown;
};

type MessageMap = Record<string, Message>;

type SendMessageServer<TMessageMap extends MessageMap> = <
	TMessageName extends keyof TMessageMap
>(
	name: TMessageName,
	...args: unknown extends TMessageMap[TMessageName]['data']
		? never
		: [TMessageMap[TMessageName]['data']]
) => void;
type SendMessageBrowser<TMessageMap extends MessageMap> = <
	TMessageName extends keyof TMessageMap,
	TArgs extends unknown extends TMessageMap[TMessageName]['data']
		? [
				((
					error: TMessageMap[TMessageName]['error'] | null,
					result: TMessageMap[TMessageName]['result'],
				) => void)?,
		  ]
		: [
				TMessageMap[TMessageName]['data'],
				((
					error: TMessageMap[TMessageName]['error'] | null,
					result: TMessageMap[TMessageName]['result'],
				) => void)?,
		  ]
>(
	name: TMessageName,
	...args: TArgs
) => TArgs extends (
	| [
			((
				error: TMessageMap[TMessageName]['error'] | null,
				result: TMessageMap[TMessageName]['result'],
			) => void),
	  ]
	| [
			TMessageMap[TMessageName]['data'],
			((
				error: TMessageMap[TMessageName]['error'] | null,
				result: TMessageMap[TMessageName]['result'],
			) => void),
	  ])
	? void
	: Promise<
			unknown extends TMessageMap[TMessageName]['result']
				? void
				: TMessageMap[TMessageName]['result']
	  >;
type SendMessage<
	TMessageMap extends MessageMap,
	TPlatform extends Platform
> = TPlatform extends 'server'
	? SendMessageServer<TMessageMap>
	: TPlatform extends 'browser'
	? SendMessageBrowser<TMessageMap>
	: never;

type SendMessageToBundleServer<
	TBundleName extends string,
	TMessageMap extends MessageMap
> = <TMessageName extends keyof TMessageMap>(
	name: TMessageName,
	bundleName: TBundleName,
	...args: unknown extends TMessageMap[TMessageName]['data']
		? never
		: [TMessageMap[TMessageName]['data']]
) => void;
type SendMessageToBundleBrowser<
	TBundleName extends string,
	TMessageMap extends MessageMap
> = <
	TMessageName extends keyof TMessageMap,
	TArgs extends unknown extends TMessageMap[TMessageName]['data']
		? [
				((
					error: TMessageMap[TMessageName]['error'],
					result: TMessageMap[TMessageName]['result'],
				) => void)?,
		  ]
		: [
				TMessageMap[TMessageName]['data'],
				((
					error: TMessageMap[TMessageName]['error'],
					result: TMessageMap[TMessageName]['result'],
				) => void)?,
		  ]
>(
	name: TMessageName,
	...args: TArgs
) => TArgs extends [TMessageMap[TMessageName]['data']?]
	? Promise<TMessageMap[TMessageName]['result']>
	: void;
type SendMessageToBundle<
	TMessageMap extends MessageMap,
	TPlatform extends Platform,
	TBundleName extends string
> = TPlatform extends 'server'
	? SendMessageToBundleServer<TBundleName, TMessageMap>
	: TPlatform extends 'browser'
	? SendMessageToBundleBrowser<TBundleName, TMessageMap>
	: never;

type ListenForCb<
	TResult,
	TPlatform extends Platform
> = TPlatform extends 'server'
	? never
	: TPlatform extends 'browser'
	? (result: TResult) => void
	: never;

type ListenForServer<
	TBundleName extends string,
	TForOthers extends boolean,
	TMessageMap extends MessageMap
> = <TMessageName extends keyof TMessageMap>(
	name: TMessageName,
	...args:
		| [
				((
					data: TMessageMap[TMessageName]['data'],
					cb?:
						| {handled: true}
						| {
								handled: false;
								(
									error:
										| TMessageMap[TMessageName]['error']
										| null,
									result: TMessageMap[TMessageName]['result'],
								): void;
						  },
				) => void),
		  ]
		| (TForOthers extends true
				? never
				: [
						TBundleName,
						((
							data: TMessageMap[TMessageName]['data'],
							cb?:
								| {handled: true}
								| {
										handled: false;
										(
											error: null,
											result: TMessageMap[TMessageName]['result'],
										): void;
								  }
								| {
										handled: false;
										(
											error: TMessageMap[TMessageName]['error'],
										): void;
								  },
						) => void),
				  ])
) => void;
type ListenForBrowser<
	TForOthers extends boolean,
	TBundleName extends string,
	TMessageMap extends MessageMap
> = <TMessageName extends keyof TMessageMap>(
	name: TMessageName,
	...args:
		| [((data: TMessageMap[TMessageName]['data']) => void)]
		| (TForOthers extends true
				? never
				: [
						TBundleName,
						((data: TMessageMap[TMessageName]['data']) => void),
				  ])
) => void;
type ListenFor<
	TMessageMap extends MessageMap,
	TBundleName extends string,
	TPlatform extends Platform,
	TForOthers extends boolean
> = TPlatform extends 'server'
	? ListenForServer<TBundleName, TForOthers, TMessageMap>
	: TPlatform extends 'browser'
	? ListenForBrowser<TForOthers, TBundleName, TMessageMap>
	: never;
