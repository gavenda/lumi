import { DOTA2_EXEMPT, DOTA2_KEY, DOTA2_WORDS } from '@/keys';
import { logger } from '@/logger';
import { DiscordAPIError, Events, Message } from 'discord.js';
import { AppEvent } from './event';

export const messageCreateDota: AppEvent<Events.MessageCreate> = {
  event: Events.MessageCreate,
  once: false,
  execute: async ({ redis }, message) => {
    const channel = message.channel;
    const member = message.member;

    if (!member) return;
    if (member.user.bot) return;
    if (!channel.isTextBased()) return;

    const userId = member.id;
    const dota2Exempt = `${DOTA2_EXEMPT}:${userId}`;
    const dota2UserKey = `${DOTA2_KEY}:${userId}`;
    const dota2Words = await redis.sMembers(DOTA2_WORDS);
    const isDota = dota2Words.some((word) => message.cleanContent.toLowerCase().includes(word));
    const exempt = Boolean(await redis.get(dota2Exempt));
    const count = Number(await redis.get(dota2UserKey));

    if (isDota) {
      await redis.incr(dota2UserKey);
      await redis.del(dota2Exempt);
    }

    if (exempt) return;

    let botMessage: Message | undefined;

    try {
      if (count && count > 0 && count % 10 === 0) {
        if (count === 10) {
          botMessage = await channel.send(
            `<@${userId}> has mentioned \`Dota\` at least \`10\` times and has been timed out for a minute.`
          );
          await member.timeout(60 * 1000, 'Mentioned dota at least 10 times');
        } else {
          botMessage = await channel.send(
            `<@${userId}> has mentioned \`Dota\` for another \`10\` times, totaling \`${count}\` and has been timed out for a minute.`
          );
          await member.timeout(60 * 1000, 'Mentioned dota for another 10 times');
        }

        logger.info(`Timing out user id: ${userId}, name: ${member.displayName} for dota2 message content`);
      }
    } catch (error) {
      if (error instanceof DiscordAPIError) {
        if (error.code === 50013 && botMessage !== undefined) {
          await botMessage.reply(`It seems that <@${userId}> is too powerful and cannot be timed out.`);
          await redis.set(dota2Exempt, 'true');
        }
      } else {
        logger.error(error);
      }
    }
  }
};
