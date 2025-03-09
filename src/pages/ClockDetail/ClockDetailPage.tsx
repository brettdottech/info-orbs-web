import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {Clock} from '../../types/Clock.ts';
import ConfirmationDialog from '../../components/ConfirmationDialog.tsx';
import DownloadsCounter from "../../components/DownloadsCounter.tsx";
import LikeToggle from "../../components/LikeToggle.tsx";
import {toast} from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import styles from './ClockDetailPage.module.css'; // Import the new CSS file
import config from '../../config.ts';
import {AuthContext} from "../../context/AuthContext.tsx";
import ClockTimeCard from "./ClockTimeCard.tsx";
import Card from "../../components/Card.tsx";
import AllClockImagesCard from "./AllClockImagesCard.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";


const ClockDetailPage = () => {
    // Get logged in user
    const {user} = useContext(AuthContext)!;

    const {id} = useParams();
    const [clock, setClock] = useState<Clock | null>(null);
    const [orbIP, setOrbIP] = useState<string>(''); // State for the orb IP input
    const [customClockNo, setCustomClockNo] = useState<number>(0); // State for the orb IP input
    const [isInstallDialogOpen, setIsInstallDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [pendingUrl, setPendingUrl] = useState<string>(''); // URL pending confirmation
    const [pendingCustomClockNum, setPendingCustomClockNum] = useState<number>(0); // Clock num pending confirmation
    const [showInfo, setShowInfo] = useState<boolean>(false);

    const navigate = useNavigate();

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

    if (!clock) return <div>Loading...</div>;

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
        axios.post(`${config.backendURL}/clocks/${clock.id}/dl`)
            .then(response => {
                // console.log(response);
                if (response.data && response.data.downloads) {
                    // Update download counter on page
                    setClock((prevClock) => prevClock ? {
                        ...prevClock,
                        downloads: response.data.downloads,
                    } : null);
                }
            })
            .catch(error => console.error('Error marking download:', error));
    };


    return (
        <div className={styles["clock-detail-page"]}>
            <div className={styles["clock-stats"]}>
                <LikeToggle id={clock.id.toString()} initialLikes={clock.likes} initialLiked={clock.userLiked}
                            long={true}/>
                <DownloadsCounter downloads={clock.downloads} long={true}/>
            </div>
            <h2>{clock.name}</h2>
            <div>by {clock.User.username}</div>
            <ClockTimeCard clock={clock}/>
            <AllClockImagesCard clock={clock}/>

            <Card>
                <h4>Install this Clockface</h4>
                <div className={styles["flex-container"]}>
                    {/* Orb IP Label + Input */}
                    <div className={styles["input-group"]}>
                        <label htmlFor="orb-ip">InfoOrbs IP:</label>
                        <input
                            id="orb-ip"
                            type="text"
                            value={orbIP}
                            onChange={(e) => setOrbIP(e.target.value)}
                            placeholder="192.168.x.x"
                            className={styles["orb-ip-input"]}
                        />
                    </div>
                    {/* Custom Clock Number Label + Input */}
                    <div className={styles["input-group"]}>
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
                            className={styles["custom-clock-number-input"]}
                        />
                    </div>
                    <button onClick={() => window.open(`http://${orbIP}/`, '_blank')}>
                        Open WebPortal
                    </button>
                    <button id="install-clockface"
                            onClick={() => handleInstallClockface(clock.jpg_url, customClockNo)}
                    >
                        Install
                    </button>
                </div>
                <div className={styles["install-info"]}>
                    <h4 onClick={() => setShowInfo(!showInfo)}>
                        How it works <FontAwesomeIcon icon={faInfoCircle}/>
                    </h4>
                    <div hidden={!showInfo}>
                        <div>When you press "Install", we open a new tab that connects to your Orbs and
                            tries to install the clockface.
                        </div>
                        <div>If everything works, the new tab should close automatically. If there is a problem, the tab
                            will remain open.
                        </div>
                        <div>You can see the install progress directly on your InfoOrbs. During installation, the
                            WebPortal
                            is not reachable.
                        </div>
                    </div>
                </div>
            </Card>
            {user && (user.isAdmin || user.id == clock.user_id) && (<button className={styles["delete-button"]}
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