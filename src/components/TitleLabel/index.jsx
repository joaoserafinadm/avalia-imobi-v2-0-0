import styles from './TitleLabel.module.scss';

export default function TitleLabel({ children }) {
  return <div className={styles.titleLabel}>{children}</div>;
}
