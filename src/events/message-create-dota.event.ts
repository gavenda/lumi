import { Events } from 'discord.js';
import { AppEvent } from './event.js';
import { redis } from '../redis.js';

export const messageCreateDota: AppEvent<Events.MessageCreate> = {
  event: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    if (!message.channel.isTextBased()) return;

    const userId = message.member.id;
    const dota2Key = `dota2:${userId}`;

    if (message.cleanContent.toLowerCase().includes('dota')) {
      await redis.incr(dota2Key);
    }
    const count = Number(await redis.get(dota2Key));

    if (count > 0 && count % 10 === 0) {
      if (count === 10) {
        await message.channel.send(
          `<@${message.member.id}> has mentioned \`Dota\` at least \`10\` times and has been timed out for a minute.`,
        );
        await message.member.timeout(60 * 1000, 'Mentioned dota at least 10 times');
      } else {
        await message.channel.send(
          `<@${message.member.id}> has mentioned \`Dota\` for another \`10\` times, totaling \`${count}\` and has been timed out for a minute.`,
        );
        await message.member.timeout(60 * 1000, 'Mentioned dota for another 10 times');
      }
    }
  },
};
