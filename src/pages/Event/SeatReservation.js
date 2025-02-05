import { useState } from "react";
import SeatsMap from "../../components/CleanSeatsMap";

import styles from "./SeatReservation.module.css";

const SeatReservationPage = () => {

    document.title = "Выбор места";

    const mode = "select";

    const [seats, setSeats] = useState([]);

    return (

        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            <h1 className={styles.title}>Выбор места</h1>
            <p className={styles.description}>Выберите место, которое относится к выбранному сектору</p>
            <div className={styles.seatMapWrapper}>
                <div className={styles.seatMapContainer}>
                    <SeatsMap mode={mode} seats={seats} setSeats={setSeats}/> 
                </div>            
            </div>

        </div>
    );

};

export default SeatReservationPage;