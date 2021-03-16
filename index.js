require("dotenv").config();
const fs = require("fs");
const path = require("path");
const DiscordJS = require("discord.js");

const client = new DiscordJS.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  /**
   * Code from Worn-off-Keys Episode #22 discord.js series
   * Source: https://github.com/AlexzanderFlores/Worn-Off-Keys-Discord-Js/blob/master/22-Advanced-Command-Handler/commands/command-base.js
   * Video: https://www.youtube.com/watch?v=lbpUc17InkM&list=PLaxxQQak6D_fxb9_-YsmRwxfw5PH9xALe&index=25
   */

  const baseFile = "command-base.js";
  const commandBase = require(`./cmds/${baseFile}`);

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        commandBase(client, option);
      }
    }
  };

  readCommands("cmds");
});

client.login(process.env.BOT_TOKEN);
