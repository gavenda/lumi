import { ChannelType, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } from 'discord.js';
import { AppCommand } from './command';
import i18next from 'i18next';

export const broadcast: AppCommand = {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .addChannelOption(
      new SlashCommandChannelOption()
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildCategory,
          ChannelType.GuildForum,
          ChannelType.PrivateThread,
          ChannelType.PublicThread,
          ChannelType.GuildAnnouncement
        )
        .setName('channel')
        .setDescription('The channel to broadcast the message to.')
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption().setName('message').setDescription('The message to send.').setRequired(true)
    )
    .setDescription('Broadcast a message to a specified channel.'),
  execute: async (context, interaction) => {
    const channel = interaction.options.getChannel<ChannelType.GuildText>('channel', true);
    const message = interaction.options.getString('message', true);
    const lng = interaction.locale;

    await channel.send(message);
    await interaction.reply({
      ephemeral: true,
      content: i18next.t('reply.message_sent', { lng })
    });
  }
};
