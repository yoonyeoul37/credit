module.exports = {
  apps: [{
    name: 'credit-story',
    script: 'start.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '3000'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: '3000'
    }
  }]
} 