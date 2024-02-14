import { REST, Routes } from 'discord.js';
import { commands } from './commands.js';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);

try {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  const commandList = commands.map((command) => command.data.toJSON());

  console.log(`Started refreshing ${commandList.length} application (/) commands.`);

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandList });

  console.log(`Successfully reloaded application (/) commands.`);
} catch (error) {
  console.error(error);
}
