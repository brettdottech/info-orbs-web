import React from 'react';
import '../styles/ProgressSpinner.css'; // Add CSS here or inline styles (see below)

interface ProgressSpinnerProps {
    show: boolean;
    title?: string;
    message: string;
}

const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({
                                                             show,
                                                             title = 'Please wait',
                                                             message,
                                                         }) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className='overlay' id='overlay'>
            <div className='spinner' id='spinner'>
                <div className='spinner-circle'></div>
                <p className='spinner-title' id='spinner-title'>{title}</p>
                <p className='spinner-text' id='spinner-text'>{message}</p>
            </div>
        </div>
    );
};

export default ProgressSpinner;