import styles from "./ClockTimeCard.module.css";
import {Clock} from "../../types/Clock.ts";
import {useEffect, useState} from "react";
import Card from "../../components/Card.tsx";
import config from "../../config.ts";

type ClockTimeCardProps = {
    clock: Clock,
    secondHandColor: string,
    overrideColor: string,
}

const ClockTimeCard = ({clock, secondHandColor, overrideColor}: ClockTimeCardProps) => {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [seconds, setSeconds] = useState(0);

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
            setSeconds(now.getSeconds());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const hasSecondHandColor = (secondHandColor !== '#000' && secondHandColor !== '#000000');
    const hasColorOverride = (overrideColor !== '#000' && overrideColor !== '#000000');

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

            const url = `${config.backendURL}/images/${clock.id}`

            return (
                <div key={index}
                     className={hasColorOverride ? styles["clock-time-image-frame-override"] : styles["clock-time-image-frame"]}
                     style={hasColorOverride ? {'--override-color': overrideColor} as React.CSSProperties : undefined}>
                    <div hidden={!hasSecondHandColor} className={styles['arc-rotate']} style={{
                        transform: `translate(-50%, -50%) scale(101%) rotate(${(seconds / 60) * 360}deg`
                    }}>
                        <div className={styles['arc-rect']} style={{
                            backgroundColor: secondHandColor,
                        }}></div>
                    </div>
                    <img
                        key={index}
                        src={`${url}/${imageFileName}`}
                        alt={char}
                    />
                </div>
            );
        });
    };

    return (
        <Card className={styles['clock-time-card']}>
            <div className={styles["clock-time"]}>
                {renderTimeAsImages(currentTime)}
            </div>
        </Card>
    );
}

export default ClockTimeCard;