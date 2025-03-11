import styles from './AllClockImagesCard.module.css';
import Card from "../../components/Card.tsx";
import {useState} from "react";
import {Clock} from "../../types/Clock.ts";
import config from "../../config.ts";

type AllClockImagesCardProps = {
    clock: Clock;
}
const AllClockImagesCard = ({clock}: AllClockImagesCardProps) => {
    const [isImagesVisible, setImagesVisible] = useState<boolean>(false);

    const url = `${config.backendURL}/images/${clock.id}`

    return (
        <Card>
            <h4 onClick={() => setImagesVisible(!isImagesVisible)} style={{cursor: 'pointer'}}>
                All Images {isImagesVisible ? '-' : '+'}
            </h4>
            {isImagesVisible && (
                <div className={styles["clock-detail-images"]}>
                    {[...Array(12)].map((_, idx) => (
                        // idx === 10 ? null : (
                        <img key={idx} src={`${url}/${idx}.jpg`} alt={`${clock.name} - ${idx}`}/>
                        // )
                    ))}
                </div>)}

        </Card>
    );
};

export default AllClockImagesCard;