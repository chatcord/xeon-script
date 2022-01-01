/**
 * Copyright (c) 2021-present, ChatCord, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const clearConsole = require("./clearConsole");

/**
 * Contains the absolute path of currrent work directory.
 */
const appDirectory = fs.realpathSync(process.cwd());

/**
 * 
 * @param {String} relativePath - path relative to the main Project.
 * @returns absolute Path
 */
const resolveApp = (...relativePaths) => path.resolve(appDirectory, ...relativePaths);

/**
 * local network details
 */
const networkInterfaces = os.networkInterfaces()

const appPackageJson = require(resolveApp('package.json'));

module.exports = {
      appPackage: appPackageJson,
      publicDir: resolveApp(process.env.PUBLIC_DIR || appPackageJson.PUBLIC_DIR || "./public"),
      sourceDir: resolveApp(process.env.SOURCE_DIR || appPackageJson.SOURCE_DIR || "./src"),
      appDirectory,
      resolveApp,
      Host: process.env.HOST || appPackageJson["xeon-config"]?.["HOST"] || 'localhost',
      Port: process.env.PORT || appPackageJson["xeon-config"]?.["PORT"] || 5000,
      Protocol: (process.env.HTTPS || appPackageJson["xeon-config"]?.["PROTOCOL"]) ?? 'http',
      network: {
            Interface: networkInterfaces,
            length: Object.keys(networkInterfaces).length,
      },
      clearConsole,
}