module.exports = {
  apps: [
    {
      name: "Tom Hartmann",
      script: "index.js", // Or the entry point of your application
      node_args: "--max-old-space-size=4096", // Set the desired memory limit in megabytes
    },
  ],
};
