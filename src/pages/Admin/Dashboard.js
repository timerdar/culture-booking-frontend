import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";

import styles from "../Event/Events.module.css";


const AdminDashboardPage = () => {


    document.title = "Панель администратора";

    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState([]);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);

    const navigate = useNavigate();
    
    if (localStorage.getItem("CULT_JWT") === null){
        window.location.href = '/admin/login';
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await api.get('/api/events/all');
                const data = response.data;
                setEvents(data);


                const stats = await Promise.all(
                    data.map(async (event) => {
                        const statResponse = await api.get(`/api/events/${event.id}/statistics`);
                        const statData = statResponse.data;
                        return {id: event.id, free: statData.unreservedCount, reserved: statData.reservedCount};
                    })
                );

                const statsObject = stats.reduce((acc, stat) => {
                    acc[stat.id] = {
                        res: stat.reserved,
                        free: stat.free
                    };
                    return acc;
                  }, {});
                  setStatistics(statsObject);
            }catch (err) {
                setError(`Не удалось загрузить мероприятия: ${err.response?.data?.message}`);
            }finally {
                setLoading(false);
            };
        };
        fetchEvents();
    }, []);

    const hideEvent = async (eventId) => {
        try{
            await api.post(`/api/events/${eventId}/hide`, {}, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                }
            });
            setEvents(prevEvents =>
                prevEvents.map(event =>
                event.id === eventId ? { ...event, visible: false } : event
              ));
        }catch (err){
            setError(`Не удалось поменять меропритие: ${err.response?.data?.message}`)
        }
    };

    const showEvent = async (eventId) => {
        try{
            await api.post(`/api/events/${eventId}/show`, {}, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                }
            });
            setEvents(prevEvents =>
                prevEvents.map(event =>
                event.id === eventId ? { ...event, visible: true } : event
              ));
        }catch (err){
            setError(`Не удалось поменять меропритие: ${err.response?.data?.message}`)
        }
    };


    const deleteEvent = async (eventId) => {
        try{
            if (window.confirm("Вы уверены, что хотите удалить мероприятие?")){
                if (window.confirm("Вы ТОЧНО уверены, что хотите удалить мероприятие?")){
                    await api.delete(`/api/events/${eventId}`, {
                        headers: {
                            "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                        }
                    });
                }
            }
            window.location.reload();
        }catch(err){
            setError(`Не удалось удалить меропритие: ${err.response?.data?.message}`)
        }
    };

    if (loading) {
        return <div>Загрузка...</div>
    }


    return (
        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            <h1 className={styles.title}>Основная панель администратора</h1>
            <button className={styles.registerButton} onClick={() => {navigate("/admin/createEvent")}}>Создать мероприятие</button>
            <p>Для получения/изменения мероприятия необходимо выбрать из списка</p>
            {error && <p style={{color: "red"}}>{error}</p>}
            <ul className={styles.eventList}>
            {events.map((event) => (
                <li className={styles.eventItem} key={event.id}>
                    <p className={styles.description}>{event.name} - {Utils.formatDate(event.date)}</p>
                    <p className={styles.description}>Занято {statistics[event.id].res} Свободно {statistics[event.id].free}</p>
                    <p className={styles.description}>Мероприятие {event.visible ? <b>открыто</b> : <b>скрыто</b>}</p>
                    <button className={styles.registerButton} onClick={() => {hideEvent(event.id)}}>Скрыть</button>
                    <button className={styles.registerButton} onClick={() => {showEvent(event.id)}}>Показать</button>
                    <button className={styles.registerButton} onClick={() => {deleteEvent(event.id)}}>Удалить</button>
                    <button className={styles.registerButton} onClick={() => {navigate(`/admin/${event.id}/tickets/`)}}>Открыть статистику</button>
                </li>
            ))}
            </ul>
        </div>
    );

};

export default AdminDashboardPage;