/**
 * Wedding Audio Player & Synthesizer
 * Tích hợp cả Web Audio Synthesizer (Bản hòa tấu lãng mạn phát offline)
 * và HTML5 Audio Player (cho nhạc MP3 online hoặc file người dùng tải lên)
 */

class WeddingAudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioContext = null;
    this.synthInterval = null;
    this.currentTrackType = 'builtin'; // 'builtin', 'sample', 'custom'
    this.volume = 0.6;
    this.trackName = 'Bản Hòa Tấu Lãng Mạn (Piano & Harp)';

    this.sampleTracks = [
      {
        id: 'builtin-1',
        type: 'builtin',
        name: 'Hòa Tấu Lãng Mạn - Wedding Day Dreams (Tích Hợp)',
        url: ''
      },
      {
        id: 'canon-in-d',
        type: 'sample',
        name: 'Canon in D - Pachelbel (Hòa tấu giao hưởng lãng mạn)',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=canon-in-d-major-romantic-wedding-piano-10708.mp3'
      },
      {
        id: 'wedding-piano',
        type: 'sample',
        name: 'Acoustic Wedding Love Story (Nhẹ nhàng, sâu lắng)',
        url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_248467fe08.mp3?filename=wedding-piano-126296.mp3'
      },
      {
        id: 'romantic-memories',
        type: 'sample',
        name: 'Romantic Memories - Wedding Waltz (Du dương, ngọt ngào)',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8b2ff28f32.mp3?filename=romantic-moments-6821.mp3'
      }
    ];

    this.audioElement.volume = this.volume;
    this.onStateChange = null;
  }

  initContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playBuiltinSynth() {
    this.initContext();
    if (!this.audioContext) return;

    this.stopAudioElement();
    this.isPlaying = true;
    if (this.onStateChange) this.onStateChange(true, this.trackName);

    // Giai điệu Canon / Wedding Ballad nốt nhạc (Hz)
    const notes = {
      C4: 261.63, E4: 329.63, G4: 392.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      A4: 440.00, F4: 349.23, D4: 293.66, G3: 196.00, A3: 220.00, F3: 174.61, C3: 130.81
    };

    // Chuỗi hợp âm và giai điệu tình yêu đám cưới
    const melody = [
      { note: notes.E5, dur: 1.2, bass: notes.C3 },
      { note: notes.G5, dur: 0.6 },
      { note: notes.C5, dur: 0.6 },
      { note: notes.D5, dur: 1.2, bass: notes.G3 },
      { note: notes.B4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.C5, dur: 1.2, bass: notes.A3 },
      { note: notes.E5, dur: 0.6 },
      { note: notes.A4, dur: 0.6 },
      { note: notes.B4, dur: 1.2, bass: notes.E4 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.E4, dur: 0.6 },
      { note: notes.A4, dur: 1.2, bass: notes.F3 },
      { note: notes.C5, dur: 0.6 },
      { note: notes.F4, dur: 0.6 },
      { note: notes.G4, dur: 1.2, bass: notes.C3 },
      { note: notes.E4, dur: 0.6 },
      { note: notes.D4, dur: 0.6 },
      { note: notes.C4, dur: 2.0, bass: notes.C3 }
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlaying || this.currentTrackType !== 'builtin') return;

      const item = melody[noteIndex];
      this.playNote(item.note, item.dur * 0.9, 'sine', 0.25);
      if (item.bass) {
        this.playNote(item.bass, item.dur * 1.5, 'triangle', 0.2);
        // Harp shimmer arpeggio
        setTimeout(() => {
          if (this.isPlaying) this.playNote(item.bass * 2, 0.8, 'sine', 0.08);
        }, 150);
      }

      noteIndex = (noteIndex + 1) % melody.length;
      const delay = item.dur * 500;
      this.synthInterval = setTimeout(playNextNote, delay);
    };

    playNextNote();
  }

  playNote(freq, duration, type = 'sine', gainLevel = 0.2) {
    if (!this.audioContext) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel * this.volume, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Audio playNote error:', e);
    }
  }

  stopBuiltinSynth() {
    if (this.synthInterval) {
      clearTimeout(this.synthInterval);
      this.synthInterval = null;
    }
  }

  stopAudioElement() {
    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } catch (e) {}
  }

  play(trackConfig) {
    this.initContext();

    if (trackConfig) {
      this.currentTrackType = trackConfig.type || 'builtin';
      this.trackName = trackConfig.name || 'Nhạc Đám Cưới';
      if (trackConfig.url && trackConfig.type !== 'builtin') {
        this.audioElement.src = trackConfig.url;
      }
    }

    if (this.currentTrackType === 'builtin') {
      this.stopAudioElement();
      this.playBuiltinSynth();
    } else {
      this.stopBuiltinSynth();
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          if (this.onStateChange) this.onStateChange(true, this.trackName);
        })
        .catch(err => {
          console.warn('Cannot autoplay sample URL, fallback to synthesized audio:', err);
          this.currentTrackType = 'builtin';
          this.playBuiltinSynth();
        });
    }
  }

  pause() {
    this.isPlaying = false;
    this.stopBuiltinSynth();
    this.stopAudioElement();
    if (this.onStateChange) this.onStateChange(false, this.trackName);
  }

  toggle(trackConfig) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(trackConfig);
    }
  }

  setCustomAudioFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioUrl = e.target.result;
        this.currentTrackType = 'custom';
        this.trackName = file.name.replace(/\.[^/.]+$/, "");
        this.audioElement.src = audioUrl;
        resolve({
          type: 'custom',
          name: this.trackName,
          url: audioUrl
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

window.weddingAudio = new WeddingAudioPlayer();
