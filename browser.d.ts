/// <reference lib="es2015" />
/// <reference lib="dom" />
/// <reference types="socket.io-client" />
/// <reference types="soundjs" />

import {NodecgCommon} from './helper/nodecg';
import {
	ReplicantMap,
	ReplicantCommon,
	ReplicantOptions,
} from './helper/replicant';
import {MessageMap} from './helper/message';

export interface Cue {
	name: string;
	assignable: boolean;
	defaultFile: string;
}

export type SendMessage<TMessageMap extends MessageMap> = {
	<TName extends keyof TMessageMap & string>(
		name: unknown extends TMessageMap[TName]['data'] ? TName : never,
	): Promise<
		unknown extends TMessageMap[TName]['result']
			? void
			: TMessageMap[TName]['result']
	>;
	<TName extends keyof TMessageMap & string>(
		name: unknown extends TMessageMap[TName]['data'] ? TName : never,
		cb: (
			error: TMessageMap[TName]['error'] | null,
			result: TMessageMap[TName]['result'],
		) => void,
	): void;
	<TName extends keyof TMessageMap & string>(
		name: unknown extends TMessageMap[TName]['data'] ? never : TName,
		data: TMessageMap[TName]['data'],
	): Promise<
		unknown extends TMessageMap[TName]['result']
			? void
			: TMessageMap[TName]['result']
	>;
	<TName extends keyof TMessageMap & string>(
		name: unknown extends TMessageMap[TName]['data'] ? never : TName,
		data: TMessageMap[TName]['data'],
		cb: (
			error: TMessageMap[TName]['error'] | null,
			result: TMessageMap[TName]['result'],
		) => void,
	): void;
};

export type SendMessageToBundle<TBundleName, TMessageMap extends MessageMap> = {
	<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? TName : never,
		bundleName: TBundleName,
	): Promise<TMessageMap[TName]['result']>;
	<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? TName : never,
		bundleName: TBundleName,
		cb: (
			error: TMessageMap[TName]['error'] | null,
			result: TMessageMap[TName]['result'],
		) => void,
	): void;
	<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? never : TName,
		bundleName: TBundleName,
		data: TMessageMap[TName]['data'],
	): Promise<TMessageMap[TName]['result']>;
	<TName extends keyof TMessageMap & string>(
		messageName: unknown extends TMessageMap[TName]['data'] ? never : TName,
		bundleName: TBundleName,
		data: TMessageMap[TName]['data'],
		cb: (
			error: TMessageMap[TName]['error'] | null,
			result: TMessageMap[TName]['result'],
		) => void,
	): void;
};

export class Replicant<
	TBundleName extends string,
	TReplicantMap extends ReplicantMap,
	TName extends keyof ReplicantMap & string,
	TValue extends TReplicantMap[TName] | undefined
> extends ReplicantCommon<TBundleName, TName, TReplicantMap[TName], TValue> {
	status: 'undeclared' | 'declared' | 'declaring';
	on<TEvent extends 'change' | 'declared' | 'fullUpdate'>(
		event: TEvent,
		listener: TEvent extends 'change'
			? (
					newValue: TReplicantMap[TName],
					oldValue?: TReplicantMap[TName],
			  ) => void
			: (data: TReplicantMap[TName]) => void,
	): this;
	once<TEvent extends 'change' | 'declared' | 'fullUpdate'>(
		event: TEvent,
		listener: TEvent extends 'change'
			? (
					newValue: TReplicantMap[TName],
					oldValue?: TReplicantMap[TName],
			  ) => void
			: (data: TReplicantMap[TName]) => void,
	): this;
	removeListener<TEvent extends 'change' | 'declared' | 'fullUpdate'>(
		event: TEvent,
		listener: TEvent extends 'change'
			? (
					newValue: TReplicantMap[TName],
					oldValue?: TReplicantMap[TName],
			  ) => void
			: (data: TReplicantMap[TName]) => void,
	): this;
	removeAllListeners(event: 'change' | 'declared' | 'fullUpdate'): this;
}

export type CreateNodecgInstance<
	TBundleName extends string,
	TBundleConfig,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap,
	TForOtherBundle extends boolean = false
> = NodecgCommon<TBundleName, TBundleConfig> & {
	socket: SocketIOClient.Socket;
	getDialog(
		name: string,
		bundle: string,
	): ReturnType<ParentNode['querySelector']>;
	getDialogDocument(name: string, bundle: TBundleName): Document;
	findCue(cueName: string): Cue | undefined;
	playSound(
		cueName: string,
		opts?: {updateVolume?: boolean},
	): createjs.AbstractSoundInstance;
	stopSound(cueName: string): void;
	stopAllSounds(): void;
	soundReady?: boolean;
	sendMessageToBundle: SendMessageToBundle<TBundleName, TMessageMap>;
	listenFor<TName extends keyof TMessageMap & string>(
		messageName: TName,
		bundleName: TBundleName,
		handlerFunc: (data: TMessageMap[TName]['data']) => void,
	): void;
	unlisten<TName extends keyof TMessageMap & string>(
		messageName: TName,
		bundleName: TBundleName,
		handlerFunc: (data: TMessageMap[TName]['data']) => void,
	): void;
	readReplicant<TName extends keyof TReplicantMap & string>(
		name: TName,
		bundleName: TBundleConfig,
		cb: (value: TReplicantMap[TName]) => void,
	): void;
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
		TReplicantMap[TName] | undefined
	>;
} & (TForOtherBundle extends true
		? {}
		: {
				getDialogDocument(name: string): Document;
				getDialog(
					name: string,
				): ReturnType<ParentNode['querySelector']>;
				sendMessage: SendMessage<TMessageMap>;
				listenFor<TName extends keyof TMessageMap & string>(
					messageName: TName,
					handlerFunc: (data: TMessageMap[TName]['data']) => void,
				): void;
				unlisten<TName extends keyof TMessageMap & string>(
					messageName: TName,
					handlerFunc: (data: TMessageMap[TName]['data']) => void,
				): void;
				readReplicant<TName extends keyof TReplicantMap & string>(
					name: TName,
					cb: (value: TReplicantMap[TName]) => void,
				): void;
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
					TReplicantMap[TName] | undefined
				>;
		  });

export type CreateNodecgConstructor<
	TBundleName extends string,
	TBundleConfig,
	TReplicantMap extends ReplicantMap,
	TMessageMap extends MessageMap,
	TForOtherBundle extends boolean = false
> = {
	version: string;

	sendMessageToBundle: SendMessageToBundle<TBundleName, TMessageMap>;

	readReplicant<TName extends keyof TReplicantMap & string>(
		name: TName,
		bundleName: TBundleConfig,
		cb: (value: TReplicantMap[TName]) => void,
	): void;
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
	waitForReplicants(
		...replicants: Array<Replicant<string, {}, string, {}>>
	): Promise<void>;
};
