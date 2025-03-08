import styles from './AllClockImagesCard.module.css';
import Card from "../../components/Card.tsx";
import {useState} from "react";
import {Clock} from "../../types/Clock.ts";

type AllClockImagesCardProps = {
    clock: Clock;
}
const AllClockImagesCard = ({clock}: AllClockImagesCardProps) => {
    const [isImagesVisible, setImagesVisible] = useState<boolean>(false);

    // TODO fix URLs in DB
    // because this here will not work if the clock is updated -> bad practise
    let url = clock.jpg_url;
    if (url.startsWith("https://github.com")) {
        url = url.replace("github.com", "raw.githubusercontent.com").replace("tree", "refs/heads");
    }

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