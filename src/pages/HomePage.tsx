import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Clock} from '../types/Clock';
import LikeToggle from "../components/LikeToggle";
import DownloadsCounter from "../components/DownloadsCounter";
import config from "../config";

const HomePage = () => {
    const [clocks, setClocks] = useState<Clock[]>([]);

    useEffect(() => {
        axios.get(`${config.backendURL}/clocks`)
            .then(response => setClocks(response.data))
            .catch(error => console.error('Error fetching clocks:', error));
    }, []);

    return (
        <div className="home-page">
            {/*<h2>Available Clocks</h2>*/}
            <div className="clock-list">
                {clocks.map((clock) => {
                    let url = clock.jpg_url;
                    if (url.startsWith("https://github.com")) {
                        url = url.replace("github.com", "raw.githubusercontent.com").replace("tree", "refs/heads");
                    }
                    url += `/${Math.floor(Math.random() * 10)}.jpg`;
                    const link = `/clock/${clock.id}`;
                    return (
                        <div key={clock.id} className="clock-card">
                            <Link to={link}><img src={url} alt={clock.name} width="120" height="120"/></Link>
                            <h3>{clock.name}</h3>
                            <div>by {clock.User.username}</div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <LikeToggle id={clock.id.toString()}
                                            initialLikes={clock.likes}
                                            initialLiked={clock.userLiked}
                                            long={false}
                                />
                                <DownloadsCounter downloads={clock.downloads}
                                                  long={false}
                                />
                            </div>
                            {/*<Link to={link} className="view-details-btn">View Details</Link>*/}
                        </div>
                    );
                })}
            </div>
            {/*<Link to="/add-clock" className="add-clock-btn">Add New Clock</Link>*/}
        </div>
    );
};

export default HomePage;
