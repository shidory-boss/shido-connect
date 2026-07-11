// PM2 — Oria Care PWA (shido-connect) sur VPS
// Usage : pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: 'oria-care',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/shido-connect',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3007,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/var/log/pm2/oria-care.out.log',
      error_file: '/var/log/pm2/oria-care.error.log',
    },
  ],
};
