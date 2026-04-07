module.exports = {
  apps: [
    {
      name: "jvto-wa-gateway",
      script: "dist/index.js",
      cwd: "/app/jvto-web/services/wa-gateway",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
