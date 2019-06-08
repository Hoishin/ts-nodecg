import {EventEmitter} from 'events';
import {Logger} from './logger';
import {Platform} from './platform';

export interface ReplicantOptions<TSchema> {
	defaultValue?: TSchema;
	persistent?: boolean;
	schemaPath?: string;
}

export type ReplicantMap = Record<string, unknown>;

export class ReplicantCommon<
	TSchema,
	TBundleName extends string,
	TRepName extends string
> extends EventEmitter {
	name: TRepName;
	namespace: TBundleName;
	opts: ReplicantOptions<TSchema>;
	log: Logger;
	revision: number;
	validate(
		value?: unknown,
		options?: {throwOnInvalid?: boolean},
	): value is TSchema;
	once(event: 'change', listener: (value: TSchema) => void): this;
	value?: TSchema;
}

export class ReplicantServer<
	TSchema,
	TBundleName extends string,
	TRepName extends string
> extends ReplicantCommon<TSchema, TBundleName, TRepName> {
	constructor(
		name: TRepName,
		namespace?: TBundleName,
		opts?: ReplicantOptions<TSchema>,
	);
	on(
		event: 'change',
		listener: (newValue: TSchema, oldValue?: TSchema) => void,
	): this;
}

export class ReplicantBrowser<
	TSchema,
	TBundleName extends string,
	TRepName extends string
> extends ReplicantCommon<TSchema, TBundleName, TRepName> {
	constructor(
		name: TRepName,
		namespace: TBundleName,
		opts: ReplicantOptions<TSchema>,
		socket: SocketIOClient.Socket,
	);
	status: 'undeclared' | 'declared' | 'declaring';
	on(
		event: 'declared' | 'fullUpdate',
		listener: (data: TSchema) => void,
	): this;
	on(
		event: 'change',
		listener: (newValue: TSchema, oldValue?: TSchema) => void,
	): this;
}

export type Replicant<
	TSchema,
	TName extends string,
	TBundleName extends string,
	TPlatform extends Platform
> = TPlatform extends 'browser'
	? ReplicantBrowser<TSchema, TBundleName, TName>
	: TPlatform extends 'server'
	? ReplicantServer<TSchema, TBundleName, TName>
	: never;

export type ReadReplicant<
	TPlatform extends Platform,
	TForOthers extends boolean,
	TRepMap extends ReplicantMap,
	TBundleName extends string
> = <TRepName extends keyof TRepMap>(
	name: TRepName,
	...args: TPlatform extends 'server'
		? (TForOthers extends true ? [TBundleName] : [TBundleName?])
		: TPlatform extends 'browser'
		? (
				| [TBundleName, ((value: TRepMap[TRepName]) => void)]
				| (TForOthers extends true
						? never
						: [((value: TRepMap[TRepName]) => void)]))
		: never
) => TPlatform extends 'server'
	? TRepMap[TRepName]
	: TPlatform extends 'browser'
	? void
	: never;

export type ReplicantFactory<
	TBundleName extends string,
	TRepMap extends ReplicantMap,
	TPlatform extends Platform,
	TForOthers extends boolean
> = <TRepName extends keyof TRepMap>(
	name: TRepName,
	...args: TForOthers extends true
		? [TBundleName, ReplicantOptions<TRepMap[TRepName]>?]
		: (
				| [TBundleName, ReplicantOptions<TRepMap[TRepName]>?]
				| [ReplicantOptions<TRepMap[TRepName]>?])
) => Replicant<TRepMap[TRepName], TRepName, TBundleName, TPlatform>;

export type WaitForReplicants<
	TRepMap extends ReplicantMap,
	TBundleName extends string,
	TPlatform extends Platform
> = (
	...replicants: Replicant<
		TRepMap[keyof TRepMap],
		keyof TRepMap,
		TBundleName,
		TPlatform
	>[]
) => Promise<void>;
