"use strict";

const _ = require("lodash");
const R = require("ramda");
const Promise = require("bluebird");

const SteamAccount = require("./steamaccount");
const migrate = require("./migrate");
const manageDB = require("./database");
const ms = require("ms");

migrate();
const database = manageDB.read();
/*
const telebot = require("../../database/hourboost/telebot")
telebot()
*/
if (database.length === 0) {
  console.error("[!] No accounts have been added!");
}

// Calculate the length of the longest name in the database and add 24 to it
// This is used to format the output later on
const pad = 24 + _.maxBy(R.pluck("name", database), "length").length;

function getUpdatedAccounts() {
  const updatedDatabase = manageDB.read();
  const updatedAccounts = updatedDatabase
    .map(({ name, password, sentry, secret, games = [] }) => {
      return games.length > 0
        ? new SteamAccount(name, password, sentry, secret, games, pad)
        : null;
    })
    .filter((val) => val !== null);

  return updatedAccounts;
}

// Map over each item in the database array and create a new array of SteamAccount objects
// that have at least one game associated with them
const accounts = database
  .map(({ name, password, sentry, secret, games = [] }) => {
    // If the games array is not empty, create a new SteamAccount object
    // with the given properties and the padding value
    return games.length > 0
      ? new SteamAccount(name, password, sentry, secret, games, pad)
      : // If the games array is empty, return null (we will filter this out later)
        null;
  })
  // Filter out any null values from the previous step
  .filter((val) => val !== null);
const restartBoost = () => {
  console.log("[=] Restart boosting");
  const accountsToRestart = getUpdatedAccounts();
  return Promise.map(accountsToRestart, _.method("restartGames"))
    .delay(ms("6h"))
    .finally(restartBoost);
};

const startBoost = () => {
  console.log("[=] Start boosting");
  const accountsToBoost = getUpdatedAccounts();
  Promise.map(accountsToBoost, _.method("boost"))
    .delay(ms("6h"))
    .then(restartBoost);
};
module.exports = { startBoost, restartBoost };
