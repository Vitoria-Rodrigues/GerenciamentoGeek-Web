import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import type { FastifyEnvOptions } from '@fastify/env';
import { resolve } from 'node:path';

const envPlugin: FastifyPluginAsync = async (server) => { 

  const schema = {
    type: 'object',
    required: [ 'SERVER_HOST', 'SERVER_PORT', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DEFAULT_ADMIN_NAME' ,'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASS'],
    properties: {
      SERVER_HOST: { type: 'string' },
      SERVER_PORT: { type: 'number' },

      // Security Props
      JWT_SECRET: { type: 'string' },
      SESSION_SECRET: { type: 'string' },

      // Seed Admin User Props
      DEFAULT_ADMIN_NAME: { type: 'string' },
      DEFAULT_ADMIN_EMAIL: { type: 'string' },
      DEFAULT_ADMIN_PASS: { type: 'string' },

      // MySQL Props
      DB_HOST: { type: 'string' },
      DB_PORT: { type: 'number' },
      DB_USER: { type: 'string' },
      DB_PASS: { type: 'string' },
      DB_NAME: { type: 'string' },
    },
  } as const;

  const envOptions: FastifyEnvOptions = {
    confKey: 'config',
    schema: schema,
    dotenv: {
      path: resolve(__dirname, '../../.env'),
    },
  };

  await server.register(fastifyEnv, envOptions);
};

export default fp(envPlugin);