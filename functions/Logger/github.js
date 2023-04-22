const {
  githubUsername,
  repo,
  personalAccessToken,
  discordWebhookUrl,
} = require("../../config.json");

const axios = require("axios");
const { Webhook } = require("discord-webhook-node");

const hook = new Webhook(discordWebhookUrl);

async function fetchLatestCommit() {
  const url = `https://api.github.com/repos/${githubUsername}/${repo}/commits`;
  const config = {
    headers: {
      Authorization: `token ${personalAccessToken}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("No commits found in the response data.");
    }
  } catch (error) {
    console.error("Error fetching commits:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
  }
}

async function sendCommitToDiscord(commit) {
  const message =
    `**New commit in ${repo}:**\n\n` +
    `**Message:** ${commit.commit.message}\n` +
    `**Author:** ${commit.commit.author.name}\n` +
    `**Date:** ${commit.commit.author.date}\n` +
    `**URL:** ${commit.html_url}`;

  try {
    await hook.send(message);
    console.log("Commit sent to Discord.");
  } catch (error) {
    console.error("Error sending commit to Discord:", error.message);
  }
}

async function main() {
  const latestCommit = await fetchLatestCommit();
  if (latestCommit) {
    sendCommitToDiscord(latestCommit);
  } else {
    return;
  }
}

async function checkRateLimit() {
  const url = "https://api.github.com/rate_limit";
  const config = {
    headers: {
      Authorization: `token ${personalAccessToken}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    console.log("Rate limit information:", response.data);
  } catch (error) {
    console.error("Error checking rate limit:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
  }
}

async function checkRepoAccess() {
  const url = `https://api.github.com/repos/${githubUsername}/${repo}`;
  const config = {
    headers: {
      Authorization: `token ${personalAccessToken}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    console.log("Repository details:", response.data);
  } catch (error) {
    console.error("Error fetching repository details:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
  }
}

checkRepoAccess();

checkRateLimit();

module.exports = { main };
