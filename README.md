# ts-nodecg

[![CircleCI](https://circleci.com/gh/Hoishin/ts-nodecg.svg?style=svg)](https://circleci.com/gh/Hoishin/ts-nodecg)

Type your bundle with bundle specific definition like replicants and messages.

This library replaces the type definition in NodeCG core (`nodecg/types/{browser,server}.d.ts`).
If you use this library, don't use the type definition in NodeCG core.

## Install

```sh
npm i -D ts-nodecg
# or
yarn add -D ts-nodecg
```

**TypeScript 3.5 or newer is recommended**

## Usage

First, define your bundle's replicant and messages.

```ts
type ReplicantMap = {
	players: Array<{name: string; twitter: string}>;
	// ...
};

type MessageMap = {
	updateFoo: {
		// optional value to send with sendMessage / value to receive from listenFor
		data: number;
		// optional value to receive from sendMessage / value to send with listenFor callback
		result: number;
		// optional error object/value sent from listenFor callback
		error: CustomError;
	};
};
```

### For server-side (extension)

```ts
import {CreateNodecgInstance} from 'ts-nodecg/server';

type NodeCG = CreateNodecgInstance<
	BundleConfig,
	'my-bundle', // name of your bundle
	ReplicantMap,
	MessageMap
>;

export = (nodecg: NodeCG) => {
	// ...
};
```

### For client-side (dashboard/graphics)

Define the global `nodecg`/`NodeCG` variables somewhere in the project.

```ts
import {CreateNodecgInstance, CreateNodecgConstructor} from 'ts-nodecg/browser';

declare global {
	interface Window {
		nodecg: CreateNodecgInstance<
			BundleConfig,
			'my-bundle', // name of your bundle
			ReplicantMap,
			MessageMap
		>;
		NodeCG: CreateNodecgConstructor<
			BundleConfig,
			'my-bundle', // name of your bundle
			ReplicantMap,
			MessageMap
		>;
	}
}
```

### Exposing your bundle's definition

Coming Soon&trade;

## License

MIT &copy; Keiichiro Amemiya
