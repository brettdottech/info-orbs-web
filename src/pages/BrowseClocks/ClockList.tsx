import styles from './ClockList.module.css';
import {Clock} from "../../types/Clock.ts";
import ClockItem from "./ClockItem.tsx";

type ClockListProps = {
    clocks: Clock[]
}

const ClockList = ({clocks}: ClockListProps) => {
    return (
        <div className={styles["clock-list"]}>
            {clocks.map((clock: Clock) => (
                <ClockItem key={clock.id} clock={clock}/>
            ))}
        </div>
    )
};

export default ClockList;