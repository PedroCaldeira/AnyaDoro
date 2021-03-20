module.exports = {
  commands: "help",
  permissionError: "You do not have permission to run this command.",
  minArgs: 0,
  maxArgs: 0,
  permissions: [],
  requiredRoles: [],
  callback: (msg) => {
    msg.reply(
      "to start a pomodoro session type: ```!start-pom <work time in minutes> <break time in minutes>``` If you wish the be reminded of everytime we have a break or need to get back to work react with 👀"
    );
  },
};
