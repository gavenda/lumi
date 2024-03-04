import { Events } from 'discord.js';
import { AppEvent } from './event.js';

export const guildMemberRemove: AppEvent<Events.GuildMemberRemove> = {
  event: Events.GuildMemberRemove,
  once: false,
  execute: async (event) => {
    if (!process.env.WELCOME_ID) {
      throw new Error('Unable to send message, WELCOME_ID is missing.');
    }

    const textChannel = await event.client.channels.fetch(process.env.WELCOME_ID);

    if (textChannel?.isTextBased()) {
      await textChannel.send(`<@${event.user.id}> has **${event.guild.name}**, very sadge.`);
    }
  }
};
