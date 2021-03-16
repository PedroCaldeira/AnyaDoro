const PomodoroState = {
  BREAK_TIME: "Break",
  WORK_TIME: "Work",
};
class Pomodoro {
  constructor(workTime, breakTime) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.timeLeft = workTime + 1;
    this.state = PomodoroState.WORK_TIME;
    this.isPaused = false;
    this.isFinished = false;
    this.workRounds = 0;
    this.countdown();
  }

  decreaseTimeLeft(seconds) {
    this.timeLeft -= seconds;
  }

  getTimeLeftText() {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;

    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    let result = hoursStr + ":" + minutesStr + ":" + secondsStr;
    if (hours === 0) result = result.slice(3);
    return result;
  }
  pause() {
    this.isPaused = true;
  }

  unpause() {
    this.isPaused = false;
  }

  finish() {
    this.finish = true;
  }

  nextState() {
    if (this.state === PomodoroState.WORK_TIME) {
      this.workRounds += 1;
      this.state = PomodoroState.BREAK_TIME;
      this.timeLeft = this.breakTime;
    } else if (this.state === PomodoroState.BREAK_TIME) {
      this.state = PomodoroState.WORK_TIME;
      this.timeLeft = this.workTime;
    }
  }

  countdown() {
    if (this.timeLeft <= 0) {
      this.nextState();
    }
    if (!this.isFinished && !this.isPaused) {
      this.timeLeft -= 1;
      setTimeout(() => {
        this.countdown();
      }, 1000);
    }
  }

  getTitle() {
    return this.state === PomodoroState.WORK_TIME
      ? "Study Session"
      : "Break Time";
  }
  getDescription() {
    return `Time left: ${this.getTimeLeftText()}`;
  }
}

module.exports = Pomodoro;
