import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';

interface DownloadsCounterProps {
    downloads: number;
    long: boolean
}

const DownloadsCounter = ({
                              downloads, long
                          }: DownloadsCounterProps) => {
    return (
        <div className="flex items-center mx-2">
            <FontAwesomeIcon
                icon={faDownload} // Toggle icon
                className="text-lightgrey mr-2"
            />
            {downloads}{long ? " downloads" : ""}
        </div>
    );
};

export default DownloadsCounter;