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
	log: Logger;
	name: TRepName;
	namespace: TBundleName;
	opts: ReplicantOptions<TSchema>;
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
		name: string,
		namespace?: string,
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
		name: string,
		namespace: string,
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
> = TPlatform extends 'server'
	? {
			<TReplicantName extends keyof TRepMap>(
				name: TReplicantName,
				namespace: TBundleName,
			): TRepMap[TReplicantName];
	  } & (TForOthers extends false
			? {
					<TReplicantName extends keyof TRepMap>(
						name: TReplicantName,
					): TRepMap[TReplicantName];
			  }
			: {})
	: TPlatform extends 'browser'
	? {
			<TReplicantName extends keyof TRepMap>(
				name: TReplicantName,
				namespace: TBundleName,
				cb: (value: TRepMap[TReplicantName]) => void,
			): void;
	  } & (TForOthers extends false
			? {
					<TReplicantName extends keyof TRepMap>(
						name: TReplicantName,
						cb: (value: TRepMap[TReplicantName]) => void,
					): void;
			  }
			: {})
	: never;

export type ReplicantFactory<
	TBundleName extends string,
	TRepMap extends ReplicantMap,
	TPlatform extends Platform,
	TForOthers extends boolean
> = {
	<TReplicantName extends keyof TRepMap>(
		name: TReplicantName,
		namespace: TBundleName,
		opts?: ReplicantOptions<TRepMap[TReplicantName]>,
	): Replicant<
		TRepMap[TReplicantName],
		TReplicantName,
		TBundleName,
		TPlatform
	>;
} & (TForOthers extends false
	? <TReplicantName extends keyof TRepMap>(
			name: TReplicantName,
			opts?: ReplicantOptions<TRepMap[TReplicantName]>,
	  ) => Replicant<
			TRepMap[TReplicantName],
			TReplicantName,
			TBundleName,
			TPlatform
	  >
	: {});

export type TypedReplicantApi<
	TBundleName extends string,
	TRepMap extends ReplicantMap,
	TPlatform extends Platform,
	TForOthers extends boolean
> = {
	Replicant: ReplicantFactory<TBundleName, TRepMap, TPlatform, TForOthers>;
	readReplicant: ReadReplicant<TPlatform, TForOthers, TRepMap, TBundleName>;
};
