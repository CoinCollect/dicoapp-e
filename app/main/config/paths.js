const util = require('electron-util');
const { app } = require('electron');
const { homedir } = require('os');
const { resolve } = require('path');

const { is } = util;
// const debug = require('debug')('dicoapp:config:paths');

const marketmakerPlatformPath = binDir => {
  switch (process.platform) {
    // MacOS
    case 'darwin':
      return util.fixPathForAsarUnpack(
        resolve(binDir, 'marketmaker/mac/marketmaker')
      );
    // Windows
    case 'win32':
      return util.fixPathForAsarUnpack(
        resolve(binDir, 'marketmaker/win/marketmaker.exe')
      );
    // Linux
    case 'linux':
      return util.fixPathForAsarUnpack(
        resolve(binDir, 'marketmaker/linux/marketmaker')
      );
    // MacOS
    default:
      return util.fixPathForAsarUnpack(
        resolve(binDir, 'marketmaker/mac/marketmaker')
      );
  }
};

exports.default = function loadPaths(config) {
  // create user data path
  const userDataDir = resolve(app.getPath('userData'), config.get('APPNAME'));

  const binDir = is.development
    ? resolve(__dirname, 'bin')
    : resolve(__dirname, 'bin');
  return config.set('paths', {
    homeDir: homedir(),
    binDir,
    userDataDir,
    marketmaker: marketmakerPlatformPath(binDir)
  });
};
