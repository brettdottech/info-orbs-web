import React from 'react';
import '../styles/ConfirmationDialog.css'; // Add CSS here or inline styles (see below)

interface ConfirmationDialogProps {
    show: boolean; // Whether the dialog is visible
    title?: string; // Optional title for the dialog
    message: string; // Message to show in the dialog
    onConfirm: () => void; // Called when "Confirm" button is clicked
    onCancel: () => void; // Called when "Cancel" button is clicked
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   show,
                                                                   title = 'Confirmation',
                                                                   message,
                                                                   onConfirm,
                                                                   onCancel
                                                               }) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                {title && <h3 className="confirmation-dialog-title">{title}</h3>}
                <div className="confirmation-dialog-message">{message}</div>
                <div className="confirmation-dialog-buttons">
                    <button
                        className="confirmation-dialog-button confirm-button"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="confirmation-dialog-button cancel-button"
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