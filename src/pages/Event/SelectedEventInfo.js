import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";

import styles from "./SelectedEvent.module.css";

const SelectedEventPage = () => {



    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState("");
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    const imgUrl = `${process.env.REACT_APP_BASE_URL}/api/events/${id}/poster`;

    useEffect(() => {

        const fetchEvent = async () => {
            try{
                const response = await api.get(`/api/events/${id}`);
                setEvent(response.data);
                document.title = response.data.name;
                const resp1 = await api.get(`/api/admin/${response.data.adminId}`);
                setAdmin(resp1.data);
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
        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <h1 className={styles.title}>{event.name}</h1>
            <div className={styles.posterContainer}>
                <img src={imgUrl} alt="Афиша" className={styles.poster} />
            </div>
            <h2 className={styles.subtitle}>Дата проведения - {Utils.formatDate(event.date)}</h2>
            <h2 className={styles.subtitle}>Описание</h2>
            <p className={styles.description}>{event.description}</p>
            <p className={styles.adminInfo}>
                По вопросам: {admin?.name} {admin?.mobilePhone}
            </p>
            <button 
                className={styles.registerButton} 
                onClick={() => navigate(`/events/${id}/identify`)}
            >
                Зарегистрироваться
            </button>
        </div>
    );

};

export default SelectedEventPage;