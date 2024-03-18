export class Note {
  public osc: OscillatorNode;
  public gain: GainNode;
  public frequency: number;
  public oscillatorType: OscillatorType;

  constructor(
    ctx: AudioContext,
    frequency: number,
    oscillatorType: OscillatorType
  ) {
    this.osc = ctx.createOscillator();
    this.gain = ctx.createGain();

    this.osc.type = oscillatorType;
    if (isFinite(frequency)) this.osc.frequency.value = frequency;
    this.gain.gain.value = 0.0;

    this.frequency = frequency;
    this.oscillatorType = oscillatorType;
  }
}

export class NotePlayer {
  public ctx: AudioContext;
  public enabled: boolean = true;
  private compressor: DynamicsCompressorNode;

  constructor() {
    this.ctx = new AudioContext();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.knee.value = 10;
    this.compressor.connect(this.ctx.destination);
  }

  public playNote(note: Note, duration: number) {
    if (!this.enabled) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    note.gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.05);
    note.osc.connect(note.gain);
    note.gain.connect(this.compressor);

    note.osc.start();

    note.gain.gain.linearRampToValueAtTime(
      0.0,
      this.ctx.currentTime + duration
    );
    note.osc.stop(this.ctx.currentTime + duration);
  }
}
