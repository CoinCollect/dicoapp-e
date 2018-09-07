import { remote } from 'electron';
import { takeLatest, put, select, call, all } from 'redux-saga/effects';
import { makeSelectCurrentUser } from '../App/selectors';
import api from '../../utils/barter-dex-api';
import { LOAD_PRICES, COIN_BASE } from './constants';
import {
  loadCoinSymbol,
  loadPricesSuccess,
  loadPricesError,
  loadBestPrice
} from './actions';
import { makeSelectInitCoinsData } from './selectors';

const symbol = remote.require('./config/symbol');

const covertSymbolToName = syl => {
  const s = symbol.symbolToName[syl];
  if (s) return s;
  return '';
};

const numcoin = 100000000;
// const txfee = 10000;
const debug = require('debug')('dicoapp:containers:BuyPage:saga');

export function* loadPriceProcess(coin, userpass) {
  const getprices = {
    userpass,
    base: COIN_BASE.get('coin'),
    rel: coin
  };
  const buf = 1.08 * numcoin;
  let bestprice = 0;
  try {
    const result = yield api.orderbook(getprices);
    if (result.asks.length > 0) {
      const ask = result.asks.find(e => e.maxvolume > 0);
      bestprice = Number((ask.price * numcoin).toFixed(0));
      bestprice = Number(
        (((buf / numcoin) * bestprice) / numcoin).toFixed(8) * numcoin
      ).toFixed(0);
      yield put(loadBestPrice(coin, Number(bestprice / numcoin)));
    }
    return bestprice !== 0;
  } catch (err) {
    debug(`load price process: ${err.message}`);
    return false;
  }
}

export function* loadInitCoinData(coins) {
  try {
    const data = coins.map(e => {
      const sym = e.get('coin');
      const coin = covertSymbolToName(sym);
      return {
        coin,
        symbol: sym
      };
    });
    return yield put(loadCoinSymbol(data));
  } catch (err) {
    debug(`load init coin data: ${err.message}`);
    return false;
  }
}

export function* loadPricesProcess() {
  try {
    // load user data
    const user = yield select(makeSelectCurrentUser());
    if (!user) {
      throw new Error('not found user');
    }
    const userpass = user.get('userpass');
    const coins = user.get('coins');
    const initCoinsData = yield select(makeSelectInitCoinsData());

    if (!initCoinsData) {
      yield call(loadInitCoinData, coins);
    }

    const requests = [];
    for (let i = 0; i < coins.size; i += 1) {
      const e = coins.get(i);
      const coin = e.get('coin');
      requests.push(call(loadPriceProcess, coin, userpass));
    }

    const data = yield all(requests);
    console.log(data, 'data');
    return yield put(loadPricesSuccess());
  } catch (err) {
    return yield put(loadPricesError(err.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* buyData() {
  yield takeLatest(LOAD_PRICES, loadPricesProcess);
}