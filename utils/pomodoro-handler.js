const { MessageEmbed } = require("discord.js");

const pomodoroThreads = {};
const createPomodoroEmbed = (pomodoro) => {
  const embed = new MessageEmbed() // Set the title of the embed
    .setTitle(pomodoro.getTitle())
    // Set the color of the embed
    .setColor(0xcaf7e3)
    // Set the main content of the embed
    .setDescription(pomodoro.getDescription())
    .addField("Work Rounds", pomodoro.workRounds);
  // Send the embed to the same channel as the message
  return embed;
};

const updateThread = (pomThread, pomodoro) => {
  pomThread.edit(createPomodoroEmbed(pomodoro));
  if (!pomodoro.isFinished) {
    setTimeout(() => {
      updateThread(pomThread, pomodoro);
    }, 5000);
  }
};

module.exports.buildPomodoroThread = (msg, pomodoro) => {
  msg
    .reply(createPomodoroEmbed(pomodoro))
    .then((pomThread) => updateThread(pomThread, pomodoro));
};
