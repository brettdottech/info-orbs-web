import {useEffect, useState} from 'react';
import axios from 'axios';
import {Clock} from '../../types/Clock.ts';
import styles from './HomePage.module.css'; // Import the new CSS file
import config from "../../config.ts";
import ClockList from "./ClockList.tsx";

const HomePage = () => {
    const [clocks, setClocks] = useState<Clock[]>([]);

    useEffect(() => {
        axios.get(`${config.backendURL}/clocks`)
            .then(response => setClocks(response.data))
            .catch(error => console.error('Error fetching clocks:', error));
    }, []);

    return (
        <div className={styles["home-page"]}>
            <ClockList clocks={clocks}/>
        </div>
    );
};

export default HomePage;
