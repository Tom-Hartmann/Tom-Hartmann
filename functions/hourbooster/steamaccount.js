"use strict";

const _ = require("lodash");
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const Promise = require("bluebird");
const moment = require("moment");
const EventEmitter = require("events");

module.exports = class SteamAccount extends EventEmitter {
  constructor(name, password, sentry, secret, games, indent = 0) {
    super();
    this.name = name;
    this.password = password;
    this.sentry = sentry;
    this.secret = secret;
    this.games = games;
    this.indent = indent;
    const options = {
      promptSteamGuardCode: false,
      dataDirectory: null,
    };
    this.client = new SteamUser(null, options);
    if (this.sentry) this.client.setSentry(Buffer.from(this.sentry, "base64"));

    this.client.on("error", (err) => this.emit("clientError", err));
    this.client.on("steamGuard", () => this.emit("clientSteamGuard"));
    this.client.once("steamGuard", () => (this.steamGuardRequested = true));
  }

  logheader() {
    return _.padEnd(
      `[${moment().format("YYYY-MM-DD HH:mm:ss")} - ${this.name}]`,
      this.indent
    );
  }

  error(err) {
    return this.emit("customError", err);
  }

  login() {
    if (this.client.client.loggedOn) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.once("clientError", reject);
      this.once("clientSteamGuard", () => reject("Steam guard requested!"));
      this.client.once("loggedOn", resolve);

      if (this.secret) {
        SteamTotp.getAuthCode(this.secret, (err, code) => {
          const logOnOptions = {
            accountName: this.name,
            password: this.password,
            twoFactorCode: code,
          };
          this.client.logOn(logOnOptions);
        });
      } else {
        const logOnOptions = {
          accountName: this.name,
          password: this.password,
        };
        this.client.logOn(logOnOptions);
      }
    })
      .timeout(10000)
      .catch(Promise.TimeoutError, () => Promise.reject("Timed out at login"))
      .finally(() => {
        this.removeAllListeners("clientError");
        this.removeAllListeners("clientSteamGuard");
        return this.client.removeAllListeners("loggedOn");
      });
  }

  logoff() {
    if (!this.client.client.loggedOn) return;
    this.client.gamesPlayed([]);
    return this.client.logOff();
  }

  boost() {
    return this.login()
      .then(() => {
        this.client.setPersona(SteamUser.EPersonaState.Offline);
        this.client.gamesPlayed(
          this.games !== null ? this.games : [{ game_id: 10 }]
        );
        return console.log(`${this.logheader()} Starting to boost games!`);
      })
      .catch((err) => console.error(`${this.logheader()} ${err}`));
  }

  restartGames() {
    this.client.gamesPlayed([]);
    return Promise.delay(5000).then(() => this.boost());
  }
};
