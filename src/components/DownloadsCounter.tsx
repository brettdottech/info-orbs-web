import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';

interface DownloadsCounterProps {
    downloads: number;
    long: boolean
}

const DownloadsCounter: React.FC<DownloadsCounterProps> = ({
                                                               downloads, long
                                                           }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0 8px'
            }}
        >
            <FontAwesomeIcon
                icon={faDownload} // Toggle icon
                style={{color: 'lightgrey', marginRight: '8px'}} // Toggle color
            />
            {downloads}{long ? " downloads" : ""}
        </div>
    );
};

export default DownloadsCounter;