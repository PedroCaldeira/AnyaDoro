const EventEmitter = require("events");

class Timer extends EventEmitter {
  constructor(seconds) {
    super();
    this.seconds = seconds;
    this.ticking = true;
  }

  setTime(seconds) {
    this.seconds = seconds;
  }

  getTime() {
    return this.seconds;
  }

  isTimeOver() {
    return this.seconds <= 0;
  }

  getFormattedTime() {
    const hours = Math.floor(this.seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((this.seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (this.seconds % 60).toString().padStart(2, "0");
    return hours === "00"
      ? `${minutes}:${seconds}`
      : `${hours}:${minutes}:${seconds}`;
  }

  tickUp() {
    this.seconds++;
  }

  tickDown() {
    this.seconds--;
  }

  pause() {
    this.ticking = false;
  }

  resume() {
    this.ticking = true;
    this.countdown();
  }

  start() {
    this.countdown();
  }

  countdown() {
    if (this.isTimeOver()) {
      this.emit("finish");
      return;
    } else if (this.ticking) {
      // console.log(this.getFormattedTime());
      this.tickDown();
      return setTimeout(() => {
        this.countdown();
      }, 1000);
    }
  }
}

module.exports = Timer;
