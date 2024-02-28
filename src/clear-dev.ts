import { REST, Routes } from 'discord.js';

import dotenv from 'dotenv';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);

try {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  logger.info(`Clearing application (/) commands on guild id: ${guildId}.`);

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });

  logger.info(`Successfully cleared application (/) commands on guild id: ${guildId}.`);
} catch (error) {
  logger.error(error);
}
