# dicoapp-e

Use this app to buy CoinCollect coins with Komodo or Bitcoin.

- [What is this app?](#what-is-this-app)
- [How do I run this app?](#how-do-i-run-this-app)
- [Troubleshooting](#troubleshooting)
- [Useful links](#useful-links)

## What is this app?

This app implements BarterDEX for doing decentralized ICO's, dICO's. It's configured for buying CC with KMD or BTC.

## How do I run this app?

First, install basic **dependencies**:

    sudo apt install git curl libc6-i386 libgconf-2-4

Then, make sure you have the right **node** version:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

(exit from the current terminal and start another terminal window and enter the following)

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

## Troubleshooting

If marketmaker cannot be found and the app gives a "Network error" after filling in & clicking "Login", do the following:

1. Open [marketmaker.js](https://github.com/CoinCollect/dicoapp-e/blob/coincollect/app/main/plugins/marketmaker.js#L43) on your computer
2. On line 43, replace `config.get('paths.marketmaker')` with the full path of your marketmaker binary. For example: `/home/YOURNAME/BarterDEX/assets/bin/linux64/marketmaker`.

## Useful links

- [Whitelabel instructions](https://github.com/KomodoPlatform/dicoapp-e/blob/master/docs/whitelabel.md)
