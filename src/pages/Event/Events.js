import React, {useEffect, useState} from "react";
import Utils from "../../components/Utils";

import {Link} from "react-router-dom"
import api from "../../components/Api";

const EventsPage = () => {

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
        <div>
            <h1>Доступные мероприятия</h1>
            <p>
                Ниже представлен список мероприятий с датами проведения. Для просмотра и бронирования места нажмите на нужный элемент списка.
            </p>
            {error && <p style={{color: "red"}}>{error}</p>}
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                    <Link to={`/events/${event.id}`}>
                    <b>{event.name}</b> - {Utils.formatDate(event.date)}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPage;