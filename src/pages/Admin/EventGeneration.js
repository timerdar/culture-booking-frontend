import { useState } from "react";
import SeatsMap from "../../components/CleanSeatsMap";
import SectorList from "../../components/SectorList";
import api from "../../components/Api";

import styles1 from "../Event/SeatReservation.module.css";
import styles2 from "../Event/Identify.module.css";

const EventGenerationPage = () => {

    document.title = "Создание мероприятия";

    const [name, setName] = useState('');
    const [poster, setPoster] = useState(null);
    const [date, setDate] = useState('');
    const [desctiption, setDescription] = useState('');

    const [error, setError] = useState(null);

    const [seats, setSeats] = useState([]);

    const [sectors, setSectors] = useState([]);



    const [sectorColor, setSectorColor] = useState('#000000');

    const handleSubmit = (event) => {
        event.preventDefault();

        const createEvent =  async () => {
            const formattedSectors = [];
            if (sectors.length === 0){
                setError("Разделите места по секторам");
                return;
            }
            sectors.forEach((sector) => {
                const formattedSeats = [];
                seats.forEach((row) => {
                    row.forEach((seat) => {
                        if (seat.color === sector.color && seat.row && seat.index){
                            formattedSeats.push({rowAndSeatNumber: `${seat.row}-${seat.index}`})
                        }
                    })
                })
                if (formattedSeats.length !== 0){
                    formattedSectors.push(
                        {
                            name: sector.name,
                            color: sector.color,
                            seats: formattedSeats
                        }
                    );
                };
            });

            try{
                const eventCreation = await api.post('/api/events', {
                    name: name,
                    description: desctiption,
                    adminId: localStorage.getItem("ADMIN_ID"),
                    date: date,
                    sectors: formattedSectors
                },  {
                    mode: "cors",
                    headers: {
                        "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                    }
                })

                if (poster){
                    
                    const formData = new FormData();
                    formData.append("file", poster);
                    await api.post(`/api/events/poster?eventId=${eventCreation.data.id}`, formData, {
                        headers : {
                            "Authorization" : `Bearer ${localStorage.getItem("CULT_JWT")}`
                        }
                    });
                }
                

                window.location.href = '/admin/dashboard';
            }catch (err) {
                setError(err.response?.data?.message);
            }
        };

        createEvent();
    }


    return (

        <div className={styles1.container}>
            <div className={styles1.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles1.logo}/>
            </div>
            <h1 className={styles1.title}>Создание мероприятия</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            <p className={styles1.description}>Для создания мероприятия необходимо заполнить <b>все</b> поля, создать сектора и распределить посадочные места по секторам.</p>
            <form className={styles2.container} onSubmit={handleSubmit}>
                
                <input 
                    type="text"
                    required
                    placeholder="Название мероприятия"
                    value={name}
                    autoComplete="off"
                    className={styles2.inputField}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    value={desctiption}
                    placeholder="Описание"
                    rows={5}
                    cols={25}
                    autoComplete="off"
                    required          
                    className={styles2.inputField}
                    onChange={(e) => setDescription(e.target.value)}            
                />
                 
                <input
                    type="file"
                    required
                    className={styles2.submitButton}
                    placeholder="Афиша для мероприятия"
                    autoComplete="off"
                    onChange={(e) => setPoster(e.target.files[0])}
               />
                <p className={styles1.description}>Дата и время проведения мероприятия</p>
                <input 
                    type='datetime-local'
                    className={styles2.inputField}
                    required
                    placeholder="Дата мероприятия"
                    autoComplete="off"
                    value={date}
                    onChange={(e) => setDate(e.target.value)} 
                />

                    
                <button type="submit" className={styles2.submitButton}>Создать мероприятие</button>
            </form>
            <h2 className={styles1.title}>Распределение мест по секторам</h2>
            <p className={styles1.description}>
                Ниже находится таблица, в которую необходимо добавлять новый сектор (факультет) и выбирать цвет.
                Факультет, выделенный жирным цветом - выбранный. Его цветом будут помечаться места.
            </p>
            <p className={styles1.description}>
                <b>Факультеты</b>, которым не выделили мест - будут удалены.
            </p>
            <p className={styles1.description}>
                <b>Места</b>, которые не относятся ни к какому из факультетов - не будут доступны для бронирования.
            </p>

            <SectorList 
                mode="assign"
                selectedColor={sectorColor}
                setSelectedColor={setSectorColor}
                sectors={sectors}
                setSectors={setSectors}
            />
            <div className={styles1.seatMapWrapper}>
                    <SeatsMap 
                    mode="assign"
                    selectedColor={sectorColor}
                    seats={seats}
                    setSeats={setSeats}         
                    />
                </div>
            
        </div>
    );
};

export default EventGenerationPage;