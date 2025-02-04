import { useState } from "react";
import SeatsMap from "../../components/CleanSeatsMap";

const SeatReservationPage = () => {

    const mode = "select";

    const [seats, setSeats] = useState([]);

    return (

        <div>
            <h1>Выбор места</h1>
            <p>Выберите место, которое относится к выбранному сектору</p>
            <SeatsMap mode={mode} seats={seats} setSeats={setSeats}/>

        </div>
    );

};

export default SeatReservationPage;