class SimpleMessageFormatter {
  constructor(msg, pomodoro) {
    this.maxWorkSessions = pomodoro.maxWorkSessions;
    this.createMessage(msg, pomodoro);
    this.breakTimeAnnouncement = " It's break time!"
    this.workTimeAnnouncement = " It's work time!"
    this.finishAnnouncement = " Work session is over! Hope you had a good time!"
    this.title = "Now: Work Session"; // start in work-state
  }
  createMessage(msg, pomodoro) {
    this.embed = {
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL(),
      },
      title: "Now: Work Session",
      description: `Time left: ${pomodoro.getTimeLeft()}`,
      fields: [
        {
          name: "Work Time Duration",
          value: `${pomodoro.workTime / 60} minutes`,
          inline: true,
        },
        {
          name: "Break Time Duration",
          value: `${pomodoro.breakTime / 60} minutes`,
          inline: true,
        },
        {
          name: "Work Rounds",
          value: `${pomodoro.workRounds}/ ${this.maxWorkSessions}`,
        },
      ],
      footer: {
        text: "Press 👀 if you wish to track this pomodoro",
      },
    };
  }

  updateMessage(pomodoro) {
    const updatefields = {
      title: this.title,
      description: `Time left: ${pomodoro.getTimeLeft()} ${
        pomodoro.isPaused ? " - Paused" : ""
      }`,
      fields: [
        {
          name: "Work Time Duration",
          value: `${pomodoro.workTime / 60} minutes`,
          inline: true,
        },
        {
          name: "Break Time Duration",
          value: `${pomodoro.breakTime / 60} minutes`,
          inline: true,
        },
        {
          name: "Work Rounds",
          value: `${pomodoro.workRounds}/ ${this.maxWorkSessions}`,
        },
      ],
    };
    Object.assign(this.embed, updatefields);
    return this.embed;
  }

  getMessage() {
    //console.log(this.embed)
    return { embed: this.embed };
  }

  changeToWork() {
    this.title = "Now: Work Session";
  }

  changeToBreak() {
    this.title = "Now: Break Session";
  }

  changeToFinish() {
    this.title = "Finished Work Session";
  }
}

module.exports = { SimpleMessageFormatter };
