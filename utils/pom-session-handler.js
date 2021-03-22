const { Message } = require("discord.js");
const Pomodoro = require("./pomodoro");

const pomodoroReactionsFilter = (reaction, user) => {
  return !user.bot && reaction.emoji.name !== "👀"; //  special reaction which doesn't need immediate action
};
class PomodoroSessionHandler {
  constructor(
    config,
    creatorMessage,
    messageFormatter,
    availableCommands,
    commandsCallbacks
  ) {
    this.createNewPomodoro(config);
    this.creatorMessage = creatorMessage;
    this.createNewMessageFormatter(messageFormatter);

    this.setupCommands(availableCommands, commandsCallbacks);
    this.setupPomodoroListeners();
    this.setupMainMessageThread();

    this.pomodoro.start();
  }

  setupCommands(availableCommands, commandsCallbacks) {
    this.availableCommands = availableCommands;
    this.commandsCallbacks = commandsCallbacks;
  }

  createNewMessageFormatter(messageFormatter) {
    this.messageFormatter = new messageFormatter(
      this.creatorMessage,
      this.pomodoro
    );
  }

  createNewPomodoro(config) {
    this.pomodoro = new Pomodoro(
      config.workTime,
      config.breakTime,
      config.workSessions
    );
  }

  setupPomodoroListeners() {
    this.pomodoro.on("break", () => {
      this.breakHandler();
    });

    this.pomodoro.on("work", () => {
      this.workHandler();
    });

    this.pomodoro.on("finish", () => {
      this.finishCommandHandler();
    });
  }

  async setupMainMessageThread() {
    try {
      this.pomodoroThread = await this.creatorMessage.reply(
        this.messageFormatter.getMessage()
      );
      this.updateCycle();
      this.addReaction(this.availableCommands);
      this.setupControlsHook();
    } catch (error) {
      console.log(error);
    }
  }

  workHandler() {
    console.log(`<${this.pomodoroThread.id}> State changed to Work`);
    this.messageFormatter.changeToWork(this.pomodoro.workRounds);
    this.updateThread();
    this.announceUpdate(this.messageFormatter.workTimeAnnouncement);
  }

  breakHandler() {
    console.log(`<${this.pomodoroThread.id}> State changed to Break`);
    this.messageFormatter.changeToBreak();
    this.updateThread();
    this.announceUpdate(this.messageFormatter.breakTimeAnnouncement);
  }

  pauseCommandHandler() {
    this.pomodoro.pause();
    this.pomodoroThread.react("▶️");
    this.availableCommands = this.availableCommands.filter(
      (command) => command !== "⏸️"
    );
    this.availableCommands.push("▶️");
  }

  finishCommandHandler() {
    console.log(`<${this.pomodoroThread.id}> Pomodoro Finished`);
    this.pomodoro.finish();
    this.messageFormatter.changeToFinish();
    this.announceUpdate(this.messageFormatter.finishAnnouncement);
    this.pomodoroThread.reactions.removeAll();
    this.updateThread();
  }

  resumeCommandHandler() {
    this.pomodoro.resume();
    this.pomodoroThread.react("⏸️");
    this.availableCommands = this.availableCommands.filter(
      (command) => command !== "▶️"
    );
    this.availableCommands.push("⏸️");
  }

  updateCycle() {
    this.updateThread();
    if (!this.pomodoro.isPaused && !this.pomodoro.isFinished) {
      setTimeout(() => {
        this.updateCycle();
      }, 5000);
    }
  }

  addReaction(reaction) {
    if (reaction.length) {
      this.pomodoroThread
        .react(reaction[0])
        .then(this.addReaction(reaction.slice(1)));
    }
  }

  announceUpdate(message) {
    `<${this.pomodoroThread.id}> Updating Watchers`;
    this.getWatchers().then((watchers) => {
      if (this.announcementsThread) this.announcementsThread.delete();
      this.pomodoroThread
        .reply(`${watchers}${message}`)
        .then((reply) => (this.announcementsThread = reply));
    });
  }

  async getWatchers() {
    return await this.pomodoroThread.reactions
      .resolve("👀")
      .users.fetch()
      .then((users) => {
        return users.filter((user) => !user.bot).map((user) => user.toString());
      });
  }

  updateThread() {
    console.log(`<${this.pomodoroThread.id}> Updating Thread`);
    this.messageFormatter.updateMessage(this.pomodoro);
    try {
      this.pomodoroThread.edit(this.messageFormatter.getMessage());
    } catch (error) {
      console.log(error);
    }
  }

  setupControlsHook() {
    this.pomodoroThread
      .awaitReactions(pomodoroReactionsFilter, { max: 1 }) // 👀 is a special case and not captured in this call
      .then((collected) => {
        if (!this.pomodoro.isFinished) {
          const reaction = collected.first();
          const command = reaction.emoji.name;
          this.pomodoroThread.reactions.resolve(reaction).remove();

          //is reaction an available command?
          if (this.availableCommands.includes(command)) {
            this.commandsCallbacks[command](this);
          }
          this.setupControlsHook();
          this.updateThread();
        }
      })
      .catch((collected) => {
        console.log(collected);
      });
  }
}

module.exports = { PomodoroThreadHandler: PomodoroSessionHandler };
