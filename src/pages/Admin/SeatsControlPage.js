import { useParams } from "react-router-dom";
import SeatsMap from "../../components/CleanSeatsMap";
import { useState } from "react";

import styles from "../Event/SeatReservation.module.css";

const SeatsControlPage = () => {

    const {eventId} = useParams();

    const [seats, setSeats] = useState([]);



    return (
        <div  className={styles.container}>
            <div className={styles.seatMapWrapper}>
            <SeatsMap mode="control" seats={seats} setSeats={setSeats}/>
            </div>
        </div>
    )
    

};

export default SeatsControlPage;