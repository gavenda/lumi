import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';

import dotenv from 'dotenv';
import { commands } from './commands.js';
import { redis } from './redis.js';
import { logger } from './logger.js';
import { events } from './events.js';
import { exit } from 'node:process';
import { DOTA2_WORDS } from './keys.js';

// Load environment variables
dotenv.config();

// Create discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`);

  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'Kingdom of Palettia', type: ActivityType.Watching }],
  });
});

// Slash command interaction event
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

// Register events
for (const { event, execute } of events) {
  client.on(event, execute);
}

try {
  // Connect to redis
  await redis.connect();

  // Add dota keywords
  await redis.sAdd(DOTA2_WORDS, 'dota');

  // Now ready to login to gateway
  await client.login(process.env.TOKEN);
} catch (error) {
  logger.error(error);
  exit(1);
}
