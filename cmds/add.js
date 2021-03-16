module.exports = {
  commands: "add",
  expectedArgs: " <number> <number",
  permissionError: "You do not have permission to run this command.",
  minArgs: 2,
  maxArgs: 2,
  permissions: [],
  requiredRoles: [],
  callback: (message, arguments, _, client) => {
    console.log(client);
    const number1 = +arguments[0];
    const number2 = +arguments[1];
    if (isNaN(number1) || isNaN(number2)) {
      message.reply(
        "one or more arguments were not numbers. I only know how to add numbers."
      );
    } else {
      message.reply(`The result is ${number1 + number2}`);
    }
  },
};
