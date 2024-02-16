import { Events } from 'discord.js';
import { AppEvent } from './event.js';

export const guildMemberAdd: AppEvent<Events.GuildMemberAdd> = {
  event: Events.GuildMemberAdd,
  once: false,
  execute: async (event) => {
    const textChannel = await event.client.channels.resolve(process.env.WELCOME_ID).fetch();

    if (textChannel.isTextBased()) {
      textChannel.send(`Welcome <@${event.user.id}> to **${event.guild.name}**!`);
    }
  },
};
