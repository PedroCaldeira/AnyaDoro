require("dotenv").config();
const { Client, MessageEmbed, Message } = require("discord.js");
const client = new Client();


const pomMsgIds = [];
const MESSAGE_UPDATE_FREQUENCY = 5; // in seconds
const POMODORO_SESSION_TIME = 25; // in minutes

let pomodoroMsg = null;
let pomodoroStopped = false;


// ready check for the bot to receive commands
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


const getEmbed = (msgText) => {
  const embed = new MessageEmbed()
    // Set the title of the embed
    .setTitle("Study Session")
    // Set the color of the embed
    .setColor(0xcaf7e3)
    // Set the main content of the embed
    .setDescription(msgText);
  // Send the embed to the same channel as the message
  return embed;
};

/**
 *
 * @param {number} secondsLeft
 * @returns 
 */
const pomodoroUpdate = (secondsLeft) => {
  if (pomodoroStopped) return;
  else if (secondsLeft < 0)
    pomodoroMsg.edit(getEmbed("Times up! Well done! Take a break! :D"));
  else {
    pomodoroMsg.edit(getEmbed(`Time left: ${new Date(1000 * secondsLeft).toISOString().substr(11, 8)}`));
    secondsLeft -= MESSAGE_UPDATE_FREQUENCY;

    setTimeout(() => {
      pomodoroUpdate(secondsLeft);
    }, MESSAGE_UPDATE_FREQUENCY * 1000);
  }
};


/**
 *
 * @param {Message} msg Original Message from the sender
 * @param {number} timer Minutes for the pomodoro session
 */
const startPomodoro = async (msg, seconds) => {
  pomodoroStopped = false;
  pomodoroMsg = await msg.reply(
    getEmbed(
      `Time left: ${new Date(1000 * seconds).toISOString().substr(11, 8)}`
    )
  );
  return msg.id
};

const stopPomodoro = () => {
  if (!pomodoroStopped) {
    pomodoroStopped = true;
    pomodoroMsg.edit(getEmbed("Pomodoro Stopped"));
  }
};

// Bot Commands
client.on("message", (msg) => {
  switch (msg.content) {
    case "!start":
      pomodoroId = startPomodoro(msg, POMODORO_SESSION_TIME * 60);
      pomMsgIds.push(pomodoroId)
      break;
    case "!stop":
      stopPomodoro();
      break;
  }
});

client.login(process.env.BOT_TOKEN);
