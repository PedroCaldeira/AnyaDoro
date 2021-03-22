const Pomodoro = require("../utils/pomodoro");
const { MessageEmbed } = require("discord.js");
const { PomodoroThreadHandler } = require("../utils/pom-session-handler");
const { SimpleMessageFormatter } = require("../utils/pom-simple-msg-formatter");

const reactionAvailableCommands = ["👀", "❌", "⏸️"];
const commandsCallbacks = {
  "❌": (pomodoroHandler) => {
    console.log("Reacted with ❌");
    pomodoroHandler.finishCommandHandler();
  },
  "⏸️": (pomodoroHandler) => {
    console.log("Reacted with ⏸️");
    pomodoroHandler.pauseCommandHandler();
  },
  "▶️": (pomodoroHandler) => {
    console.log("Reacted with ▶️");
    pomodoroHandler.resumeCommandHandler();
  },
};

const createNewPomodoroSession = (message, arguments, client) => {
  config = {
    workTime: +arguments[0] * 60,
    breakTime: +arguments[1] * 60,
    workSessions: +arguments[2],
  };
  if (config.workTime <= 0 || config.breakTime <= 0) {
    message.reply("the work/break session duration times must be positive.");
    return;
  }
  try {
    new PomodoroThreadHandler(
      config,
      message,
      SimpleMessageFormatter,
      reactionAvailableCommands,
      commandsCallbacks
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  commands: "start-pom-dev",
  expectedArgs: " <work time> <break time> <work sessions (default:5)>",
  permissionError: "You do not have permission to run this command.",
  minArgs: 2,
  maxArgs: 3,
  permissions: [],
  requiredRoles: [],
  callback: createNewPomodoroSession,
};
