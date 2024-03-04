import { AppContext } from '@/app.context';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export interface AppCommand {
  data: SlashCommandBuilder;
  execute: (context: AppContext, interaction: ChatInputCommandInteraction) => Promise<void>;
}
