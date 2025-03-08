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

    const [ticketsInfo, setTicketsInfo] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchData = async () => {
            try{
                const [ticketsRes, eventRes] = await Promise.all([
                    api.get(`/api/tickets/${eventId}/byEvent`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("CULT_JWT")}` }
                    }),
                    api.get(`/api/events/${eventId}`)
                ]);

                setEvent(eventRes.data);

                const ticketsData = ticketsRes.data;
                const detailedTickets = await Promise.all(
                    ticketsData.map(ticket => api.get(`/api/tickets/${ticket.uuid}/info`).then(res => res.data))
                );
                setTicketsInfo(detailedTickets);
                console.log(detailedTickets);
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
            data.push([item.uuid, `${item.visitor.surname} ${item.visitor.name} ${item.visitor.fathername}`, item.sector, Utils.formatDate(item.created), item.seat, item.status]);
        })
        

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Лист1");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, `tickets-${selectedEvent.name}-${(new Date(Date.now())).toLocaleDateString().replace("/", "0")}.xlsx`);
    };

    const banTicket = (ticket) => {
        if (window.confirm(`Уверены, что хотите отозвать билет у ${ticket.visitor.surname} ${ticket.visitor.name} ${ticket.visitor.fathername}?`)){
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

    const usedTicket = (ticket) => {
        if (window.confirm("Отметить присутствие?")){
            try{
                api.post(`/api/tickets/${ticket.uuid}/check`)
                .then(() => {window.location.reload()});;
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
                    {ticketsInfo && ticketsInfo.map((ticketInfo) => (
                        <tr key={ticketInfo.uuid} className={styles.row}>
                            <td>{ticketInfo.visitor.surname} {ticketInfo.visitor.name} {ticketInfo.visitor.fathername}</td>
                            <td style={{ backgroundColor: ticketInfo.sectorColor, color: "black" }}>{ticketInfo.sector}</td>
                            <td>{Utils.formatDate(ticketInfo.created)}</td>
                            <td>{ticketInfo.seat}</td>
                            <td>
                                <button disabled={ticketInfo.status === "USED"}
                                    className={styles.banButton} 
                                    onClick={() => banTicket(ticketInfo)}
                                >
                                    Отозвать билет
                                </button>

                                <button disabled={ticketInfo.status === "USED"}
                                    className={styles.checkButton} 
                                    onClick={() => usedTicket(ticketInfo)}
                                >
                                    Отметить присутстивие
                                </button>
                                <button
                                    className={styles.checkButton} 
                                    onClick={() => window.open(`/tickets/${ticketInfo.uuid}`, '_blank')}
                                >
                                    Посмотреть билет
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