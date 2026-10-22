module.exports = {
  apps: [{
    name: 'gpt-adminmail',
    script: './scheduler.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 5000,
  }]
};
