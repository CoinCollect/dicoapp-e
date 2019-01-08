// @flow
import React, { PureComponent } from 'react';
import type { List } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import { getCoinIcon } from '../../../components/CryptoIcons';
import { Line, Circle } from '../../../components/placeholder';
import getConfig from '../../../utils/config';
import { covertSymbolToName, floor } from '../utils';
import CoinSelectable from './CoinSelectable';

const debug = require('debug')('dicoapp:containers:BuyPage:PaymentSection');

const config = getConfig();
const COIN_BASE = config.get('marketmaker.tokenconfig');

const line = (
  <Line
    width={60}
    style={{
      marginTop: 8
    }}
  />
);

const lineTitle = (
  <Line
    width={90}
    style={{
      margin: '5px 0px'
    }}
  />
);

const lineContent = (
  <Line
    width={90}
    style={{
      margin: 0
    }}
  />
);

const circle = (
  <Circle
    style={{
      width: 32,
      height: 32
    }}
  />
);

const styles = () => ({});

type Props = {
  loading: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  // classes: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadPrice: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  onClick: Function,
  paymentCoin: string,
  // eslint-disable-next-line flowtype/no-weak-types
  balance: Object,
  entities: Map<*, *>,
  list: List<*>
};

class PaymentSection extends PureComponent<Props> {
  static defaultProps = {};

  renderPaymentCoin = symbol => {
    const {
      onClick,
      paymentCoin,
      entities,
      balance,
      dispatchLoadPrice
    } = this.props;
    const c = entities.get(symbol);
    const b = balance.get(symbol);
    const icon = getCoinIcon(symbol);
    const name = covertSymbolToName(symbol);
    if (!c) {
      // not found in entities
      return (
        <div>
          <CoinSelectable
            dispatchLoadPrice={dispatchLoadPrice}
            disabled
            key={`paymentCoin${symbol}`}
            data={symbol}
            icon={icon}
            title={name}
            subTitle={`${floor(b.get('balance'), 3)} ${b.get('coin')}`}
          >
            {lineContent}
          </CoinSelectable>
        </div>
      );
    }
    return (
      <CoinSelectable
        dispatchLoadPrice={dispatchLoadPrice}
        disabled={c.get('bestPrice') === 0 || b.get('balance') === 0}
        selected={paymentCoin === symbol}
        key={`paymentCoin${symbol}`}
        data={symbol}
        icon={icon}
        title={name}
        subTitle={`${floor(b.get('balance'), 3)} ${b.get('coin')}`}
        onClick={onClick}
      >
        <span>
          1 {COIN_BASE.coin} = {c.get('bestPrice')} {symbol}
        </span>
      </CoinSelectable>
    );
  };

  renderLoading = () => (
    <CoinSelectable icon={circle} title={lineTitle} subTitle={line}>
      {lineContent}
    </CoinSelectable>
  );

  render() {
    debug(`render`);
    const { list, loading } = this.props;
    if (loading && list.size === 0) {
      return this.renderLoading();
    }

    // Get entities
    const { entities } = this.props;
    const cKMD = entities.get('KMD');

    // Show info text as long as KMD order book is not ready
    const showInfoText = !cKMD || cKMD.get('bestPrice') === 0;

    return (
      <div>
        <div
          style={{
            fontSize: '16px',
            width: 'calc(100% - 20px)',
            display: showInfoText ? 'block' : 'none'
          }}
        >
          <p>
            You will buy CC using a <b>d</b>
            ICO app. This means you buy your coins safely, peer to peer, without
            a third party in between.
          </p>
          <p>
            Wait a few moments so that you can start buying the coins from this
            decentralized network. The coins below will become clickable in less
            then 1 minute. If not: restart the app.
          </p>
        </div>
        <div>
          <p
            style={{
              fontWeight: 'normal',
              fontSize: '16px',
              width: 'calc(100% - 20px)',
              display: showInfoText ? 'none' : 'block'
            }}
          >
            You can buy CoinCollect with KMD or BTC. KMD swaps are fast & cheap.
            BTC swaps are slower and have a higher transaction fee. We recommend
            to use BTC for bigger transaction amounts only.
          </p>
        </div>
        <br />
        {list.map(this.renderPaymentCoin)}
      </div>
    );
  }
}

PaymentSection.displayName = 'PaymentSection';

export default withStyles(styles)(PaymentSection);
