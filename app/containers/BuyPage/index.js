// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import type { Dispatch } from 'redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import type { List, Map } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import injectReducer from '../../utils/inject-reducer';
import injectSaga from '../../utils/inject-saga';
import injectWebsocket from '../../utils/inject-websocket';
import { WEBSOCKET_DAEMON } from '../../utils/constants';
import MDCAppBar from '../../components/AppBar';
import ErrorBoundary from '../../components/ErrorBoundary';
import { NavigationLayout } from '../Layout';
import {
  makeSelectBalanceEntities,
  makeSelectBalanceLoading
} from '../App/selectors';
import { loadBalance } from '../App/actions';
import AmountSection from './components/AmountSection';
import CurrencySection from './components/CurrencySection';
import PaymentSection from './components/PaymentSection';
// import TestSwap from './components/TestSwap';
import { APP_STATE_NAME } from './constants';
import reducer from './reducer';
import saga from './saga';
import subscribe from './subscribe';
import { loadPrices, loadPrice } from './actions';
import {
  makeSelectBalanceList,
  makeSelectPricesLoading,
  makeSelectPricesEntities
} from './selectors';

const debug = require('debug')('dicoapp:containers:BuyPage');

const styles = () => ({
  container: {
    marginTop: 65,
    padding: 24
  },

  containerSection: {
    paddingBottom: 30
  },

  hr: {
    marginBottom: 20
  },

  cardContent: {
    position: 'relative',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0
  },

  cardContent__rightBtn: {
    position: 'absolute',
    right: 0,
    top: -12
  },

  cardContent__title: {
    marginBottom: 25
  }
});

type Props = {
  loading: boolean,
  balanceLoading: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  classes: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadPrices: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadPrice: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadBalance: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  balance: Object,
  entities: Map<*, *>,
  list: List<*>
};

type State = {
  paymentCoin: string
};

class BuyPage extends Component<Props, State> {
  props: Props;

  state = {
    paymentCoin: ''
  };

  componentDidMount = () => {
    const { dispatchLoadBalance } = this.props;

    dispatchLoadBalance();
  };

  onReloadPrices = (evt: SyntheticInputEvent<>) => {
    evt.stopPropagation();
    const { dispatchLoadPrices } = this.props;

    dispatchLoadPrices();
  };

  onClickPaymentCoin = (evt: SyntheticInputEvent<>) => {
    evt.preventDefault();
    const { value } = evt.target;
    this.setState({
      paymentCoin: value
    });
  };

  render() {
    debug('render');

    const {
      classes,
      loading,
      balanceLoading,
      list,
      entities,
      balance,
      dispatchLoadPrice
    } = this.props;
    const { paymentCoin } = this.state;

    return (
      <React.Fragment>
        <MDCAppBar
          title={
            <FormattedMessage id="dicoapp.containers.BuyPage.title">
              {(...content) => content}
            </FormattedMessage>
          }
        />

        <Grid container spacing={0} className={classes.container}>
          <Grid item xs={12} className={classes.containerSection}>
            {/* <Card> */}
            {loading && <LinearProgress />}
            <CardContent className={classes.cardContent}>
              <Typography
                variant="title"
                gutterBottom
                className={classes.cardContent__title}
              >
                <FormattedMessage id="dicoapp.containers.BuyPage.currency">
                  {(...content) => content}
                </FormattedMessage>
              </Typography>
              {/* <Divider className={classes.hr} /> */}

              <CurrencySection
                balance={balance}
                onClick={this.onReloadPrices}
              />
            </CardContent>
            <CardContent className={classes.cardContent}>
              <Typography
                variant="title"
                gutterBottom
                className={classes.cardContent__title}
              >
                <FormattedMessage id="dicoapp.containers.BuyPage.payment">
                  {(...content) => content}
                </FormattedMessage>
              </Typography>
              <IconButton
                aria-label="Reload prices"
                className={classes.cardContent__rightBtn}
                onClick={this.onReloadPrices}
              >
                <Icon>cached</Icon>
              </IconButton>
              {/* <Divider className={classes.hr} /> */}
              <PaymentSection
                onClick={this.onClickPaymentCoin}
                paymentCoin={paymentCoin}
                list={list}
                entities={entities}
                balance={balance}
                dispatchLoadPrice={dispatchLoadPrice}
                loading={balanceLoading}
              />
            </CardContent>
            <CardContent className={classes.cardContent}>
              <Typography
                variant="title"
                gutterBottom
                className={classes.cardContent__title}
              >
                <FormattedMessage id="dicoapp.containers.BuyPage.amount">
                  {(...content) => content}
                </FormattedMessage>
              </Typography>
              {/* <Divider className={classes.hr} /> */}
              <AmountSection paymentCoin={paymentCoin} />
            </CardContent>
            {/* </Card> */}
          </Grid>
        </Grid>
        {/* <TestSwap /> */}
      </React.Fragment>
    );
  }
}

// eslint-disable-next-line flowtype/no-weak-types
export function mapDispatchToProps(dispatch: Dispatch<Object>) {
  return {
    dispatchLoadPrices: () => dispatch(loadPrices()),
    dispatchLoadPrice: (coin: string) => dispatch(loadPrice(coin)),
    dispatchLoadBalance: () => dispatch(loadBalance())
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectPricesLoading(),
  entities: makeSelectPricesEntities(),
  balance: makeSelectBalanceEntities(),
  list: makeSelectBalanceList(),
  balanceLoading: makeSelectBalanceLoading()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: APP_STATE_NAME, reducer });
const withSaga = injectSaga({ key: APP_STATE_NAME, saga });
const withWebsocket = injectWebsocket({
  key: APP_STATE_NAME,
  mode: WEBSOCKET_DAEMON,
  subscribe
});

const BuyPageWapper = compose(
  withReducer,
  withSaga,
  withWebsocket,
  withConnect,
  withStyles(styles)
)(BuyPage);

const Index = () => (
  <NavigationLayout>
    <ErrorBoundary>
      <BuyPageWapper />
    </ErrorBoundary>
  </NavigationLayout>
);

Index.propTypes = {};

Index.defaultProps = {};

export default Index;
