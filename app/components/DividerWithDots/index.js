//@flow

import React from 'react';
import styles from './DividerWithDots.css';
import cx from 'classnames';

type Props = {
  extraStyle: object
};

const DividerWithDots = ({ extraStyle }: Props) => {
  return (
    <div className={styles.vision__line} style={extraStyle}>
      <span className={styles.dot} />
      <span className={cx(styles.dot, styles.dotBottom)} />
    </div>
  );
};

export default DividerWithDots;
