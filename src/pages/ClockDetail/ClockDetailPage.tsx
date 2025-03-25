import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Clock} from '../../types/Clock.ts';
import ConfirmationDialog from '../../components/ConfirmationDialog.tsx';
import DownloadsCounter from "../../components/DownloadsCounter.tsx";
import LikeToggle from "../../components/LikeToggle.tsx";
import {toast} from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import styles from './ClockDetailPage.module.css'; // Import the new CSS file
import config from '../../config.ts';
import ClockTimeCard from "./ClockTimeCard.tsx";
import Card from "../../components/Card.tsx";
import AllClockImagesCard from "./AllClockImagesCard.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useApi} from "../../hooks/useApi.ts";
import {useToken} from "../../context/AuthContext.tsx";


const ClockDetailPage = () => {
    const api = useApi();
    // Get logged in user
    const {user} = useKindeAuth();
    const {hasRole} = useToken();
    const {id} = useParams();
    const [clock, setClock] = useState<Clock | null>(null);
    const [orbIP, setOrbIP] = useState<string>(''); // State for the orb IP input
    const [customClockNo, setCustomClockNo] = useState<number>(0);
    const [secondHandColor, setSecondHandColor] = useState<string>("#000000");
    const [overrideColor, setOverrideColor] = useState<string>("#000000");
    const [isInstallDialogOpen, setIsInstallDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // Dialog visibility state
    const [pendingUrl, setPendingUrl] = useState<string>(''); // URL pending confirmation
    const [pendingCustomClockNum, setPendingCustomClockNum] = useState<number>(0); // Clock num pending confirmation
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    // const [editMode, setEditMode] = useState<boolean>(false);

    const navigate = useNavigate();

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

    useEffect(() => {
        api.get(`/clocks/${id}`)
            .then(response => {
                setClock(response.data);
                setSecondHandColor(response.data.secondHandColor);
            })
            .catch(error => console.error('Error fetching clock details:', error));
    }, [api, id]);

    if (!clock) {
        return <div className="flex items-center justify-center min-h-60 text-white text-xl">Loading...</div>;
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
        const author = clock.author && clock.author.length > 0 ? clock.author : clock.userName;
        const installUrl = `http://${orbIP}/fetchFromClockRepo?`
            + `url=${encodeURIComponent(pendingUrl)}&customClock=${pendingCustomClockNum}&`
            + `clockName=${encodeURIComponent(clock.name)}&`
            + (author ? `authorName=${encodeURIComponent(author)}&` : "")
            + `secondHandColor=${encodeURIComponent(secondHandColor)}&overrideColor=${encodeURIComponent(overrideColor)}`
        console.log(installUrl);
        // Open the URL in a new tab
        window.open(installUrl, '_blank');
        markDownload();
    };

    const handleDeleteClockface = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteClockface = () => {
        setIsDeleteDialogOpen(false);
        api.delete(`/clocks/${clock.id}`)
            .then(() => {
                    toast.success('Clockface deleted');
                    navigate("/clocks");
                }
            );
    };

    const handleApproval = (approve: boolean) => {
        if (approve) {
            api.post(`/clocks/${clock.id}/approve`)
                .then(() => {
                        navigate(0); // This refreshes the current page
                    }
                );
        } else {
            api.delete(`/clocks/${clock.id}/approve`)
                .then(() => {
                        navigate(0); // This refreshes the current page
                    }
                );
        }
    };

    const markDownload = () => {
        api.post(`/clocks/${clock.id}/dl`)
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

    const url = `${config.backendURL}/images/${clock.id}`;

    const isAdmin = hasRole("admin");
    const canEdit = user && (isAdmin || user.id == clock.userId);


    return (
        <div>
            <Card>
                <div className="float-right items-end;">
                    <LikeToggle id={clock.id.toString()} initialLikes={clock.likes} initialLiked={clock.userLiked}
                                long={true}/>
                    <DownloadsCounter downloads={clock.downloads} long={true}/>
                </div>
                <div className="text-xl font-bold">{clock.name} {!clock.approved && (
                    <span className="text-red-500">(Needs approval)</span>)}</div>
                <div>by {clock.author && clock.author.length > 0 ? clock.author : clock.userName}</div>
                {clock.author && clock.author.length > 0 && (<div>Uploaded by {clock.userName}</div>)}
                {clock.url && clock.url.length > 0 && (<div><a href={clock.url} target="_blank">{clock.url}</a></div>)}
            </Card>
            <ClockTimeCard clock={clock} secondHandColor={secondHandColor} overrideColor={overrideColor}/>
            {clock.description && clock.description.length > 0 && (<Card>
                <div>{clock.description}</div>
            </Card>)}
            <AllClockImagesCard clock={clock}/>

            <Card>
                <div className="text-xl font-bold">Install this Clockface</div>
                <div className="flex items-center gap-4 mb-4 mt-2 max-w-full w-auto flex-wrap">
                    {/* Orb IP Label + Input */}
                    <div className={styles["input-group"]}>
                        <label htmlFor="orb-ip">InfoOrbs IP:</label>
                        <input
                            id="orb-ip"
                            type="text"
                            value={orbIP}
                            onChange={(e) => setOrbIP(e.target.value)}
                            placeholder="192.168.x.x"
                            className="p-1 text-lg border border-gray-300 rounded flex-1"
                        />
                    </div>
                    {/* Custom Clock Number Label + Input */}
                    {showAdvanced && (
                        <>
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
                                    className="w-15 p-1 text-lg border border-gray-300 rounded"
                                />
                            </div>
                            <div className={styles["input-group"]}>
                                <label htmlFor="secondcolor">Second hand:</label>
                                <input id="secondcolor" type="color" value={secondHandColor}
                                       onChange={(e) => setSecondHandColor(e.target.value)}/>
                            </div>
                            <div className={styles["input-group"]}>
                                <label htmlFor="overridecolor">Override:</label>
                                <input id="overridecolor" type="color" value={overrideColor}
                                       onChange={(e) => setOverrideColor(e.target.value)}/>
                            </div>
                            <button onClick={() => window.open(`http://${orbIP}/`, '_blank')}>
                                Open WebPortal
                            </button>
                        </>
                    )}
                    <button id="install-clockface"
                            className="green"
                            onClick={() => handleInstallClockface(url, customClockNo)}
                    >
                        Install
                    </button>
                    <button id="show-advanced" hidden={showAdvanced}
                            className="grey"
                            onClick={() => setShowAdvanced(true)}
                    >
                        Show Advanced
                    </button>
                </div>
                <div className="text-sm">
                    <div onClick={() => setShowInfo(!showInfo)} className="font-bold">
                        How it works <FontAwesomeIcon icon={faInfoCircle}/>
                    </div>
                    <div hidden={!showInfo} className="mt-1">
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
            {canEdit && (
                <div className="flex items-center max-w-full w-auto flex-wrap justify-end gap-4">
                    {/*{!editMode ? (*/}
                    {/*    <button className={styles["edit-button"]}*/}
                    {/*            onClick={() => setEditMode(true)}>*/}
                    {/*        Edit Clock*/}
                    {/*    </button>*/}
                    {/*) : (*/}
                    {/*    <button className={styles["update-button"]}*/}
                    {/*            onClick={() => setEditMode(false)}>*/}
                    {/*        Update Clock*/}
                    {/*    </button>*/}
                    {/*)}*/}
                    {
                        isAdmin && (
                            <button className="blue"
                                    onClick={() => handleApproval(!clock.approved)}>
                                {clock.approved ? "Unapprove Clock" : "Approve Clock"}
                            </button>
                        )
                    }
                    <button className="red"
                            onClick={() => handleDeleteClockface()}>
                        Delete Clock
                    </button>
                </div>
            )}
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