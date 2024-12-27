class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private currentBgm: HTMLAudioElement | null = null;
  private drowningSound: HTMLAudioElement | null = null;

  private constructor() {
    this.initializeSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    // Sound effects
    this.loadSound('typing', '/typing.mp3', 0.2);
    this.loadSound('correct', '/correct.mp3', 0.3);
    this.loadSound('gameOver', '/game_over.mp3', 0.4);
    this.loadSound('newBest', '/new_personal_best.mp3', 0.4);
    this.loadSound('nextLevel', '/next_level.mp3', 0.4);
    this.loadSound('drowning', '/sonic_drowning.mp3', 0.05);

    // Background music
    for (let i = 1; i <= 7; i++) {
      this.loadSound(`level${i}`, `/Level_${i}.mp3`, 0.2);
    }
  }

  private loadSound(key: string, path: string, defaultVolume: number) {
    const audio = new Audio(path);
    audio.volume = defaultVolume;
    if (key.startsWith('level')) {
      audio.loop = true;
    }
    this.sounds.set(key, audio);
  }

  public playTyping() {
    const typing = this.sounds.get('typing');
    if (typing) {
      typing.currentTime = 0;
      typing.play().catch(() => {}); // Ignore autoplay restrictions
    }
  }

  public playCorrect() {
    const correct = this.sounds.get('correct');
    if (correct) {
      correct.currentTime = 0;
      correct.play().catch(() => {});
    }
  }

  public playGameOver(isNewHighScore: boolean) {
    this.stopAllMusic();
    
    const soundKey = isNewHighScore ? 'newBest' : 'gameOver';
    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  public playNextLevel() {
    const nextLevel = this.sounds.get('nextLevel');
    if (nextLevel) {
      nextLevel.currentTime = 0;
      nextLevel.play().catch(() => {});
    }
  }

  public startLevelMusic(level: number) {
    this.stopBgm();
    
    // Cap at Level 7 music
    const actualLevel = Math.min(level, 7);
    const bgm = this.sounds.get(`level${actualLevel}`);
    
    if (bgm) {
      bgm.currentTime = 0;
      bgm.play().catch(() => {});
      this.currentBgm = bgm;
    }
  }

  public startDrowningSound() {
    const drowning = this.sounds.get('drowning');
    if (drowning) {
      drowning.currentTime = 0;
      drowning.volume = 0.05; // Start very quiet
      drowning.play().catch(() => {});
      this.drowningSound = drowning;
    }
  }

  public updateDrowningVolume(timeRemaining: number, totalTime: number) {
    if (this.drowningSound) {
      const timeRatio = timeRemaining / totalTime;
      if (timeRatio <= 0.33) { // Red zone
        // Gradually increase volume from 0.05 to 0.3
        this.drowningSound.volume = 0.05 + (0.25 * (1 - (timeRatio / 0.33)));
      } else {
        this.drowningSound.volume = 0.05;
      }
    }
  }

  public stopDrowningSound() {
    if (this.drowningSound) {
      this.drowningSound.pause();
      this.drowningSound.currentTime = 0;
    }
  }

  private stopBgm() {
    if (this.currentBgm) {
      this.currentBgm.pause();
      this.currentBgm.currentTime = 0;
    }
  }

  public stopAllMusic() {
    this.stopBgm();
    this.stopDrowningSound();
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export const soundManager = SoundManager.getInstance();