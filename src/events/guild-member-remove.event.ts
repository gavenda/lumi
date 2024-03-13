import { EmbedBuilder, Events } from 'discord.js';
import { AppEvent } from './event';
import i18next from 'i18next';

export const guildMemberRemove: AppEvent<Events.GuildMemberRemove> = {
  event: Events.GuildMemberRemove,
  once: false,
  execute: async ({ welcomeId }, event) => {
    const textChannel = await event.client.channels.fetch(welcomeId);

    if (!textChannel?.isTextBased()) return;

    const lng = event.guild.preferredLocale;
    const server = event.guild.name;
    const userId = event.user.id;

    const embed = new EmbedBuilder()
      .setTitle(i18next.t('leave.title', { lng }))
      .setDescription(i18next.t(`leave.message`, { lng, server, userId }))
      .setColor(0xffbb00);

    await textChannel.send({
      embeds: [embed]
    });
  }
};
