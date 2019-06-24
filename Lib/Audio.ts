namespace Lib {
    export class SoundEffect {
        private m_player: HTMLAudioElement;

        public assetPath: string;
        
        public constructor(path: string, loop: boolean) {
            this.m_player = new Audio(path);
            this.m_player.loop = loop;
        }

        public get loop(): boolean {
            return this.m_player.loop;
        }

        public set loop(value: boolean) {
            this.m_player.loop = value;
        }

        public destory(): void {
            this.m_player = undefined;
        }

        public play(): void {
            if (!this.m_player.paused) {
                this.stop();
            }
            this.m_player.play();
        }

        public pause(): void {
            this.m_player.pause();
        }

        public stop(): void {
            this.m_player.pause();
            this.m_player.currentTime = 0;
        }
    }

    export class AudioManager {
        private static m_soundEffects: { [name: string]: SoundEffect } = {};
        public static loadSoundFile(name: string, assetPath: string, loop: boolean): void {
            AudioManager.m_soundEffects[name] = new SoundEffect(assetPath, loop);
        }

        public static playSound(name: string): void {
            if (AudioManager.m_soundEffects[name] !== undefined) {
                AudioManager.m_soundEffects[name].play();
            }
        }

        public static stopSound(name: string): void {
            if (AudioManager.m_soundEffects[name] !== undefined) {
                AudioManager.m_soundEffects[name].stop();
            }
        }

        public static pauseSound(name: string): void {
            if (AudioManager.m_soundEffects[name] !== undefined) {
                AudioManager.m_soundEffects[name].pause();
            }
        }

        public static stopAll(name: string): void {
            for (let i in AudioManager.m_soundEffects) {
                AudioManager.m_soundEffects[i].stop();
            }
        }

        public static pauseAll(name: string): void {
            for (let i in AudioManager.m_soundEffects) {
                AudioManager.m_soundEffects[i].pause();
            }
        }
    }
}