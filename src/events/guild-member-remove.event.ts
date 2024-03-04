import { Events } from 'discord.js';
import { AppEvent } from './event';

export const guildMemberRemove: AppEvent<Events.GuildMemberRemove> = {
  event: Events.GuildMemberRemove,
  once: false,
  execute: async ({ welcomeId }, event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const textChannel = await event.client.channels.fetch(welcomeId);

    if (textChannel?.isTextBased()) {
      await textChannel.send(`<@${event.user.id}> has **${event.guild.name}**, very sadge.`);
    }
  }
};
