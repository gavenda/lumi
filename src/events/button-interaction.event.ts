import { ButtonInteraction, Events, Guild, PermissionFlagsBits } from 'discord.js';
import { AppEvent } from './event';
import { AppContext } from '@/app.context';
import i18next from 'i18next';

export const buttonInteraction: AppEvent<Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  once: false,
  execute: async (context, interaction) => {
    if (!interaction.guild) return;
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('role:')) {
      await interaction.deferReply({ ephemeral: true });
      await handleRoleAssignment({ context, guild: interaction.guild, interaction });
    }
  }
};

const handleRoleAssignment = async (options: { context: AppContext; guild: Guild; interaction: ButtonInteraction }) => {
  const { interaction, guild } = options;
  const lng = interaction.locale;
  // Check if user has administrator permissions
  const selfMember = guild.members.cache.get(interaction.user.id);

  if (!selfMember) return;
  if (!selfMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
    await interaction.followUp(i18next.t('reply.no_permission_to_assign_role', { lng }));
    return;
  }

  const [, roleId, userId] = interaction.customId.split(':');
  const member = guild.members.cache.get(userId);

  if (!member) return;

  // Add user to role
  await member.roles.add(roleId);
  await interaction.followUp({
    ephemeral: true,
    content: i18next.t('reply.role_assigned', { lng, userId, roleId })
  });
};
