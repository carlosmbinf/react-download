module.exports = {
  apps : [{
    name: "app",
    script: "meteor run",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
