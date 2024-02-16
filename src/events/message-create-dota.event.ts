import { DiscordAPIError, Events, Message } from 'discord.js';
import { AppEvent } from './event.js';
import { redis } from '../redis.js';
import { logger } from '../logger.js';

export const messageCreateDota: AppEvent<Events.MessageCreate> = {
  event: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    const channel = message.channel;
    const member = message.member;
    const userId = member.id;

    if (!channel.isTextBased()) return;

    const dota2Key = `dota2:${userId}`;

    if (message.cleanContent.toLowerCase().includes('dota')) {
      await redis.incr(dota2Key);
    }

    const count = Number(await redis.get(dota2Key));
    let botMessage: Message;

    try {
      if (count && count > 0 && count % 10 === 0) {
        if (count === 10) {
          botMessage = await channel.send(
            `<@${userId}> has mentioned \`Dota\` at least \`10\` times and has been timed out for a minute.`,
          );
          await member.timeout(60 * 1000, 'Mentioned dota at least 10 times');
        } else {
          botMessage = await channel.send(
            `<@${userId}> has mentioned \`Dota\` for another \`10\` times, totaling \`${count}\` and has been timed out for a minute.`,
          );
          await member.timeout(60 * 1000, 'Mentioned dota for another 10 times');
        }

        logger.info(`Timing out user id: ${userId}, name: ${member.displayName} for dota2 message content`);
      }
    } catch (error) {
      if (error instanceof DiscordAPIError) {
        if (error.code === 50013) {
          await botMessage.reply(`It seems that <@${userId}> is too powerful and cannot be timed out.`);
        }
      } else {
        logger.error(error);
      }
    }
  },
};
