module.exports = {
  apps : [{
    name: "app",
    script: "meteor run",
    env: {
      NODE_ENV: "development",
      "ROOT_URL": "https://srv5119-206152.vps.etecsa.cu:5000/",
      "PORT": 3000,
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
