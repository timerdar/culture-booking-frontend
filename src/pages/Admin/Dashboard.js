import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api";


const AdminDashboardPage = () => {

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

    if (loading) {
        return <div>Загрузка...</div>
    }


    return (
        <div>
            <h1>Основная панель администратора</h1>
            <button onClick={() => {navigate("/admin/createEvent")}}>Создать мероприятие</button>
            <p>Для получения/изменения мероприятия необходимо выбрать из списка</p>
            {error && <p style={{color: "red"}}>{error}</p>}
            <ul>
            {events.map((event) => (
                <li key={event.id}>
                    <p>{event.name} - {event.date}</p>
                    <p>Занято {statistics[event.id].res} Свободно {statistics[event.id].free}</p>
                    <p>Мероприятие {event.visible ? <b>открыто</b> : <b>скрыто</b>}</p>
                    <button onClick={() => {hideEvent(event.id)}}>Скрыть</button>
                    <button onClick={() => {showEvent(event.id)}}>Показать</button>
                    <button onClick={() => {}}>Выгрузить статистику</button>
                    {console.log(event)}
                </li>
            ))}
            </ul>
        </div>
    );

};

export default AdminDashboardPage;