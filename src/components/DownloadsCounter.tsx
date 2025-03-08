import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import styles from './DownloadsCounter.module.css';

interface DownloadsCounterProps {
    downloads: number;
    long: boolean
}

const DownloadsCounter: React.FC<DownloadsCounterProps> = ({
                                                               downloads, long
                                                           }) => {
    return (
        <div className={styles['downloads-counter']}
        >
            <FontAwesomeIcon
                icon={faDownload} // Toggle icon
                className={styles['icon-download']}
            />
            {downloads}{long ? " downloads" : ""}
        </div>
    );
};

export default DownloadsCounter;