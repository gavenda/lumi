import { REST, Routes } from 'discord.js';

import dotenv from 'dotenv';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);

try {
  const clientId = process.env.CLIENT_ID;

  logger.info(`Clearing application (/) commands.`);

  await rest.put(Routes.applicationCommands(clientId), { body: [] });

  logger.info(`Successfully cleared application (/) commands.`);
} catch (error) {
  logger.error(error);
}
