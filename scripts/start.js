/**
 * Copyright (c) 2021-present, ChatCord, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

const config = require("./utils/config.js");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const open = require("open");

const express = require("express");
const app = express();
// const proto = require(config.Protocol);
const proto = require("http");
const server = proto.createServer(app);

/**
 * Babel Setup.
 */
const babel = require("@babel/core");
const babelConfig = {
      "presets": [
            [
                  "@babel/preset-env",
                  {
                        "modules": false
                  }
            ]
      ],
      "plugins": [
            [
                  "module:@xeonjs/jsx2xset"
            ]
      ]
};


// Get Arguments
const args = process.argv.slice(2);

/**
 * Source directory.
 */
app.all("/src/:path", (req, res) => {
      const path = req.params.path,
      extension = path.split(".").pop();

      // If javascript file...
      if (["js", "jsx", "mjs", "cjs", "xjs"].includes(extension)) {
            var code = fs.readFileSync(config.resolveApp("./src", path), "utf8");
            code = code.trim().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/\s+/gm, " ").trim();
            var result = babel.transformSync(code, babelConfig);
            code = result.code;

            res.set({
                  "content-type": "application/javascript"
            });
            return res.send(code);
      }

      res.sendFile(config.resolveApp("./src", path));
});

/**
 * Surve static files.
 */
app.use("/static", express.static(config.resolveApp(config.publicDir)));
app.get('*', (req, res) => {

      var index = fs.readFileSync(config.resolveApp("public/index.html"), "utf8");
      index = index.replace(/%public_url%/gi, "/static");
      res.send(index);
});

/**
 * @Start server.
 * 
 * open in browser if in developement mode.
 */
server.listen(config.Port, config.Host, (err) => {
      if (err) throw err;
      config.clearConsole();
      console.log(chalk.greenBright.bold(`>>====>> ${chalk.cyanBright.underline(config.appPackage.name)} app is started on port ${config.Port}`));
      if (config.appPackage.version && config.appPackage.version !== "") {
            console.log(chalk.greenBright.bold(`>>====>> ${chalk.cyanBright.underline("App Version:")} ${config.appPackage.version}`));
      }
      if (config.appPackage.description && config.appPackage.description !== "") {
            console.log(chalk.greenBright.bold(`>>====>> ${chalk.cyanBright.underline("Description:")} ${config.appPackage.description}\n`));
      }

      const keys = Object.keys(config.network.Interface);
      var loggedIP = 0;
      if (keys.length > 0) {
            console.log(chalk.greenBright.bold(">>====>> Open via - "));
            for (let i = 0; i < config.network.length; i++) {
                  let network = keys[i];
                  let list = config.network.Interface[network];
                  for (let j = 0; j < list.length; j++) {
                        let obj = list[j];
                        if (obj.family === "IPv4") {
                              if (obj.address === "127.0.0.1") {
                                    loggedIP++;
                                    console.log(chalk.cyanBright.bold(`         (${loggedIP}) ${chalk.underline("Local Mechine:")} ${config.Protocol}://${obj.address}:${config.Port}/`));
                              } else {
                                    loggedIP++;
                                    console.log(chalk.white(`         (${loggedIP}) ${chalk.underline("Local Network:")} ${config.Protocol}://${obj.address}:${config.Port}/`));
                              }
                        }
                  }
            }
      }
      console.log(chalk.greenBright.bold("\n>>====>> The app will automatically update on changes"));
      console.log(chalk.redBright.bold("\n>>====>> Press Ctrl + C to terminate the session\n"));

      if (args[1] === "--development" || args[1] === "-dev" || args[1] === undefined) {
            // open default browser if development mode.
            // open(`${config.Protocol}://${config.Host}:${config.Port}/`);
      }
});