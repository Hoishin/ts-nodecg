import {CreateNodecgInstance} from '../browser';
import {expectType, expectError} from 'tsd';

class CustomError extends Error {}

type OtherBundleMsgMap = {
	increment: {};
	updateNumber: {data: number; result: boolean; error: CustomError};
};
type ThisBundleMsgMap = {
	ping: {};
	increment: {data: 1 | 2 | 3};
	updateName: {data: string; result: {name: string; age: string}};
	updatePlace: {data: string; error: CustomError};
};

type OtherBundle = CreateNodecgInstance<
	{},
	'other-bundle',
	{},
	OtherBundleMsgMap,
	true
>;
type ThisBundle = CreateNodecgInstance<{}, 'this-bundle', {}, ThisBundleMsgMap>;

declare const nodecg: ThisBundle & OtherBundle;

expectType<Promise<void>>(nodecg.sendMessage('ping'));
expectError(nodecg.sendMessage('ping', 'foobar'));
expectType<Promise<void>>(nodecg.sendMessage('increment', 2));
expectType<void>(
	nodecg.sendMessage('updateName', 'mr foo', (err, result) => {
		expectType<unknown>(err);
		expectType<string>(result.age);
	}),
);
expectError(nodecg.sendMessage('updatePlace', () => {}));
expectType<void>(
	nodecg.sendMessage('updatePlace', 'smile', (err) => {
		expectType<CustomError | null>(err);
	}),
);
expectError(nodecg.sendMessage('updateNumber'));
