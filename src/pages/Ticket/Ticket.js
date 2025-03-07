import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";

import styles from "./Ticket.module.css";

const TicketPage = () => {

    const { uuid } = useParams();

    document.title = "Просмотр билета";

    const imgUrl = `${process.env.REACT_APP_BASE_URL}/api/tickets/generate/qr/${uuid}`;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [ticket, setTicket] = useState(null);
    
    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {

        const fetchTicket = async () => {

            try{
                const ticketReq = await api.get(`/api/tickets/${uuid}/info`);
                if (ticketReq.data.event) {
                    const eventDateTime = new Date(ticketReq.data.event.date);
                    const now = new Date();    
                    const diffMinutes = (eventDateTime - now) / 60000; 
                    console.log(diffMinutes <= 60, diffMinutes);
                    setIsButtonActive(diffMinutes <= 60);
                    if (ticketReq.data.status === "CREATED"){
                        downloadPdf(ticketReq.data.uuid);
                    }
                }
                setTicket(ticketReq.data);
            }catch(err){
                setError(err.response?.data?.message);
            }
            setLoading(false);
        };
        fetchTicket();        
    }, [uuid]);

    const cancelTicket = (ticket) => {
        if (window.confirm("Вы действительно хотите отменить билет?")){
            try{
                api.post(`/api/tickets/${ticket.uuid}/cancel`)
                .then(() => {window.location.reload()});;;
            }catch(err){
                console.log(err)
                setError(err.response?.data?.message);
            }
        }
    };

    const usedTicket = (ticket) => {
        if (window.confirm("Использовать билет?")){
            try{
                api.post(`/api/tickets/${ticket.uuid}/check`)
                .then(() => {window.location.reload()});;
            }catch(err){
                setError(err.response?.data?.message);
            }
        }
    };

    const downloadPdf = async (uuid) => {
        const response = await api.get(`/api/tickets/generate/pdf/${uuid}`, {responseType: "blob"});
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${uuid}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return <h1>Загрузка</h1>
    }

    //CREATED,
    //CANCELED,
    //USED,
    //BANNED

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Билет</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {ticket.status === "BANNED" && 
            <div className={styles.status + " " + styles.ticketStatusBanned}>
                <h1>БИЛЕТ ОТОЗВАН АДМИНИСТРАТОРОМ!</h1>
                <p>Для подробной информации свяжитесь с администратором</p>
            </div>
            }
            {ticket.status === "USED" &&
            <div className={styles.status + " " + styles.ticketStatusUsed}>
                <h1>БИЛЕТ УЖЕ АКТИВИРОВАН ПРИ ВХОДЕ</h1>
            </div>
            }
            {ticket.status === "CANCELED" &&
            <div className={styles.status + " " + styles.ticketStatusCanceled}>
                <h1>БИЛЕТ ОТМЕНЕН И НЕДЕЙСТВИТЕЛЕН</h1>
            </div>
            }
            <button className={styles.button} onClick={() => downloadPdf()}>Скачать PDF</button>

            <div className={styles.ticketDetails}>
                <p>Посетитель: <span>{`${ticket.visitor.surname} ${ticket.visitor.name} ${ticket.visitor.fathername}`}</span></p>
                <p>Мероприятие: <span>{ticket.event.name}</span></p>
                <p>Дата проведения: <span>{Utils.formatDate(ticket.event.date)}</span></p>
                <p>Сектор: <span>{ticket.sector.name}</span> Ряд <span>{ticket.seat.split("-")[0]}</span> Место <span>{ticket.seat.split("-")[1]}</span></p>
            </div>
            
            <img className={styles.qrCode} src={`${imgUrl}`} alt="ticket_qr" />
            
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => {cancelTicket(ticket)}}>Отменить билет</button>
                <button
                    className={styles.button}
                    onClick={() => {usedTicket(ticket)}}
                    disabled={!isButtonActive}
                    >
                    {isButtonActive ? "НАЖМИ ПРИ ВХОДЕ В ЗАЛ" : "Ожидание"}
                </button>
                    {!isButtonActive && <p>Кнопка станет активной за 40 минут до мероприятия</p>}
            </div>
                        
            </div>
    );
};

export default TicketPage;

/*
            
*/