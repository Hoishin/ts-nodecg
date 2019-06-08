import {MessageApi} from '../helper/message';

class CustomError extends Error {}

type OtherBundleMsgMap = {
	increment: {};
	updateNumber: {data: number; result: boolean; error: CustomError};
};
type ThisBundleMsgMap = {
	increment: {data: 1 | 2 | 3};
	updateName: {data: string; result: {name: string; age: string}};
};

type OtherBundle = MessageApi<
	OtherBundleMsgMap,
	'other-bundle',
	'server',
	true
>;
type ThisBundle = MessageApi<
	ThisBundleMsgMap,
	'this-bundle',
	'server',
	false
>;

declare const nodecg: ThisBundle & OtherBundle;

nodecg.sendMessage('increment', 1);
nodecg.sendMessageToBundle('updateNumber', 'other-bundle', 123);
nodecg.listenFor('updateName', 'this-bundle', (data, cb) => {
	console.log(data);
	if (cb && !cb.handled) {
		cb({name: 'foo', age: '12yo'});
	}
});
