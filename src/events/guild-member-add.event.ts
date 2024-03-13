import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } from 'discord.js';
import { AppEvent } from './event';
import i18next from 'i18next';

export const guildMemberAdd: AppEvent<Events.GuildMemberAdd> = {
  event: Events.GuildMemberAdd,
  once: false,
  execute: async ({ welcomeId }, event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const textChannel = await event.client.channels.fetch(welcomeId);

    if (!textChannel?.isTextBased()) return;

    const randomIndex = Math.floor(Math.random() * 10) + 1;
    const lng = event.guild.preferredLocale;
    const server = event.guild.name;
    const userId = event.user.id;

    const embed = new EmbedBuilder()
      .setTitle(i18next.t('welcome.title', { lng }))
      .setDescription(i18next.t(`welcome.${randomIndex}`, { lng, server, userId }))
      .setColor(0xffbb00);

    const boardersButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setEmoji(`🏠`)
      .setCustomId(`role:554377745078026241:${userId}`)
      .setLabel('Boarders');
    const bogusButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setEmoji(`⏲️`)
      .setCustomId(`role:374164766010245121:${userId}`)
      .setLabel('Bogus');
    const basurantButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`role:969526513395453962:${userId}`)
      .setLabel('Basurant');
    const dotaButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`role:840589105422270485:${userId}`)
      .setLabel('Dota');

    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    actionRow.addComponents(boardersButton, bogusButton, basurantButton, dotaButton);

    await textChannel.send({
      embeds: [embed],
      components: [actionRow]
    });
  }
};
