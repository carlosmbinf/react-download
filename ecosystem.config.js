module.exports = {
  apps : [{
    name: "app",
    script: "npm start",
    env: {
      NODE_ENV: "development",
      "ROOT_URL": "https://vidkar.hopto.org/",
      "PORT": 3000,
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
