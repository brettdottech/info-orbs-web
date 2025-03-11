import {useEffect, useState} from 'react';
import axios from 'axios';
import {Clock} from '../../types/Clock.ts';
import styles from './HomePage.module.css'; // Import the new CSS file
import config from "../../config.ts";
import ClockList from "./ClockList.tsx";

const HomePage = () => {
    const [clocks, setClocks] = useState<Clock[]>([]);
    const [sortOption, setSortOption] = useState<string>('Downloads');

    useEffect(() => {
        axios.get(`${config.backendURL}/clocks`)
            .then(response => setClocks(response.data))
            .catch(error => console.error('Error fetching clocks:', error));
    }, []);

    // Handle sorting
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    // Sort clocks based on selected option
    const sortedClocks = [...clocks].sort((a, b) => {
        switch (sortOption) {
            case "Newest":
                // Assuming clocks have a `createdAt` property (ISO string or timestamp)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "Likes":
                return b.likes - a.likes; // Assuming `likes` is a number
            case "Downloads":
                return b.downloads - a.downloads; // Assuming `downloads` is a number
            case 'ClockName':
                return a.name.localeCompare(b.name);
            case 'AuthorName': {
                const authorA = a.author && a.author.length > 0 ? a.author : a.User.username;
                const authorB = a.author && a.author.length > 0 ? a.author : a.User.username;
                return authorA.localeCompare(authorB);
            }
            default:
                return 0;
        }
    });

    return (
        <div className={styles["home-page"]}>
            <div className={styles["sort-container"]}>
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="Newest">Newest</option>
                    <option value="Likes">Likes</option>
                    <option value="Downloads">Downloads</option>
                    <option value="ClockName">Clock Name</option>
                    <option value="AuthorName">Author Name</option>
                </select>
            </div>

            <ClockList clocks={sortedClocks}/>
        </div>
    );
};

export default HomePage;
