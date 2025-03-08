import { useParams } from "react-router-dom";
import SeatsMap from "../../components/CleanSeatsMap";
import { useEffect, useState } from "react";

import styles from "../Event/SeatReservation.module.css";
import styles1 from "../Admin/AdminTickets.module.css";
import api from "../../components/Api";

const SeatsControlPage = () => {

    const {eventId} = useParams();

    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [stat, setStat] = useState([]);

    useEffect(()=> {
        const fetchStats = async () => {
            try{
                const stats = await api.get(`/api/events/${eventId}/detailed-statictics`)
                setStat(stats.data);

            }catch (err){
                setError(err.response?.data?.message)
            }finally{
                setLoading(false)
            }
        };
        fetchStats();
    }
    , [eventId]);

    if (loading) {
        return <div>Загрузка...</div>
    }

    return (
        <div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <h1 className={styles.title}>Сводная таблица</h1>
            <div className={styles1.container}>
            <table className={styles1.table}>
                <thead>
                    <tr>
                        <th>Сектор</th>
                        <th>Цвет</th>
                        <th>Свободно</th>
                        <th>Занято</th>
                        <th>Всего</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stat.map(sector => (
                            <tr key={sector.sector.name}>
                                <td>{sector.sector.name}</td>
                                <td style={{backgroundColor: sector.sector.color}}></td>
                                <td>{sector.unreservedCount}</td>
                                <td>{sector.reservedCount}</td>
                                <td>{sector.reservedCount + sector.unreservedCount}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
                       
            <div className={styles.seatMapWrapper}>
                <SeatsMap mode="control" seats={seats} setSeats={setSeats}/>

            </div>
        </div>
    )
    

};

export default SeatsControlPage;