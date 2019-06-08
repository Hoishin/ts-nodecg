import {LoggerOptions} from './logger';

export type NodeCGConfig = {
	host: string;
	port: number;
	developer: boolean;
	baseURL: string;
	logging: LoggerOptions;
	sentry: {
		enabled?: boolean;
		publicDsn?: string;
	};
	login: {
		enabled?: boolean;
		local?: {
			enabled: boolean;
		};
		steam?: {
			enabled: boolean;
		};
		twitch?: {
			enabled: boolean;
			clientID: string;
			scope: string;
		};
	};
	ssl?: {
		enabled: boolean;
	};
}
