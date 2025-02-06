import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Api";
import Utils from "../../components/Utils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import styles from "./AdminTickets.module.css"


const AdminTicketsList = () => {

    document.title = "Статистика билетов";

    const { eventId } = useParams();

    const [selectedEvent, setEvent] = useState('');

    const [ticketsInfo, setTicketsInfo] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchData = async () => {
            try{
                const [ticketsRes, eventRes] = await Promise.all([
                    api.get(`/api/tickets/${eventId}/byEvent`, {
                        headers: {
                            "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                        }}),
                    api.get(`/api/events/${eventId}`)]);
                
                const ticketsData = ticketsRes.data;
                setEvent(eventRes.data);

                const ticketDetailsPromises = ticketsData.map(async (ticket) => {

                    const [sectorReq, visitorReq, seatReq] = await Promise.all([
                        api.get(`/api/events/${ticket.eventId}/${ticket.sectorId}`),
                        api.get(`/api/visitor/${ticket.visitorId}`),
                        api.get(`/api/events/${ticket.eventId}/${ticket.sectorId}/${ticket.seatId}`)
                    ]);

                    return {
                        uuid: ticket.uuid,
                        visitor: `${visitorReq.data.surname} ${visitorReq.data.name} ${visitorReq.data.fathername}`,
                        sector: sectorReq.data.name,
                        sectorColor: sectorReq.data.color,
                        created: Utils.formatDate(ticket.created),
                        seat: seatReq.data.rowAndSeatNumber,
                        status: ticket.ticketStatus
                    };
                });

                const detailedTickets = await Promise.all(ticketDetailsPromises);
                setTicketsInfo(detailedTickets);

                return
            }catch(err){
                setError(err.response?.data?.message);
            }finally{
                setLoading(false)
            }
        }
        fetchData();


    }, [eventId]);

    const exportExcel = () => {

        const data = [];
        data.push(["uuid", "ФИО", "Сектор", "Время брони", "Ряд-Место", "Статус"]);
        ticketsInfo.forEach(item => {
            data.push([item.uuid, item.visitor, item.sector, item.created, item.seat, item.status]);
        })
        

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Лист1");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, `tickets-${selectedEvent.name}-${(new Date(Date.now())).toLocaleDateString().replace("/", "0")}.xlsx`);
    };

    const banTicket = (ticket) => {
        if (window.confirm(`Уверены, что хотите отозвать билет у ${ticket.visitor}?`)){
            try{
                api.post(`/api/tickets/${ticket.uuid}/ban`, {}, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("CULT_JWT")}` 
                    }
                }).then(() => {window.location.reload()});
            }catch(err){
                setError(err.response?.data?.message);
            }
            
        }
    };


    if (loading) {
        return <h1>Загрузка...</h1>
    };

    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Статистика по билетам за мероприятие {selectedEvent.name}</h1>
            <button className={styles.exportButton} onClick={exportExcel}>Выгрузить в Excel</button>
            {error && <p className={styles.error}>{error}</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Сектор</th>
                        <th>Время брони</th>
                        <th>Ряд-Место</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketsInfo.map((ticketInfo) => (
                        <tr key={ticketInfo.uuid} className={styles.row}>
                            <td>{ticketInfo.visitor}</td>
                            <td style={{ color: ticketInfo.sectorColor }}>{ticketInfo.sector}</td>
                            <td>{ticketInfo.created}</td>
                            <td>{ticketInfo.seat}</td>
                            <td>
                                <button disabled={ticketInfo.status === "USED"}
                                    className={styles.banButton} 
                                    onClick={() => banTicket(ticketInfo)}
                                >
                                    Отозвать билет
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTicketsList;