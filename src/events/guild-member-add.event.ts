import { Events } from 'discord.js';
import { AppEvent } from './event';

export const guildMemberAdd: AppEvent<Events.GuildMemberAdd> = {
  event: Events.GuildMemberAdd,
  once: false,
  execute: async ({ welcomeId }, event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const textChannel = await event.client.channels.fetch(welcomeId);

    if (textChannel?.isTextBased()) {
      await textChannel.send(`Welcome <@${event.user.id}> to **${event.guild.name}**!`);
    }
  }
};
