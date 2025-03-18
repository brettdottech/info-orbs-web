import styles from './ProgressSpinner.module.css';

interface ProgressSpinnerProps {
    show: boolean;
    title?: string;
    message: string;
}

const ProgressSpinner = ({
                             show,
                             title = 'Please wait',
                             message,
                         }: ProgressSpinnerProps) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className={styles['overlay']}>
            <div className={styles['spinner']}>
                <div className={styles['spinner-circle']}></div>
                <p className={styles['spinner-title']}>{title}</p>
                <p className={styles['spinner-text']}>{message}</p>
            </div>
        </div>
    );
};

export default ProgressSpinner;