import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { redis } from '../redis.js';
import { AppCommand } from './command.js';

export const dota: AppCommand = {
  data: new SlashCommandBuilder()
    .setName('dota')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('user')
        .setDescription('The user who keeps calling for Dota.')
        .setRequired(true),
    )
    .setDescription('Check the number of times the user has mentioned or called for Dota.'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser('user');

    if (user.id === interaction.client.user.id) {
      interaction.reply(`Accusing me for dota? You are getting timed out.`);
      const member = interaction.guild.members.resolve(interaction.user.id);
      await member.timeout(5 * 60 * 1000, `MEME: Mentioning me for dota`);
      return;
    }
    if (user.bot) {
      interaction.reply(`The user you are mentioning is a bot, not worth your time.`);
      return;
    }

    const userId = user.id;
    const count = await redis.get(`dota2:${userId}`);

    if (count) {
      interaction.reply(`The offender, <@${userId}> has mentioned or called for \`Dota\` around \`${count}\` times.`);
    } else {
      interaction.reply(`Congratulations! <@${userId}> has not called for \`Dota\` at all.`);
    }
  },
};
