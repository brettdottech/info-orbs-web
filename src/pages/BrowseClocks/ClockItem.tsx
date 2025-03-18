import styles from './ClockItem.module.css';
import {Link} from "react-router-dom";
import LikeToggle from "../../components/LikeToggle.tsx";
import DownloadsCounter from "../../components/DownloadsCounter.tsx";
import {Clock} from "../../types/Clock.ts";
import config from "../../config.ts";

type ClockItemProps = {
    clock: Clock
}

const ClockItem = ({clock}: ClockItemProps) => {
    let url = `${config.backendURL}/images/${clock.id}`
    url += `/${Math.floor(Math.random() * 10)}.jpg`;
    const link = `/clock/${clock.id}`;
    return (
        <div key={clock.id} className={styles["clock-card"]}>
            <Link to={link}>
                <img className="w-[150px] h-[150px] object-cover rounded-md bg-gray-700"
                     src={url} alt={clock.name} width="120" height="120"/>
            </Link>
            <div className="font-bold text-xl mt-3">{clock.name}</div>
            <div className="mb-1">
                by {clock.author && clock.author.length > 0 ? clock.author : clock.User.username}
            </div>
            <div className="flex justify-center">
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
}

export default ClockItem;