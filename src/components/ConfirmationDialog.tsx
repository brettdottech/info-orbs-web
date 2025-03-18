import styles from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
    show: boolean; // Whether the dialog is visible
    title?: string; // Optional title for the dialog
    message: string; // Message to show in the dialog
    onConfirm: () => void; // Called when "Confirm" button is clicked
    onCancel: () => void; // Called when "Cancel" button is clicked
}

const ConfirmationDialog = ({
                                show,
                                title = 'Confirmation',
                                message,
                                onConfirm,
                                onCancel
                            }: ConfirmationDialogProps) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className={styles["confirmation-dialog-overlay"]}>
            <div className={styles["confirmation-dialog"]}>
                {title && <h3 className={styles["confirmation-dialog-title"]}>{title}</h3>}
                <div className={styles["confirmation-dialog-message"]}>{message}</div>
                <div className={styles["confirmation-dialog-buttons"]}>
                    <button
                        className={styles["confirmation-dialog-button confirm-button"]}
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className={styles["confirmation-dialog-button cancel-button"]}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;