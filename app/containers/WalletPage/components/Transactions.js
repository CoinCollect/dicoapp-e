// @flow
import React, { PureComponent } from 'react';
import { shell } from 'electron';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import type { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CachedIcon from '@material-ui/icons/Cached';
import {
  makeSelectTransactionsLoading,
  makeSelectTransactionsError,
  makeSelectTransactionsList,
  makeSelectTransactionsEntities
} from '../selectors';
import { loadTransactions } from '../actions';

const debug = require('debug')('dicoapp:containers:WalletPage:Transactions');

const styles = () => ({
  containerSection: {
    paddingBottom: 30
  },

  table: {
    maxHeight: 450
  },
  card: {
    position: 'relative'
  },
  btns: {
    top: 8,
    right: 8,
    display: 'flex',
    position: 'absolute'
  },
  th: {
    color: '#555555',
    fontSize: 15
  }
});

const explorer = {
  KMD: 'http://kmdexplorer.io/tx',
  BTC: 'https://blockchain.com/btc/tx',
  LTC: 'https://live.blockcypher.com/ltc/tx',
  GLXT: 'http://glx.info/tx'
};

let idInterval = null;
const LOAD_TRANSACTION_TIME = 90000;

type Props = {
  loading: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  error: boolean | Object,
  // eslint-disable-next-line flowtype/no-weak-types
  classes: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  list: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  entities: Object,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadTransactions: Function
};

class Transactions extends PureComponent<Props> {
  componentDidMount = () => {
    debug('watch transactions');

    const { dispatchLoadTransactions } = this.props;
    if (idInterval) {
      clearInterval(idInterval);
      idInterval = null;
    }
    idInterval = setInterval(() => {
      dispatchLoadTransactions();
    }, LOAD_TRANSACTION_TIME);

    dispatchLoadTransactions();
  };

  componentWillUnmount = () => {
    if (idInterval) {
      clearInterval(idInterval);
      idInterval = null;
    }
  };

  onClickReloadTranstactions = (evt: SyntheticInputEvent<>) => {
    evt.preventDefault();
    const { dispatchLoadTransactions } = this.props;
    dispatchLoadTransactions();
  };

  onClickTranstactions = (evt: SyntheticInputEvent<>) => {
    evt.preventDefault();
    // https://github.com/electron/electron/blob/master/docs/api/shell.md#shellopenexternalurl
    shell.openExternal(evt.target.href);
  };

  renderRecord = (v, k) => {
    const { entities } = this.props;
    const t = entities.get(v);
    console.log(t);
    if (!t) return null;
    return (
      <TableRow key={t.get('txid')}>
        <TableCell>{k + 1}</TableCell>
        <TableCell>{t.get('coin')}</TableCell>
        <TableCell>{t.get('blockindex')}</TableCell>
        <TableCell>
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          {explorer[t.get('coin')] && (
            <a
              style={{ color: '#000' }}
              href={`${explorer[t.get('coin')]}/${t.get('txid')}`}
              // target="_blank"
              // rel="noopener noreferrer"
              onClick={this.onClickTranstactions}
            >
              {t.get('txid')}
            </a>
          )}
          {!explorer[t.get('coin')] && t.get('txid')}
        </TableCell>
      </TableRow>
    );
  };

  render() {
    debug(`render`);

    const { loading, classes, list, error } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={12} className={classes.containerSection}>
          <Card className={classes.card}>
            {loading && <LinearProgress />}
            <CardContent>
              <Typography variant="title" gutterBottom>
                <FormattedMessage id="dicoapp.containers.Wallet.last_transactions">
                  {(...content) => content}
                </FormattedMessage>
              </Typography>
              <div className={classes.btns}>
                <IconButton
                  disabled={loading}
                  onClick={this.onClickReloadTranstactions}
                >
                  <CachedIcon />
                </IconButton>
              </div>
              {error && (
                <SnackbarContent
                  // className={classNames(classes[variant], className)}
                  aria-describedby="client-snackbar"
                  message={error.message}
                />
              )}
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.th}>#</TableCell>
                    <TableCell className={classes.th}>
                      <FormattedMessage id="dicoapp.containers.Wallet.last_transactions_coin">
                        {(...content) => content}
                      </FormattedMessage>
                    </TableCell>
                    <TableCell className={classes.th}>
                      <FormattedMessage id="dicoapp.containers.Wallet.last_transactions_blockheight">
                        {(...content) => content}
                      </FormattedMessage>
                    </TableCell>
                    <TableCell className={classes.th}>
                      <FormattedMessage id="dicoapp.containers.Wallet.last_transactions_transactionid">
                        {(...content) => content}
                      </FormattedMessage>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{list && list.map(this.renderRecord)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </React.Fragment>
    );
  }
}

Transactions.displayName = 'Transactions';

// eslint-disable-next-line flowtype/no-weak-types
export function mapDispatchToProps(dispatch: Dispatch<Object>) {
  return {
    dispatchLoadTransactions: () => dispatch(loadTransactions())
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectTransactionsLoading(),
  error: makeSelectTransactionsError(),
  list: makeSelectTransactionsList(),
  entities: makeSelectTransactionsEntities()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  withStyles(styles)
)(Transactions);
