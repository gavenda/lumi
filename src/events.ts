import { buttonInteraction } from './events/button-interaction.event';
import { chatInputCommandInteraction } from './events/chat-input-command-interaction.event';
import { guildMemberAdd } from './events/guild-member-add.event';
import { guildMemberRemove } from './events/guild-member-remove.event';
// import { messageCreateDota } from './events/message-create-dota.event';

export const events = [
  // messageCreateDota,
  guildMemberRemove,
  guildMemberAdd,
  chatInputCommandInteraction,
  buttonInteraction
];
