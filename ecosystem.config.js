module.exports = {
    apps: [{
        name: 'PushEngage-app1',
        script: 'cluster_main.js',
        kill_timeout: 5000,
        wait_ready: true,
        listen_timeout: 10000,

        // Optional reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
        autorestart: true,
        watch: false,
        env_staging: {
            NODE_ENV: 'staging',
            DB_URL: 'mongodb://localhost:27017/pushengage-app1',
            PORT: 5000
        },
        env_production: {
            NODE_ENV: 'production',
            DB_URL: 'mongodb://localhost:27017/pushengage-app1',
            PORT: 8443
        }
    }],
};
