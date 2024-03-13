import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import { createClient } from 'redis';
import { events } from './events';
import { DOTA2_WORDS } from './keys';
import { logger } from './logger';
// @ts-expect-error no type definitions
import * as dotenv from '@dotenvx/dotenvx';
import { AppContext } from './app.context';
import en from './locales/en.json';
import i18next from 'i18next';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is required.');
}
if (!process.env.WELCOME_ID) {
  throw new Error('WELCOME_ID is required.');
}
if (!process.env.TOKEN) {
  throw new Error('TOKEN is required.');
}

// Create redis client
export const redis = createClient({
  url: process.env.REDIS_URL
});

// Create discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const context: AppContext = { client, redis, welcomeId: process.env.WELCOME_ID };

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`);

  readyClient.user.setPresence({
    status: 'online',
    activities: [{ name: 'Kingdom of Palettia', type: ActivityType.Watching }]
  });
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
  // Initialize i18next
  await i18next.init({
    lng: 'en-US',
    resources: {
      en
    }
  });

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

process.stdin.resume();
process.stdin.setEncoding('utf8');
