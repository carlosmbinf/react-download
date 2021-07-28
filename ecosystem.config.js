module.exports = {
  apps : [{
    name: "app",
    script: "npm start",
    env: {
      NODE_ENV: "development",
      "ROOT_URL": "https://srv138118-206152.vps.etecsa.cu",
      "PORT": 3000,
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
