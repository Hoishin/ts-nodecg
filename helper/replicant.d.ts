import {EventEmitter} from 'events';
import {Logger} from './logger';

export interface ReplicantOptions<TSchema> {
	defaultValue?: TSchema;
	persistent?: boolean;
	schemaPath?: string;
}

export interface ReplicantMap {
	[key: string]: unknown;
}

export class ReplicantCommon<
	TBundleName extends string,
	TRepName extends string,
	TSchema,
	TValue extends TSchema | undefined
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
	value: TValue;
}
