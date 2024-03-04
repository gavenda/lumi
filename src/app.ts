// @ts-expect-error no type definitions
import * as dotenv from '@dotenvx/dotenvx';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config();

import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import { commands } from './commands.js';
import { events } from './events.js';
import { DOTA2_WORDS } from './keys.js';
import { logger } from './logger.js';
import { redis } from './redis.js';

if (!process.env.TOKEN) {
  throw new Error('TOKEN is required.');
}

// Create discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`);

  readyClient.user.setPresence({
    status: 'online',
    activities: [{ name: 'Kingdom of Palettia', type: ActivityType.Watching }]
  });
});

// Slash command interaction event
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find((command) => command.data.name === interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Register events
for (const { once, event, execute } of events) {
  logger.debug(`Registering event handler`, { event });

  if (once) {
    // @ts-expect-error too much OR typing here, compiler will get confused
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    client.once(event, ($event) => execute(context, $event));
  } else {
    // @ts-expect-error too much OR typing here, compiler will get confused
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    client.on(event, ($event) => execute(context, $event));
  }
}

// Graceful disconnect
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, cleaning up');
  if (redis.isReady) {
    await redis.disconnect();
  }
  if (client.isReady()) {
    await client.destroy();
  }
});

try {
  // Connect to redis
  await redis.connect();
  // Add dota keywords
  await redis.sAdd(DOTA2_WORDS, 'dota');
} catch (error) {
  logger.error('Unable to connect to redis', { error });
  process.exit(1);
}

try {
  // Now ready to login to gateway
  await client.login(process.env.TOKEN);
} catch (error) {
  logger.error('Unable to connect to discord gateway', { error });
  process.exit(1);
} finally {
  if (process.send) {
    process.send('ready');
  }
}
