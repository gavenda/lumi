import { CommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { AppCommand } from './command.js';
import { redis } from '../redis.js';

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
  execute: async (interaction: CommandInteraction) => {
    const userId = interaction.options.getUser('user').id;
    const count = await redis.get(`dota2:${userId}`);

    if (count) {
      interaction.reply(`The offender, <@${userId}> has mentioned or called for \`Dota\` around \`${count}\` times.`);
    } else {
      interaction.reply(`Congratulations! <@${userId}> has not called for \`Dota\` at all.`);
    }
  },
};
