import { NodeCGServer, NodeCGBrowser } from "nodecg/types/lib/nodecg-instance";
import { Platform } from "nodecg/types/lib/platform";
import { ReplicantOptions, Replicant } from "nodecg/types/lib/replicant";

type ListenForCb<TResult> =
	| {
			handled: true;
	  }
	| {
			handled: false;
			(result: TResult): void;
	  };

type SendMessageReturnType<
	TPlatform extends Platform,
	TResult
> = TPlatform extends "server" ? void : Promise<TResult>;

type Messages = {
	[message: string]: {
		data?: unknown;
		result?: unknown;
		error?: Error;
		bundleName?: string;
	};
};

type Replicants = {
	[replicantName: string]: {
		schema: unknown;
		bundleName?: string;
	};
};

const createTypedNodeCGHelper = <
	TMessages extends Messages,
	TReplicants extends Replicants,
	TNodeCG extends NodeCGServer | NodeCGBrowser,
	TPlatform extends Platform = TNodeCG extends NodeCGServer
		? "server"
		: "browser"
>(
	nodecg: TNodeCG
): {
	sendMessage<T extends keyof TMessages>(
		message: T,
		cb?: (
			error: TMessages[T]["error"],
			result: TMessages[T]["result"]
		) => void
	): SendMessageReturnType<TPlatform, TMessages[T]["result"]>;
	sendMessage<T extends keyof TMessages>(
		message: T,
		data: TMessages[T]["data"],
		cb?: (
			error: TMessages[T]["error"],
			result: TMessages[T]["result"]
		) => void
	): SendMessageReturnType<TPlatform, TMessages[T]["result"]>;

	listenFor<T extends keyof TMessages>(
		message: T,
		handleFunc: TPlatform extends "server"
			? (
					data: TMessages[T]["data"],
					cb?: ListenForCb<TMessages[T]["result"]>
			  ) => void
			: (data: TMessages[T]["data"]) => void
	): void;
	listenFor<T extends keyof TMessages>(
		message: T,
		bundleName: TMessages[T]["bundleName"],
		handleFunc: TPlatform extends "server"
			? (
					data: TMessages[T]["data"],
					cb?: ListenForCb<TMessages[T]["result"]>
			  ) => void
			: (data: TMessages[T]["data"]) => void
	): void;

	unlisten<T extends keyof TMessages>(
		message: T,
		handleFunc: TPlatform extends "server"
			? (
					data: TMessages[T]["data"],
					cb?: ListenForCb<TMessages[T]["result"]>
			  ) => void
			: (data: TMessages[T]["data"]) => void
	): void;
	unlisten<T extends keyof TMessages>(
		message: T,
		bundleName: TMessages[T]["bundleName"],
		handleFunc: TPlatform extends "server"
			? (
					data: TMessages[T]["data"],
					cb?: ListenForCb<TMessages[T]["result"]>
			  ) => void
			: (data: TMessages[T]["data"]) => void
	): void;

	Replicant<T extends keyof TReplicants, TSchema = TReplicants[T]["schema"]>(
		name: T,
		opts?: ReplicantOptions<TSchema>
	): Replicant<TSchema, TPlatform>;
	Replicant<T extends keyof TReplicants, TSchema = TReplicants[T]["schema"]>(
		name: T,
		namespace: TReplicants[T]["bundleName"],
		opts?: ReplicantOptions<TSchema>
	): Replicant<TSchema, TPlatform>;
} & TPlatform extends "server"
	? {}
	: {
			readReplicant<T extends keyof TReplicants>(
				name: T,
				cb: (value: TReplicants[T]["schema"]) => void
			): void;
			readReplicant<T extends keyof TReplicants>(
				name: T,
				namespace: TReplicants[T]["bundleName"],
				cb: (value: TReplicants[T]["schema"]) => void
			): void;
	  } => {
	return {
		sendMessage: nodecg.sendMessage,
		listenFor: nodecg.listenFor,
		unlisten: nodecg.unlisten,
		Replicant: nodecg.Replicant,
		readReplicant: (nodecg as NodeCGBrowser).readReplicant
	} as any;
};

export default createTypedNodeCGHelper;
