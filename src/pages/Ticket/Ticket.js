import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";

import styles from "./Ticket.module.css";

const TicketPage = () => {

    const { uuid } = useParams();

    document.title = "Просмотр билета";

    const imgUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tickets/generate/qr/${uuid}`;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [ticket, setTicket] = useState(null);
    const [event, setEvent] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [sector, setSector] = useState(null);
    const [seat, setSeat] = useState(null);
    const [visitor, setVisitor] = useState(null);

    useEffect(() => {

        const fetchTicket = async () => {

            try{

                const ticketReq = await api.get(`/api/tickets/${uuid}`);
                setTicket(ticketReq.data);
            }catch(err){
                setError(err.response?.data?.message);
            }

        };
        fetchTicket();

    }, [uuid]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventReq, sectorReq, seatReq, visitorReq] =  await Promise.all([
                    api.get(`/api/events/${ticket.eventId}`),
                    api.get(`/api/events/${ticket.eventId}/${ticket.sectorId}`),
                    api.get(`/api/events/${ticket.eventId}/${ticket.sectorId}/${ticket.seatId}`),
                    api.get(`/api/visitor/${ticket.visitorId}`)
                ]);
                setSector(sectorReq.data);
                setSeat(seatReq.data);
                setVisitor(visitorReq.data);
                setEvent(eventReq.data);
                
            }catch(err){
                setError(err.response?.data?.message)
            }
        };
        fetchData();
    }, [ticket]);

    useEffect(() => {
        if (event && event.adminId) {
            const fetchAdmin = async () => {
                try {
                    const resp = await api.get(`/api/admin/${event.adminId}`);
                    setAdmin(resp.data);
                } catch (err) {
                    setError(err.response?.data?.message);
                } finally { 
                    setLoading(false);
                }
            };
            fetchAdmin();
            if (ticket.ticketStatus === "CREATED"){
                downloadPdf();
            }
        }
    }, [event]);


    const cancelTicket = (ticket) => {
        if (window.confirm("Вы действительно хотите отменить билет?")){
            try{
                api.post(`/api/tickets/${ticket.uuid}/cancel`);
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

    const downloadPdf = async () => {
        const response = await api.get(`/api/tickets/generate/pdf/${ticket.uuid}`, {responseType: "blob"});
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
            {ticket.ticketStatus === "BANNED" && 
            <div className={styles.ticketStatus + " " + styles.ticketStatusBanned}>
                <h1>БИЛЕТ ОТОЗВАН АДМИНИСТРАТОРОМ!</h1>
                <p>Для подробной информации свяжитесь с администратором {admin.name} {admin.mobilePhone}</p>
            </div>
            }
            {ticket.ticketStatus === "USED" &&
            <div className={styles.ticketStatus + " " + styles.ticketStatusUsed}>
                <h1>БИЛЕТ ИСПОЛЬЗОВАН</h1>
            </div>
            }
            {ticket.ticketStatus === "CANCELED" &&
            <div className={styles.ticketStatus + " " + styles.ticketStatusCanceled}>
                <h1>БИЛЕТ ОТМЕНЕН И НЕДЕЙСТВИТЕЛЕН</h1>
            </div>
            }
            <button className={styles.button} onClick={() => downloadPdf()}>Скачать PDF</button>

            <div className={styles.ticketDetails}>
                <p>Посетитель: <span>{`${visitor.surname} ${visitor.name} ${visitor.fathername}`}</span></p>
                <p>Мероприятие: <span>{event.name}</span></p>
                <p>Дата проведения: <span>{Utils.formatDate(event.date)}</span></p>
                <p>Сектор: <span>{sector.name}</span> Ряд <span>{seat.rowAndSeatNumber.split("-")[0]}</span> Место <span>{seat.rowAndSeatNumber.split("-")[1]}</span></p>
            </div>
            
            <img className={styles.qrCode} src={`${imgUrl}`} alt="ticket_qr" />
            
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => {cancelTicket(ticket)}}>Отменить билет</button>
                <button className={styles.button} onClick={() => {usedTicket(ticket)}}>Использовать</button>
            </div>
                        
            </div>
    );
};

export default TicketPage;

/*
            
*/