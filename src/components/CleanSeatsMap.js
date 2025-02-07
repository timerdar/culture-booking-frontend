import { useEffect, useState } from "react";
import generateSeats from "./SeatsGenerator";
import api from "./Api";
import '../App.css';
import { useParams } from "react-router-dom";

import styles from "../pages/Event/SeatReservation.module.css";


const SeatsMap = (params) => {

    const mode = params.mode;

    //const [seats, setSeats] = useState([]);
    const seats = params.seats;
    const setSeats = params.setSeats;
    const [error, setError] = useState(null);

    const [isAllReserved, setAllRes] = useState(false);
    const [sectorColor, setSectorColor] = useState('');
    const { eventId, sectorId } = useParams();


    
    
    //Создаем массив дефолнтых мест
    

    //При странице выбора включаем только нужные места
    useEffect(() => {
        
        const genSeats = generateSeats(mode);
        
        if (mode === "select"){
            const newSeats = [];


            const fetchSector = async () => {
                try{
                    const colorResponse = await api.get(`/api/events/${eventId}/${sectorId}`)
                    
                    

                    //подгружаем места выбранного сектора и обновляем пул мест
                    const response = await api.get(`/api/events/${eventId}/${sectorId}/seats`);
                    const fetchedSeats = response.data;

                    let reservedCount = 0;

                    genSeats.forEach(row => {
                        const newRow = [];
                        row.forEach(seat => {
                            if (fetchedSeats.some(fseat => `${seat.row}-${seat.index}` === fseat.rowAndSeatNumber)){
                                const fseat = fetchedSeats.find(fseat => `${seat.row}-${seat.index}` === fseat.rowAndSeatNumber);
                                seat.seatId = fseat.id;
                                seat.reserved = fseat.reserved;
                                setSectorColor(colorResponse.data.color);

                                if(seat.reserved){
                                    seat.color = "#5e5d5d"
                                    reservedCount ++;
                                }else{
                                    seat.color = colorResponse.data.color;
                                }
                            }
                            newRow.push(seat);
                        });
                        newSeats.push(newRow);
                    })
                    if (reservedCount === fetchedSeats.length){
                        setAllRes(true);
                    }
                    setSeats(newSeats);
                }catch (err){
                    if (err.response.status === 404){
                        setSeats(genSeats);
                        setError('К сожалению, свободных мест нет :(')
                    }else {
                        console.log(err);
                        setError(err.response?.data?.message);
                    }
                }
            }
            
            fetchSector();
        }else{
            setSeats(genSeats);
            return;
        }
    }, [mode, eventId, sectorId])


    const handleSeatClick = async (clickedSeat) => {
        if (mode === "select") {
            if(!clickedSeat.reserved && clickedSeat.type === "seat"){
                if (window.confirm(`Вы действительно хотите выбрать ${clickedSeat.row} ряд ${clickedSeat.index} место?`)){
                    
                    try{

                        const ticket = await api.post(
                            '/api/tickets',
                            {
                                visitor: {
                                    name: localStorage.getItem("NAME"),
                                    surname: localStorage.getItem("SURNAME"),
                                    fathername: localStorage.getItem("FATHERNAME"),
                                },
                                eventId: eventId,
                                sectorId: sectorId,
                                seatId: clickedSeat.seatId
                            }
                        );
                        localStorage.clear();
                        window.location.href=`/tickets/${ticket.data.uuid}`
                    }catch (err){
                        setError(err.response?.data?.message);
                    }
                
                }
            }
            
        }else{ //распределение мест
            const color = params.selectedColor;
            const allSeats = [...seats];
            allSeats.forEach(row => {
                const foundedSeat = row.find(seat => `${seat.row}-${seat.index}` === `${clickedSeat.row}-${clickedSeat.index}`);
                if (foundedSeat) {
                    foundedSeat.color = color;
                };
            });
            setSeats(allSeats);
        }};


    const getSeatStyle = (seat) => {
        if (seat.type === "aisle") {
            return { border: "none", backgroundColor: 'transparent', cursor: 'default' }; // Дорожка
        }
        if (mode === "select"){
            if (seat.seatId){
                return { backgroundColor: seat.color, cursor: 'pointer' };    
            }else{
                return { backgroundColor: seat.color, cursor: 'not-allowed'};
            }
        }else{
            return { backgroundColor: seat.color, cursor: 'pointer' };
        }
    };

    return (
        <div className={styles.container}>
          <h2 className={styles.title}>Карта рассадки</h2>
          {error && <p className={styles.error}>{error}</p>}
          {isAllReserved && mode === "select" && <p className={styles.error}>К сожалению, все места выбранного сектора заняты</p>}
          <div>
            <button style={{backgroundColor: sectorColor}}>_</button>Места выбранного сектора
            <button style={{backgroundColor: "#b5b5b5"}}>_</button>Места другого сектора
            <button style={{backgroundColor: "#5e5d5d"}}>_</button>Занятые места выбранного сектора
          </div>
          <p className={styles.title}>Сцена</p>
          <div>
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((seat, seatIndex) => (
                    <button
                        class="seat"
                        className={`${styles.seat} ${seat.reserved ? styles.reserved : ""} ${seat.type === "aisle" ? styles.aisle : ""}`}
                        key={`${rowIndex}-${seatIndex}`}
                        style={getSeatStyle(seat)}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.reserved && seat.sectorId}
                    >
                      {seat.type === "seat"?`${seat.row}-${seat.index}`:''}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      );
};

export default SeatsMap;