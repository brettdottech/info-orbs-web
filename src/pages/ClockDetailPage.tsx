import {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {Clock} from '../types/Clock';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DownloadsCounter from "../components/DownloadsCounter";
import ProgressSpinner from '../components/ProgressSpinner';
import LikeToggle from "../components/LikeToggle";
import {toast} from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import '../styles/ClockDetailPage.css'; // Import the new CSS file
import config from '../config';


const ClockDetailPage = () => {
    const {id} = useParams();
    const [clock, setClock] = useState<Clock | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [isImagesVisible, setImagesVisible] = useState<boolean>(false);
    const [orbIP, setOrbIP] = useState<string>(''); // State for the orb IP input
    const [customClockNo, setCustomClockNo] = useState<number>(0); // State for the orb IP input
    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [pendingUrl, setPendingUrl] = useState<string>(''); // URL pending confirmation
    const [pendingCustomClockNum, setPendingCustomClockNum] = useState<number>(0); // Clock num pending confirmation
    const [status, setStatus] = useState<'success' | 'failure' | null>(null); // Status for ping (null, success, or failure)
    const [maxCustomClockNum, setMaxCustomClockNum] = useState<number>(0); // Clock num pending confirmation

    const token = localStorage.getItem('token'); // Retrieve stored token
    const authHeader = token ? {
        headers: {
            Authorization: `Bearer ${token}` // Send token in header
        }
    } : {}

    // Load the orbIP from localStorage when the component mounts
    useEffect(() => {
        const savedOrbIP = localStorage.getItem('orbIP'); // Check localStorage for existing orbIP
        if (savedOrbIP) {
            setOrbIP(savedOrbIP); // Set the state with the saved IP address
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Save orbIP to localStorage whenever it changes
    useEffect(() => {
        if (orbIP) {
            localStorage.setItem('orbIP', orbIP); // Update localStorage
        }
    }, [orbIP]); // Runs every time orbIP is updated

    // Ping the IP periodically
    useEffect(() => {
        if (!orbIP) {
            setStatus(null); // Reset status if IP is not set
            return;
        }

        const pingOrbIP = () => {
            // console.log('pinging orb', loading);
            if (loading) {
                // do not update while fetch is active because the Orbs will be blocked
                return;
            }
            axios
                .get(`http://${orbIP}/ping`, {timeout: 2000}) // 2-second timeout
                .then(response => {
                    // console.log(response);
                    const maxClock = response.data.customClocks - 1;
                    setMaxCustomClockNum(maxClock);
                    if (customClockNo > maxClock) {
                        setCustomClockNo(maxClock);
                    }
                    setStatus('success');
                }) // If successful, set status to success
                .catch(() => setStatus('failure')); // On error or timeout, set status to failure
        };

        // Ping immediately once the IP changes
        pingOrbIP();

        // Set interval for subsequent pings
        const interval = setInterval(pingOrbIP, 15000);

        return () => clearInterval(interval); // Cleanup on component unmount

    }, [orbIP, loading]); // Runs whenever `orbIP` changes

    useEffect(() => {
        axios.get(`${config.backendURL}/clocks/${id}`, authHeader)
            .then(response => setClock(response.data))
            .catch(error => console.error('Error fetching clock details:', error));
    }, [id]);

    useEffect(() => {
        // Function to format time in MM:HH:SS format
        const formatTime = (date: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            // const seconds = pad(date.getSeconds());
            // return `${hours}:${minutes}:${seconds}`;
            if (date.getSeconds() % 2 == 0) {
                return `${hours}:${minutes}`;
            } else {
                return `${hours} ${minutes}`;
            }
        };

        // Set once immediately
        setCurrentTime(formatTime(new Date()));

        // Update every second
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(formatTime(now));
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    if (!clock) return <div>Loading...</div>;

    let url = clock.jpg_url;

    if (url.startsWith("https://github.com")) {
        url = url.replace("github.com", "raw.githubusercontent.com").replace("tree", "refs/heads");
    }

    // POST request handler
    const handleInstallClockface = (url: string, customClockNum: number) => {
        // Validate the orb IP value
        if (!orbIP) {
            toast.error('Please enter a valid IP address for the orb.'); // Show error toast
            return;
        }

        // Set up pending data and open the dialog
        setPendingUrl(url);
        setPendingCustomClockNum(customClockNum);
        setIsDialogOpen(true); // Open confirmation dialog
    }

    const confirmInstallClockface = () => {
        setIsDialogOpen(false); // Close confirmation dialog
        const url = pendingUrl;
        const customClockNum = pendingCustomClockNum;
        setLoading(true); // Show spinner

        axios.post(`http://${orbIP}/fetchFromUrlByApi`, new URLSearchParams({
            url: url,
            customClockNo: customClockNum.toString()
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .then(() => {
                toast.success('Clockface installed successfully!'); // Show success toast
                markDownload();
            })
            .catch(error => {
                console.error('Error installing clockface:', error);
                toast.error('Failed to install the clockface.'); // Show error toast
            })
            .finally(() => setLoading(false)); // Hide spinner
    };

    const markDownload = () => {
        clock.downloads++;
        axios.post(`${config.backendURL}/clocks/${clock.id}/dl`)
            .then()
            .catch(error => console.error('Error marking download:', error));
    };

    // Helper function to render time as image-based digits
    const renderTimeAsImages = (time: string) => {
        return time.split('').map((char, index) => {
            // console.log(char);
            let imageFileName: string;
            if (char === ':') {
                imageFileName = '11.jpg';
            } else if (char === ' ') {
                imageFileName = '10.jpg';
            } else {
                imageFileName = `${char}.jpg`; // Digit or other character
            }
            return (
                <div key={index} className="clock-time-image-frame">
                    <img
                        key={index}
                        src={`${url}/${imageFileName}`}
                        alt={char}
                        width="120"
                        height="120"
                    />
                </div>
            );
        });
    };


    return (
        <div className="clock-detail-page">
            {/*<button onClick={() => window.history.back()} className="back-button">Back</button>*/}
            <div className="clock-stats">
                <LikeToggle id={clock.id.toString()} initialLikes={clock.likes} initialLiked={clock.userLiked}
                            long={true}/>
                <DownloadsCounter downloads={clock.downloads} long={true}/>
            </div>
            <h2>{clock.name}</h2>
            <div>by {clock.User.username}</div>

            <div className='card clock-time-card'>
                {/*<div>*/}
                <div className="clock-time">
                    {renderTimeAsImages(currentTime)}
                </div>
                {/*</div>*/}
            </div>
            <div className='card'>
                <h4 onClick={() => setImagesVisible(!isImagesVisible)} style={{cursor: 'pointer'}}>
                    All Images {isImagesVisible ? '-' : '+'}
                </h4>
                {isImagesVisible && (
                    <div className="clock-detail-images">
                        {[...Array(12)].map((_, idx) => (
                            // idx === 10 ? null : (
                            <img key={idx} src={`${url}/${idx}.jpg`} alt={`${clock.name} - ${idx}`} width="120"
                                 height="120"/>
                            // )
                        ))}
                    </div>)}

            </div>

            {/*<h3>Install on Orbs</h3>*/}

            <div className='card'>
                <h4>Install this clockface on you InfoOrbs</h4>
                <div className="flex-container">
                    {/* Orb IP Label + Input */}
                    <div className="input-group">
                        <label htmlFor="orb-ip">InfoOrbs IP:</label>
                        <input
                            id="orb-ip"
                            type="text"
                            value={orbIP}
                            onChange={(e) => setOrbIP(e.target.value)}
                            placeholder="192.168.x.x"
                            className="orb-ip-input"
                        />
                        {/* Status Indicator */}
                        <div
                            className={`status-indicator ${
                                status === 'success' ? 'green' : status === 'failure' ? 'red' : ''
                            }`}
                            title={status === 'success' ? 'Connection Successful' : status === 'failure' ? 'Connection Failed' : ''}
                        ></div>
                    </div>

                    {/* Custom Clock Number Label + Input */}
                    <div className="input-group">
                        <label htmlFor="orb-customclockno">CustomClock # (0 - {maxCustomClockNum}):</label>
                        <input
                            disabled={status !== 'success' || !orbIP}
                            id="orb-customclockno"
                            type="number"
                            value={customClockNo}
                            min="0"
                            max={maxCustomClockNum}
                            onChange={(e) => setCustomClockNo(Number(e.target.value))}
                            placeholder="0-9"
                            className="custom-clock-number-input"
                        />
                    </div>
                    {/* Install Button */}
                    <button
                        disabled={status !== 'success' || !orbIP || customClockNo > maxCustomClockNum}
                        id="install-clockface"
                        onClick={() => handleInstallClockface(clock.jpg_url, customClockNo)}
                        className="install-button"
                    >
                        Install
                    </button>
                </div>
            </div>
            <ProgressSpinner
                show={loading}
                title="Uploading Clockface to InfoOrbs"
                message="This might take 1-2 minutes..."
            />
            <ConfirmationDialog
                show={isDialogOpen}
                title="Confirm Clockface Installation"
                message={`Are you sure you want to install this clockface on Orb IP: ${orbIP}, CustomClock ${customClockNo}?`}
                onConfirm={confirmInstallClockface} // Proceed with installation
                onCancel={() => setIsDialogOpen(false)} // Cancel the dialog
            />
        </div>
    );
};

export default ClockDetailPage;