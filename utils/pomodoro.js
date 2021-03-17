const PomodoroState = {
  BREAK_TIME: "Break",
  WORK_TIME: "Work",
};
class Pomodoro {
  constructor(workTime, breakTime, msg) {
    this.creator = msg.author;
    this.workTime = workTime < 120 * 60 ? workTime : 120 * 60;
    this.breakTime = breakTime < 120 * 60 ? breakTime : 120 * 60;
    this.timeLeft = workTime + 1;
    this.state = PomodoroState.WORK_TIME;
    this.isPaused = false;
    this.isFinished = false;
    this.workRounds = 0;
    this.countdown();
    this.areUsersUpdated = true;
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
    if (this.isPaused) {
      this.isPaused = false;
      this.countdown();
    }
  }

  finish() {
    this.isFinished = true;
  }

  nextState() {
    if (this.workRounds === 10) this.isFinished = true;
    if (this.state === PomodoroState.WORK_TIME) {
      this.workRounds += 1;
      this.state = PomodoroState.BREAK_TIME;
      this.timeLeft = this.breakTime;
      this.areUsersUpdated = false;
    } else if (this.state === PomodoroState.BREAK_TIME) {
      this.state = PomodoroState.WORK_TIME;
      this.timeLeft = this.workTime;
      this.areUsersUpdated = false;
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
  getCreatorUsername() {
    return this.creator.username;
  }
  getCreatorAvatarUrl() {
    return this.creator.avatarURL();
  }

  getStateMsg(users) {
    if (this.isFinished){
        return users + " hope you got good work done with this session! Bye!"
    }
    if (this.state === PomodoroState.WORK_TIME) {
      return users + " It's time to get back to Work!";
    } else if (this.state === PomodoroState.BREAK_TIME) {
      return users + " It's time for the deserved Break!";
    }
  }
  getTitle() {
    return this.state === PomodoroState.WORK_TIME
      ? "Study Session"
      : "Break Time";
  }
  getDescription() {
    return `Time left: ${this.getTimeLeftText()} ${
      this.isFinished ? "- Stopped!" : this.isPaused ? "- Paused" : ""
    }`;
  }
}

module.exports = Pomodoro;
