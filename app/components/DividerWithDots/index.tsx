import styles from './DividerWithDots.css';
import cx from 'classnames';
type Props = {
  extraStyle?: Record<string, any>;
};

const DividerWithDots = ({ extraStyle }: Props) => {
  return (
    <div className={styles.visionLine} style={extraStyle}>
      <span className={styles.dot} />
      <span className={cx(styles.dot, styles.dotBottom)} />
    </div>
  );
};

export default DividerWithDots;
