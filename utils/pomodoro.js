const { EventEmitter } = require("events");
const Timer = require("./Timer");

const breakState = {
  state: "break",

  startState: (pomodoro) => {
    console.log("Break: Start");
    pomodoro.currentSessionDuration = pomodoro.breakTime;
    pomodoro.resetTimer();
    pomodoro.startTimer();
  },

  goToNextState: (pomodoro) => {
    console.log("Break: Next");
    pomodoro.transitionToState(PomodoroState.WORK_TIME);
  },
};

const workState = {
  state: "work",

  startState: (pomodoro) => {
    console.log("Work: Start");
    pomodoro.currentSessionDuration = pomodoro.workTime;
    pomodoro.resetTimer();
    pomodoro.startTimer();
  },

  goToNextState: (pomodoro) => {
    console.log("Work: Next");
    pomodoro.workRounds += 1;
    pomodoro.workRounds === pomodoro.maxWorkSessions
      ? pomodoro.transitionToState(PomodoroState.FINISH)
      : pomodoro.transitionToState(PomodoroState.BREAK_TIME);
  },
};

const finishedState = {
  state: "finish",
  startState: (pomodoro) => {
    console.log("Finish: Start");
    pomodoro.isFinished = true;
    pomodoro.pause();
    return;
  },

  goToNextState: () => {
    return;
  },
};

const PomodoroState = {
  BREAK_TIME: breakState,
  WORK_TIME: workState,
  FINISH: finishedState,
};

class Pomodoro extends EventEmitter {
  constructor(workTime, breakTime, maxWorkSessions) {
    super();
    this.currentSessionDuration = workTime;
    this.workTime = workTime < 120 * 60 ? workTime : 120 * 60; //  max 2 hours
    this.maxWorkSessions = maxWorkSessions ? maxWorkSessions : 5; //  default 5
    this.breakTime = breakTime < 120 * 60 ? breakTime : 120 * 60; //  max 2 hours

    this.isPaused = false;
    this.isFinished = false;
    this.workRounds = 0;
    this.setupTimer();

    this.state = PomodoroState.WORK_TIME;
  }

  setupTimer() {
    this.timer = new Timer(this.workTime);

    //  Once the timer finishes we go to the next state
    this.timer.on("finish", () => {
      this.goToNextState(this);
    });
  }

  start() {
    this.state.startState(this);
  }

  startTimer() {
    this.timer.start();
  }

  pause() {
    this.isPaused = true;
    this.timer.pause();
  }

  resume() {
    this.isPaused = false;
    this.timer.resume();
  }

  transitionToState(state) {
    this.state = state;
  }

  getTimeLeft() {
    return this.timer.getFormattedTime();
  }

  finish() {
    this.transitionToState(PomodoroState.FINISH);
    this.state.startState(this);
  }

  resetTimer() {
    this.timer.setTime(this.currentSessionDuration);
  }

  goToNextState() {
    this.state.goToNextState(this);
    this.state.startState(this);
    this.emit(this.state.state);
  }
}

module.exports = Pomodoro;
