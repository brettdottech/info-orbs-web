import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {Clock} from '../types/Clock';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DownloadsCounter from "../components/DownloadsCounter";
// import ProgressSpinner from '../components/ProgressSpinner';
import LikeToggle from "../components/LikeToggle";
import {toast} from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import '../styles/ClockDetailPage.css'; // Import the new CSS file
import config from '../config';
import {AuthContext} from "../context/AuthContext.tsx";


const ClockDetailPage = () => {
    // Get logged in user
    const {user} = useContext(AuthContext)!;

    const {id} = useParams();
    const [clock, setClock] = useState<Clock | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [isImagesVisible, setImagesVisible] = useState<boolean>(false);
    const [orbIP, setOrbIP] = useState<string>(''); // State for the orb IP input
    const [customClockNo, setCustomClockNo] = useState<number>(0); // State for the orb IP input
    // const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [isInstallDialogOpen, setIsInstallDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [pendingUrl, setPendingUrl] = useState<string>(''); // URL pending confirmation
    const [pendingCustomClockNum, setPendingCustomClockNum] = useState<number>(0); // Clock num pending confirmation
    // const [status, setStatus] = useState<'success' | 'failure' | null>(null); // Status for ping (null, success, or failure)
    // const [maxCustomClockNum, setMaxCustomClockNum] = useState<number>(0); // Clock num pending confirmation

    const navigate = useNavigate();

    // const token = localStorage.getItem('token'); // Retrieve stored token
    // const authHeader = token ? {
    //     headers: {
    //         Authorization: `Bearer ${token}` // Send token in header
    //     }
    // } : {}

    // Load the orbIP from localStorage when the component mounts
    useEffect(() => {
        const savedOrbIP = localStorage.getItem('orbIP'); // Check localStorage for existing orbIP
        if (savedOrbIP) {
            setOrbIP(savedOrbIP); // Set the state with the saved IP address
        }
        const savedCustomClockNo = localStorage.getItem('customClockNo');
        if (savedCustomClockNo) {
            setCustomClockNo(parseInt(savedCustomClockNo, 10));
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Save orbIP to localStorage whenever it changes
    useEffect(() => {
        if (orbIP) {
            localStorage.setItem('orbIP', orbIP); // Update localStorage
        }
    }, [orbIP]); // Runs every time orbIP is updated

    // Save customClockNo to localStorage whenever it changes
    useEffect(() => {
        if (customClockNo) {
            localStorage.setItem('customClockNo', customClockNo.toString()); // Update localStorage
        }
    }, [customClockNo]); // Runs every time orbIP is updated

    useEffect(() => {
        axios.get(`${config.backendURL}/clocks/${id}`)
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

    const handleInstallClockface = (url: string, customClockNum: number) => {
        // Validate the orb IP value
        if (!orbIP) {
            toast.error('Please enter a valid IP address for the orb.'); // Show error toast
            return;
        }

        // Set up pending data and open the dialog
        setPendingUrl(url);
        setPendingCustomClockNum(customClockNum);
        setIsInstallDialogOpen(true); // Open confirmation dialog
    }

    const confirmInstallClockface = () => {
        setIsInstallDialogOpen(false); // Close confirmation dialog
        // Open the URL in a new tab
        window.open(
            `http://${orbIP}/fetchFromClockRepo?url=${encodeURIComponent(pendingUrl)}&customClock=${pendingCustomClockNum}&clockName=${clock.name}&authorName=${clock.User.username}`,
            '_blank');
        markDownload();
    };

    const handleDeleteClockface = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteClockface = () => {
        setIsDeleteDialogOpen(false);
        axios.delete(`${config.backendURL}/clocks/${clock.id}`)
            .then(() => {
                    toast.success('Clockface deleted');
                    navigate("/");
                }
            );
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
                    </div>
                    <button onClick={() => window.open(`http://${orbIP}/`, '_blank')}>
                        Open WebPortal
                    </button>
                    {/* Custom Clock Number Label + Input */}
                    <div className="input-group">
                        <label htmlFor="orb-customclockno">CustomClock #:</label>
                        <input
                            // disabled={status !== 'success' || !orbIP}
                            id="orb-customclockno"
                            type="number"
                            value={customClockNo}
                            min="0"
                            max="9"
                            onChange={(e) => setCustomClockNo(Number(e.target.value))}
                            placeholder="0-9"
                            className="custom-clock-number-input"
                        />
                    </div>
                    <button id="install-clockface"
                            onClick={() => handleInstallClockface(clock.jpg_url, customClockNo)}
                    >
                        Install
                    </button>
                </div>
                <div className="install-info">
                    <h4>How it works</h4>
                    <div>When you press "Install", we open a new tab that connects to your Orbs and
                        tries to install the clockface.
                    </div>
                    <div>If everything works, the new tab should close automatically. If there is a problem, the tab
                        will remain open.
                    </div>
                    <div>You can see the install progress directly on your InfoOrbs. During installation, the WebPortal
                        is not reachable.
                    </div>
                </div>
            </div>
            {user && (user.isAdmin || user.id == clock.user_id) && (<button className="delete-button"
                                                                            onClick={() => handleDeleteClockface()}>Delete
                Clock
            </button>)}
            {/*<ProgressSpinner*/}
            {/*    show={loading}*/}
            {/*    title="Uploading Clockface to InfoOrbs"*/}
            {/*    message="This might take 1-2 minutes..."*/}
            {/*/>*/}
            <ConfirmationDialog
                show={isInstallDialogOpen}
                title="Install Clockface"
                message={`Are you sure you want to install '${clock.name}' on InfoOrb ${orbIP}, CustomClock ${customClockNo}?`}
                onConfirm={confirmInstallClockface} // Proceed with installation
                onCancel={() => setIsInstallDialogOpen(false)} // Cancel the dialog
            />
            <ConfirmationDialog
                show={isDeleteDialogOpen}
                title="Delete Clockface"
                message={`Are you sure you want to delete this clockface from the server?`}
                onConfirm={confirmDeleteClockface} // Proceed with installation
                onCancel={() => setIsDeleteDialogOpen(false)} // Cancel the dialog
            />
        </div>
    );
};

export default ClockDetailPage;