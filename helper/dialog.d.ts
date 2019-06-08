import {Platform} from './platform';

type DialogApi<TPlatform extends Platform> = TPlatform extends 'server'
	? {}
	: TPlatform extends 'browser'
	? {
			getDialog(
				name: string,
				bundle?: string,
			): ReturnType<ParentNode['querySelector']>;
			getDialogDocument(name: string, bundle?: string): Document;
	  }
	: never;
