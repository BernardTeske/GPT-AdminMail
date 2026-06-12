module.exports = {
  apps: [{
    name: 'gpt-adminmail',
    script: './index.js',
    instances: 1,
    autorestart: false,
    cron_restart: '0 8 * * *',
    watch: false,
    max_restarts: 1,
    restart_delay: 0,
  }]
};
