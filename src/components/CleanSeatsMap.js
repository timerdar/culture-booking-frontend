import { useEffect, useState } from "react";
import generateSeats from "./SeatsGenerator";
import api from "./Api";
import '../App.css';
import { useParams } from "react-router-dom";


const SeatsMap = (params) => {

    const mode = params.mode;

    const [seats, setSeats] = useState([]);
    const [error, setError] = useState(null);

    const { eventId, sectorId } = useParams();


    
    
    //Создаем массив дефолнтых мест
    

    //При странице выбора включаем только нужные места
    useEffect(() => {
        
        const genSeats = generateSeats(mode);
        
        if (mode === "select"){
            const newSeats = [];

            const fetchSector = async () => {
                try{
                    //подгружаем места выбранного сектора и обновляем пул мест
                    const response = await api.get(`/api/events/${eventId}/${sectorId}/seats`);
                    const fetchedSeats = response.data;

                    fetchedSeats.forEach(fseat => {
                        genSeats.forEach(row => {
                            const nr = [];
                            row.forEach((seat) => {
                                if (`${seat.row}-${seat.index}` === fseat.rowAndSeatNumber) {
                                    seat.seatId = fseat.id;
                                    seat.reserved = fseat.reserved;
                                    seat.color = localStorage.getItem("SECTOR_COLOR");
                                };
                                console.log(seat);
                                
                                nr.push(seat);
                            });
                            newSeats.push(nr);
                        });
                    });
                    setSeats(newSeats);
                }catch (err){
                    console.log(err);
                    setError(err.response?.data?.message);
                }
            }
            
            fetchSector();
        }else{
            return;
        }
    }, [mode, eventId, sectorId])


    const handleSeatClick = (clickedSeat) => {
        if (mode === "select") {
            if(!clickedSeat.reserved && clickedSeat.type === "seat"){
                if (window.confirm(`Вы действительно хотите выбрать ${clickedSeat.row} ряд ${clickedSeat.index} место?`)){
                    console.log('Выбрано место', clickedSeat.row, "-", clickedSeat.index);
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
        <div>
          <h2>Карта рассадки</h2>
          <div>
            {seats.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((seat, seatIndex) => (
                    <button
                        class="seat"
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