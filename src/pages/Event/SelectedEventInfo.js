import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";

const SelectedEventPage = () => {

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState("");
    const navigate = useNavigate();

    const imgUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${id}/poster`;

    useEffect(() => {

        const fetchEvent = async () => {
            try{
                const response = await api.get(`/api/events/${id}`);
                setEvent(response.data);
            }catch (err){
                setError(err.response?.data?.message);
            }finally{
                setLoading(false);
            }
        };

        
        fetchEvent();
    }, [id])

    if (loading) {
        return <div>Загрузка...</div>
    };

    return (
        <div>
            {error && <p style={{color: "red"}}>{error}</p>}  
            <h1>{event.name}</h1>
            <div>
                <img src={`${imgUrl}`} alt="Афиша"/>
            </div>
            <h2>Дата проведения - {Utils.formatDate(event.date)}</h2>
            <h2>Описание</h2>
            <p>{event.description}</p>
            <button onClick={() => {navigate(`/events/${id}/reservation`)}}>Зарегистрироваться</button>
        </div>
    );

};

export default SelectedEventPage;