import swal from 'sweetalert';
// import { put, call, select, cancel, cancelled } from 'redux-saga/effects';
import { put, call, select, cancelled } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from '../../../lib/barter-dex-api';
import {
  makeSelectCurrentUser,
  makeSelectBalanceEntities
} from '../../App/selectors';
import { loadBuyCoinError, loadBuyCoinSuccess } from '../actions';
import { makeSelectPricesEntities } from '../selectors';
import { APPROPRIATE_ERROR_UTXOS } from '../constants';

const debug = require('debug')(
  'dicoapp:containers:BuyPage:saga:load-buy-coin-process'
);

const numcoin = 100000000;
const txfee = 10000;
const intervalTime = 45 * 1000; // 45s

export default function* loadBuyCoinProcess({ payload, time = intervalTime }) {
  try {
    // step one: load user data
    const user = yield select(makeSelectCurrentUser());
    if (!user) {
      throw new Error('not found user');
    }
    const { basecoin, paymentcoin, amount } = payload;

    const userpass = user.get('userpass');
    const coins = user.get('coins');
    const smartaddress = coins.find(c => c.get('coin') === paymentcoin);

    // step two: load balance
    const balances = yield select(makeSelectBalanceEntities());
    const balance = balances.find(c => c.get('coin') === paymentcoin);

    // step three: load best price
    const prices = yield select(makeSelectPricesEntities());
    const price = prices.find(c => c.get('rel') === paymentcoin);

    // step four: check balance
    const relvolume = Number(amount * price.get('price'));
    if (
      relvolume * numcoin + txfee >=
      Number(balance.get('balance') * numcoin).toFixed(0)
    ) {
      throw new Error('Not enough balance!');
    }

    let isSplittingTheFund = false;
    // const startTime = Date.now();

    while (true) {
      // const durationTime = Date.now() - startTime;
      // if (durationTime > 20 * 1000) {
      //   debug('cancel');
      //   yield cancel();
      // }

      // step five: get listunspent data
      const unspent = yield call([api, 'listunspent'], {
        userpass,
        coin: paymentcoin,
        address: smartaddress.get('smartaddress')
      });

      if (unspent.length < 2) {
        // splitting utxos
        debug('splitting utxos');
        if (!isSplittingTheFund) {
          // FIXED ME: This is UI code. We should move it to somewhere else (react component).
          let suffixText = '';
          if (paymentcoin === 'BTC') {
            suffixText = 'For BTC this takes ~ 60 minutes.';
          } else {
            suffixText = 'For KMD this takes ~ 6 minutes.';
          }
          swal(
            'Splitting Procedure',
            `You will need at least 2 UTXOs to perform your swap. We are trying to split it for you. Don't turn off the application. PS Please wait 6 blocks before you do a Buy. ${suffixText}`
          );
          const buyparams = {
            userpass,
            base: basecoin,
            rel: paymentcoin,
            relvolume: relvolume.toFixed(8),
            price: price.get('bestPrice').toFixed(8)
          };

          const result = yield call([api, 'buy'], buyparams);
          if (result.error) swal('Please topup your balance', result.error);

          debug('UTXO autosplit TX INFO:', result);
          if (result.error) {
            throw new Error(result.error);
          }
          isSplittingTheFund = true;
        }
      } else {
        debug('ready to buy');
        const buyparams = {
          userpass,
          base: basecoin,
          rel: paymentcoin,
          relvolume: relvolume.toFixed(8),
          price: price.get('bestPrice').toFixed(8)
        };

        const result = yield call([api, 'buy'], buyparams);
        if (result.error) {
          if (result.error === APPROPRIATE_ERROR_UTXOS) {
            throw new Error(
              "With the 2 UTXO's you have now you can't perform this swap. Please try a different amount, otherwise do an extra funding to your dICO wallet address."
            );
          }
          throw new Error(result.error);
        }
        if (result.pending) {
          return yield put(loadBuyCoinSuccess(result.pending));
        }
      }
      yield call(delay, time);
    }
  } catch (err) {
    return yield put(loadBuyCoinError(err.message));
  } finally {
    if (yield cancelled()) {
      debug('load buy coin process cancelled');
    }
  }
}
