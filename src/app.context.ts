import { Client } from 'discord.js';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

export interface AppContext {
  client: Client;
  redis: RedisClient;
  welcomeId: string;
}
