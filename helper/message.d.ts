export interface Message {
	data?: unknown;
	result?: unknown;
	error?: unknown;
}

export interface MessageMap {
	[key: string]: Message;
}
