// @flow
import React, { PureComponent } from 'react';
import type { Node, ChildrenArray } from 'react';
import ClassNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const debug = require('debug')('dicoapp:containers:BuyPage:CoinSelectable');

const styles = () => ({
  btn: {
    width: 184,
    height: 152,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    // marginLeft: 10,
    // marginRight: 10,
    marginRight: 20,
    marginBottom: 10,
    border: '1px solid lightgray',
    cursor: 'pointer',
    borderRadius: 5,
    position: 'relative'
  },

  btnSelected: {
    borderColor: '#80BB41'
  },

  btnDisabled: {
    color: 'rgba(0, 0, 0, 0.26)'
  },

  btn__content: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  btn__title: {
    margin: '5px 0px'
  },

  btn__subtitle: {
    marginTop: 8
  },

  btn__selected: {
    position: 'absolute',
    top: -12,
    right: -12,
    borderColor: '#fff',
    backgroundColor: '#80BB41',
    color: '#fff',
    borderRadius: 12
  }
});

type Props = {
  // eslint-disable-next-line flowtype/no-weak-types
  classes: Object,
  icon: Node,
  selected?: boolean,
  disabled?: boolean,
  title?: Node | null,
  subTitle?: Node | null,
  // eslint-disable-next-line flowtype/no-weak-types
  children?: ChildrenArray<any> | null,
  // eslint-disable-next-line flowtype/no-weak-types
  onClick?: Function | null,
  // eslint-disable-next-line flowtype/no-weak-types
  dispatchLoadPrice?: Function,
  // eslint-disable-next-line flowtype/no-weak-types
  data?: string,
  className: string
};

class CoinSelectable extends PureComponent<Props> {
  static defaultProps = {
    title: null,
    subTitle: null,
    selected: false,
    disabled: false,
    children: null,
    onClick: null,
    data: '',
    dispatchLoadPrice: () => {}
  };

  componentDidMount = () => {
    const { dispatchLoadPrice, data } = this.props;
    if (dispatchLoadPrice) {
      dispatchLoadPrice(data);
    }
  };

  onClick = (evt: SyntheticInputEvent<>) => {
    const { onClick, data } = this.props;
    if (onClick) {
      if (data) {
        // eslint-disable-next-line no-param-reassign
        evt.target.value = data;
      }
      onClick(evt);
    }
  };

  render() {
    debug(`render`);

    const {
      classes,
      className,
      icon,
      title,
      subTitle,
      selected,
      disabled,
      children
    } = this.props;

    const buttonClasses = ClassNames(classes.btn, className, {
      [classes.btnSelected]: selected,
      [classes.btnDisabled]: disabled
    });

    return (
      <ButtonBase
        disabled={disabled}
        focusRipple
        key="title"
        className={buttonClasses}
        focusVisibleClassName={classes.focusVisible}
        onClick={this.onClick}
      >
        <span className={classes.btn__content}>
          <div style={{ width: '32px' }}>{icon}</div>
          {title && (
            <Typography
              component="div"
              variant="title"
              color="inherit"
              className={classes.btn__title}
            >
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography
              component="div"
              variant="subheading"
              color="inherit"
              className={classes.btn__subtitle}
            >
              {subTitle}
            </Typography>
          )}
          {children}
        </span>
        {selected && (
          <CheckCircleOutlineIcon className={classes.btn__selected} />
        )}
      </ButtonBase>
    );
  }
}

CoinSelectable.displayName = 'CoinSelectable';

export default withStyles(styles)(CoinSelectable);
