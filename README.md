# dicoapp-e for CoinCollect

Use this app to **buy CoinCollect coins with Komodo or Bitcoin**.

- [What is this app?](#what-is-this-app)
- [How do I run this app?](#how-do-i-run-this-app)
- [Troubleshooting](#troubleshooting)
- [Useful links](#useful-links)

## What is this app?

This app implements BarterDEX for doing decentralized ICO's, dICO's. It's configured for buying CC with KMD or BTC.

## Download the app!

**Linux**

For Linux, download one of the following:

- [Download AppImage for Linux](https://www.coincollect.cc/download/linux/dICOApp-0.9.0.AppImage)
- [Download deb for Linux](https://www.coincollect.cc/download/linux/dicoapp-e_0.9.0_amd64.deb)

**MacOS**

- [Download dmg for MacOS](https://www.coincollect.cc/download/mac/dICOApp-0.12.0.dmg)

**Windows**

- [Download CoinCollect dICO-app for Windows](https://www.coincollect.cc/download/windows/dICOApp-Setup-0.9.0.exe)

## How do I run this app on my dev machine

### On MacOS

First, install basic **dependencies**:

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    brew install git curl libgconf-2-4

Then, make sure you have the right **node** version:

    brew install nvm

    echo 'export NVM_DIR=~/.nvm' >> ~/.bashrc_profile

    echo 'source $(brew --prefix nvm)/nvm.sh' >> ~/.bashrc_profile

(exit from the current terminal and start another terminal window and enter the following)

    nvm install 9.11.2
    nvm use 9.11.2

Next, install the **yarn** package manager:

    brew install yarn --without-node

Almost there. **Clone** this repository to your computer:

    git clone https://github.com/CoinCollect/dicoapp-e
    cd dicoapp-e

Install **packages**:

    yarn install

And finally, **run the app**:

    yarn start

That's it. You now have the dicoapp running, ready to use.

### On Linux

First, install basic **dependencies**:

    sudo apt install git curl libc6-i386 libgconf-2-4

Then, make sure you have the right **node** version:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

(exit from the current terminal and start another terminal window and enter the following)

/usr/local/opt/nvm/nvm.sh use 9.11.2

    nvm install 9.11.2
    nvm use 9.11.2

Next, install the **yarn** package manager:

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install --no-install-recommends yarn

Almost there. **Clone** this repository to your computer:

    git clone https://github.com/CoinCollect/dicoapp-e
    cd dicoapp-e

Install **packages**:

    yarn install

And finally, **run the app**:

    yarn start

That's it. You now have the dicoapp running, ready to use.

## Packaging

Read [docs/packaging.md](docs/packaging.md) for information on packaging the app for Linux, MacOS & Windows.

## Troubleshooting

### Timeout at step 1/6

Timeout at client side, or UTXO's cannot be found.

Presumably bob gets this error: `validate error -3`.

### Timeout at step 4/6 Buyer Payment

There's something wrong on the server. Presumably a `tx-overwinter-active` error.

### "Network error"

If marketmaker cannot be found and the app gives a "Network error" after filling in & clicking "Login", do the following:

1. Open [marketmaker.js](https://github.com/CoinCollect/dicoapp-e/blob/coincollect/app/main/plugins/marketmaker.js#L43) on your computer
2. On line 43, replace `config.get('paths.marketmaker')` with the full path of your marketmaker binary. For example: `/home/YOURNAME/BarterDEX/assets/bin/linux64/marketmaker`.

### Mac: 'invalid active developer path'

If you get something like:

    xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun

, run:

    xcode-select --install

In case this did still not solve the error, run:

    xcode-select --reset

## Useful links

- [Whitelabel instructions](https://github.com/KomodoPlatform/dicoapp-e/blob/master/docs/whitelabel.md)
