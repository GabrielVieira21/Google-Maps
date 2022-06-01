 module.exports = {
    apps : [
        {
          name: "WEBSCRAPING",
          script: "./index.js",
          watch: true,
          env: {
            "NODE_ENV": "development",
          }
        }
    ]
  } 