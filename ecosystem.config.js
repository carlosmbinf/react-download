module.exports = {
  apps : [{
    name: "VIDKAR",
    script: "npm start",
    env: {
      NODE_ENV: "development",
      "ROOT_URL": "https://www.vidkar.com/",
      "PORT": 3000,
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
