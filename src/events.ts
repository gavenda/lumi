import { guildMemberAdd } from './events/guild-member-add.event.js';
import { guildMemberRemove } from './events/guild-member-remove.event.js';
import { messageCreateDota } from './events/message-create-dota.event.js';

export const events = [messageCreateDota, guildMemberRemove, guildMemberAdd];