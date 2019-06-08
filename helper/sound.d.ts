import {Platform} from './platform';

interface Cue {
	name: string;
	assignable: boolean;
	defaultFile: string;
}

type TypedSoundApi<TPlatform extends Platform> = TPlatform extends 'server'
	? {}
	: TPlatform extends 'browser'
	? {
			findCue(cueName: string): Cue | undefined;
			playSound(
				cueName: string,
				opts?: {updateVolume?: boolean},
			): createjs.AbstractSoundInstance;
			stopSound(cueName: string): void;
			stopAllSounds(): void;
			soundReady?: boolean;
	  }
	: never;
