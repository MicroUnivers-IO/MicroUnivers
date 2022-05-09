export class Loop {

    private callback: VoidFunction;
    private running: boolean;
    private interval: number;

    // Vars used in the _start fn
    private actualTicks: number;
    private previousTick: number;
    private now: number;
    
    constructor(interval: number, callback: VoidFunction) {
        this.interval = interval;
        this.callback = callback;
        this.running = false;
        this.actualTicks = 0;
        this.previousTick = 0;
        this.now = 0;
    }

    stop() {
        this.running = false;
    }

    start() {
        this.running = true;
        this._start();
    }

    private _start() {

        if (!this.running) return;

        this.now = Date.now();
        this.actualTicks++;

        if (this.previousTick + this.interval <= this.now) {
            this.previousTick = this.now;
            this.callback();
            this.actualTicks = 0;
        }

        if (Date.now() - this.previousTick < this.interval - 16) {
            setTimeout(this._start.bind(this, this.callback));
        } else {
            setImmediate(this._start.bind(this, this.callback));
        }
    }

}
