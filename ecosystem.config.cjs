const postDeployCommands = {
  production: ['pnpm install', 'pnpm run register', 'pm2 startOrRestart ecosystem.config.cjs', 'pm2 save'],
  development: ['pnpm install', 'pnpm run register:guild', 'pm2 startOrRestart ecosystem.config.cjs', 'pm2 save']
};

const deploymentConfig = (environment, commands) => {
  return {
    'user': process.env.APP_USER,
    'host': process.env.APP_HOST,
    'key': 'deploy.key',
    'ref': process.env.APP_BRANCH,
    'repo': 'https://github.com/gavenda/lumi',
    'path': process.env.APP_PATH,
    'post-deploy': commands,
    'env': {
      APP_ENV: environment,
      DOTENV_KEY: process.env.DOTENV_KEY
    }
  };
};

module.exports = {
  apps: [
    {
      name: 'lumi',
      script: './src/app.ts',
      interpreter: 'node',
      interpreterArgs: '--import tsx',
      max_memory_restart: '200M',
      wait_ready: true
    }
  ],
  deploy: {
    production: deploymentConfig('production', postDeployCommands.production.join(' && ')),
    development: deploymentConfig('development', postDeployCommands.development.join(' && '))
  }
};
