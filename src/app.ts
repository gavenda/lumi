import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';

import dotenv from 'dotenv';
import { commands } from './commands.js';
import { redis } from './redis.js';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`);

  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'The Most Beautiful Witch: Elaina', type: ActivityType.Watching }],
  });
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.channel.isTextBased()) return;

  const userId = message.member.id;
  const dota2Key = `dota2:${userId}`;

  if (message.cleanContent.toLowerCase().includes('dota')) {
    await redis.incr(dota2Key);
  }
  const count = Number(await redis.get(dota2Key));

  if (count % 10 === 0) {
    if (count === 10) {
      await message.channel.send(
        `<@${message.member.id}> has mentioned \`Dota\` at least \`10\` times and has been timed out for a minute.`,
      );
      await message.member.timeout(60 * 1000, 'Mentioned dota at least 10 times');
    } else {
      await message.channel.send(
        `<@${message.member.id}> has mentioned \`Dota\` for another \`10\` times, totaling \`${count}\` and has been timed out for a minute.`,
      );
      await message.member.timeout(60 * 1000, 'Mentioned dota for another 10 times');
    }
  }
});

client.on(Events.GuildMemberRemove, async (event) => {
  const textChannel = await client.channels.resolve(process.env.WELCOME_ID).fetch();

  if (textChannel.isTextBased()) {
    textChannel.send(`<@${event.user.id}> has **${event.guild.name}**, very sadge.`);
  }
});

client.on(Events.GuildMemberAdd, async (event) => {
  const textChannel = await client.channels.resolve(process.env.WELCOME_ID).fetch();

  if (textChannel.isTextBased()) {
    textChannel.send(`Welcome <@${event.user.id}> to **${event.guild.name}**!`);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find((command) => command.data.name === interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

await redis.connect();
await client.login(process.env.TOKEN);
