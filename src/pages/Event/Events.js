import React, {useEffect, useState} from "react";
import Utils from "../../components/Utils";

import {Link} from "react-router-dom"
import api from "../../components/Api";
import styles from "./Events.module.css";

const EventsPage = () => {

    document.title = "Мероприятия в ДК Орджоникидзе";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/api/events');
                setEvents(response.data);
            } catch (err) {
                setError(`Не удалось загрузить мероприятия: ${err.response?.data?.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    if (loading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            <h1 className={styles.title}>Доступные мероприятия</h1>
            <p className={styles.description}>
                Ниже представлен список мероприятий с датами проведения. Для просмотра и бронирования места нажмите на нужный элемент списка.
            </p>
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.eventList}>
                {events.map((event) => (
                    <li key={event.id} className={styles.eventItem}>
                    <Link to={`/events/${event.id}`}  className={styles.eventLink}>
                    <b>{event.name}</b> - {Utils.formatDate(event.date)}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPage;