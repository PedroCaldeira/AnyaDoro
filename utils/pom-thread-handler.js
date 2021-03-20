const Pomodoro = require("./pomodoro");

class PomodoroThreadHandler {
  constructor(workDuration, breakDuration, creatorMessage) {
    this.mainMsg;
    this.notificationMsg;
    this.setupPomodoro();
    this.creator = msg.author;
  }
  changeToBreak() {
    return;
  }
  setupPomodoro() {
    this.pomodoro = new Pomodoro(workDuration, breakDuration);
    this.pomodoro.on("finish", () => {
      this.finish();
    });
    this.pomodoro.on("work", () => {
      this.changeToWork();
    });
    this.pomodoro.on("break", () => {
      this.changeToBreak();
    });
  }
}
