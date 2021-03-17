const Pomodoro = require("../utils/pomodoro");
const { MessageEmbed } = require("discord.js");

const pomodoroReactions = ["👀", "❌", "⏸️"];

const pomodoroReactionsFilter = (reaction, user) => {
  return !user.bot && reaction.emoji.name !== "👀";
};

const addReaction = (msg, reaction) => {
  if (reaction.length) {
    msg.react(reaction[0]).then(addReaction(msg, reaction.slice(1)));
  }
};

const createCommandsReactionHook = (msg, pomodoro) => {
  msg
    .awaitReactions(pomodoroReactionsFilter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first();
      //console.log(reaction)
      switch (reaction.emoji.name) {
        case "❌":
          pomodoro.finish();
          updateThread(msg, pomodoro);
          break;
        case "⏸️":
          msg.reactions.resolve(reaction.emoji.name).remove();
          createCommandsReactionHook(msg, pomodoro);
          pomodoro.pause();
          updateThread(msg, pomodoro);
          msg.react("▶️");
          break;
        case "▶️":
          createCommandsReactionHook(msg, pomodoro);
          pomodoro.unpause();
          updateThread(msg, pomodoro);
          msg.reactions.resolve(reaction.emoji.name).remove();
          msg.react("⏸️");
          break;
        default:
          try {
            msg.reactions.resolve(reaction.emoji.id).remove();
          } catch (error) {
            console.log(error);
          }
      }
    })
    .catch((collected) => {
      console.log(collected);
    });
};

const createPomodoroEmbed = (msg, pomodoro) => {
  const embed = new MessageEmbed()
    .setTitle(pomodoro.getTitle())
    .setColor(0xcaf7e3)
    .setAuthor(pomodoro.getCreatorUsername(), pomodoro.getCreatorAvatarUrl())
    .setDescription(pomodoro.getDescription())
    .addField("Work Rounds", pomodoro.workRounds, true);
  return embed;
};

const updateThread = async (pomThread, pomodoro, updateMessage) => {
  if (!pomodoro.areUsersUpdated) {
    if (updateMessage) {
      updateMessage.delete();
    }
    const emojiReaction = pomThread.reactions.resolve("👀");
    updateMessage = await emojiReaction.users.fetch().then((users) => {
      const filteredUsers = users
        .filter((user) => !user.bot)
        .map((user) => user.toString());
      pomodoro.areUsersUpdated = true;
      if (filteredUsers.length) {
        return pomThread.channel.send(
          pomodoro.getStateMsg(`${filteredUsers.join(" ")}`)
        );
      } else {
        pomodoro.finish();
      }
    });
  }
  pomThread.edit("New Pomodoro!", {
    embed: createPomodoroEmbed(pomThread, pomodoro),
  });
  if (!pomodoro.isFinished && !pomodoro.isPaused) {
    setTimeout(() => {
      updateThread(pomThread, pomodoro, updateMessage);
    }, 5000);
  }
};

const buildPomodoroThread = (msg, workTime) => {
  pomodoro = new Pomodoro(workTime, breakTime, msg);
  msg.reply(createPomodoroEmbed(msg, pomodoro)).then((pomThread) => {
    updateThread(pomThread, pomodoro);
    addReaction(pomThread, pomodoroReactions);
    createCommandsReactionHook(pomThread, pomodoro);
  });
};

module.exports = {
  commands: "start-pom",
  expectedArgs: " <work time> <break time>",
  permissionError: "You do not have permission to run this command.",
  minArgs: 2,
  maxArgs: 2,
  permissions: [],
  requiredRoles: [],
  callback: (message, arguments, client) => {
    workTime = +arguments[0] * 60;
    breakTime = +arguments[1] * 60;
    try {
      buildPomodoroThread(message, workTime, breakTime);
    } catch (error) {
      console.log(error);
    }
    client.on("messageReactionAdd", async (reaction, user) => {
      // When we receive a reaction we check if the reaction is partial or not
      if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
          await reaction.fetch();
        } catch (error) {
          console.error(
            "Something went wrong when fetching the message: ",
            error
          );
          // Return as `reaction.message.author` may be undefined/null
          return;
        }
      }
    });
  },
};
