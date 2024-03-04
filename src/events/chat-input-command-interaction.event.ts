import { commands } from '@/commands';
import { logger } from '@/logger';
import { Events } from 'discord.js';
import { AppEvent } from './event';

export const chatInputCommandInteraction: AppEvent<Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  once: false,
  execute: async (context, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((command) => command.data.name === interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(context, interaction);
    } catch (error) {
      logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};
