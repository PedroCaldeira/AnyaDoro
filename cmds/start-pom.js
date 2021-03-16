const Pomodoro = require("../utils/pomodoro");
const { buildPomodoroThread } = require("../utils/pomodoro-handler");
const startPom = (message, arguments) => {
  workTime = +arguments[0] * 60;
  breakTime = +arguments[1] * 60;
  pomodoro = new Pomodoro(workTime, breakTime);
  try {
    buildPomodoroThread(message, pomodoro);
  } catch (error) {}
};

module.exports = {
  commands: "start-pom",
  expectedArgs: " <work time> <break time>",
  permissionError: "You do not have permission to run this command.",
  minArgs: 2,
  maxArgs: 2,
  permissions: [],
  requiredRoles: [],
  callback: startPom,
};
