import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export interface AppCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
