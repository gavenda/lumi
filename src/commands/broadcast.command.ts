import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
} from 'discord.js';
import { AppCommand } from './command.js';

export const broadcast: AppCommand = {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .addChannelOption(
      new SlashCommandChannelOption()
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName('channel')
        .setDescription('The channel to broadcast the message to.')
        .setRequired(true),
    )
    .addStringOption(
      new SlashCommandStringOption().setName('message').setDescription('The message to send.').setRequired(true),
    )
    .setDescription('Broadcast a message to a specified channel.'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const channel = interaction.options.getChannel<ChannelType.GuildText>('channel', true);
    const message = interaction.options.getString('message', true);

    await channel.send(message);
  },
};
