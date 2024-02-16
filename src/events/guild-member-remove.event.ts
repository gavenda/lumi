import { Events } from 'discord.js';
import { AppEvent } from './event.js';

export const guildMemberRemove: AppEvent<Events.GuildMemberRemove> = {
  event: Events.GuildMemberRemove,
  once: false,
  execute: async (event) => {
    const textChannel = await event.client.channels.resolve(process.env.WELCOME_ID).fetch();

    if (textChannel.isTextBased()) {
      textChannel.send(`<@${event.user.id}> has **${event.guild.name}**, very sadge.`);
    }
  },
};
