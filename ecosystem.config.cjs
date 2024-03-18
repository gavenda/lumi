const postDeployCommands = {
  production: ['pnpm install', 'pnpm run register', 'pm2 startOrRestart ecosystem.config.cjs', 'pm2 save'],
  development: ['pnpm install', 'pnpm run register:guild', 'pm2 startOrRestart ecosystem.config.cjs', 'pm2 save']
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
