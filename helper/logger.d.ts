export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export class Logger {
	constructor(name: string);
	trace<T extends unknown[]>(...args: T): void;
	debug<T extends unknown[]>(...args: T): void;
	info<T extends unknown[]>(...args: T): void;
	warn<T extends unknown[]>(...args: T): void;
	error<T extends unknown[]>(...args: T): void;
	static globalReconfigure(
		opts: LoggerOptions & {file: {path: string}},
	): void;
}

export interface LoggerOptions {
	replicants?: boolean;
	console?: {
		enabled: boolean;
		level: LoggerLevel;
	};
	file?: {
		enabled: boolean;
		level: LoggerLevel;
	};
}

export type LoggerApi = {
	Logger: typeof Logger
}
