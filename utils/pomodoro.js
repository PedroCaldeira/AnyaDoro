const { EventEmitter } = require("events");
const Timer = require("./Timer");

const PomodoroState = {
  BREAK_TIME: "break",
  WORK_TIME: "work",
  FINISHED: "finished",
};

class Pomodoro extends EventEmitter {
  constructor(workTime, breakTime, msg,maxWorkSessions) {
    super();
    this.currentSessionDuration = workTime;
    this.workTime = workTime < 120 * 60 ? workTime : 120 * 60;
    this.maxWorkSessions = maxWorkSessions ? maxWorkSessions : 20;
    this.breakTime = breakTime < 120 * 60 ? breakTime : 120 * 60;
    this.state = PomodoroState.WORK_TIME;
    this.setupTimer();
    this.isPaused = false;
    this.isFinished = false;
    this.workRounds = 0;
    this.areUsersUpdated = true;
    this.creator = msg.author;
  }

  setupTimer() {
    this.timer = new Timer(this.workTime);
    this.timer.start();

    //  Once the timer finishes we go to the next state
    this.timer.on("finish", () => {
      this.goToNextState();
    });
  }

  pause() {
    isPaused = true;
    this.timer.pause();
  }

  getTimeLeftText() {
    return this.timer.getFormattedTime();
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.timer.resume();
    }
  }

  finish() {
    this.isFinished = true;
  }

  resetTimer() {
    this.timer.setTime(this.currentSessionDuration);
    this.timer.start();
  }

  goToBreakState() {
    this.state = PomodoroState.BREAK_TIME;
    this.currentSessionDuration = this.breakTime;
    this.resetTimer();
    this.emit(PomodoroState.BREAK_TIME);
  }

  goToWorkState() {
    this.state = PomodoroState.WORK_TIME;
    this.currentSessionDuration = this.workTime;
    this.resetTimer();
    this.emit(PomodoroState.WORK_TIME);
  }

  goToFinishedState() {
    this.state = PomodoroState.FINISHED;
    this.emit(PomodoroState.FINISHED);
  }

  goToNextState() {
    if (this.workRounds === this.maxWorkSessions) {
      this.workRounds += 1;
      this.goToFinishedState();
    } else if (this.state === PomodoroState.WORK_TIME) {
      this.workRounds += 1;
      this.goToBreakState();
      this.areUsersUpdated = false;
    } else if (this.state === PomodoroState.BREAK_TIME) {
      this.areUsersUpdated = false;
      this.goToWorkState();
    }
  }

  getCreatorUsername() {
    return this.creator.username;
  }
  getCreatorAvatarUrl() {
    return this.creator.avatarURL();
  }

  getStateMsg(users) {
    if (this.isFinished) {
      return users + " hope you got good work done with this session! Bye!";
    }
    if (this.state === PomodoroState.WORK_TIME) {
      return users + " It's time to get back to Work!";
    } else if (this.state === PomodoroState.BREAK_TIME) {
      return users + " It's time for the deserved Break!";
    }
  }
  getTitle() {
    return this.state === PomodoroState.WORK_TIME
      ? "Now: Work Session"
      : "Now: Break Time";
  }
  getDescription() {
    return `Time left: ${this.getTimeLeftText()} ${
      this.isFinished ? "- Stopped!" : this.isPaused ? "- Paused" : ""
    }`;
  }
}

module.exports = Pomodoro;
