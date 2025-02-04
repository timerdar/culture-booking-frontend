import { useState } from "react";
import SeatsMap from "../../components/CleanSeatsMap";
import SectorList from "../../components/SectorList";
import api from "../../components/Api";


const EventGenerationPage = () => {

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
                        if (seat.color === sector.color){
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
                        mode: "cors",
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

        <div>
            <h1>Создание мероприятия</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            <p>Для создания мероприятия необходимо заполнить <b>все</b> поля, создать сектора и распределить посадочные места по секторам.</p>
            <form onSubmit={handleSubmit}>
                
                <input 
                    type="text"
                    required
                    placeholder="Название мероприятия"
                    value={name}
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    value={desctiption}
                    placeholder="Описание"
                    rows={5}
                    cols={25}
                    autoComplete="off"
                    required          
                    onChange={(e) => setDescription(e.target.value)}            
                />
                 
                <input
                    type="file"
                    required
                    placeholder="Афиша для мероприятия"
                    autoComplete="off"
                    onChange={(e) => setPoster(e.target.files[0])}
               />

                <input 
                    type='datetime-local'
                    required
                    placeholder="Дата мероприятия"
                    autoComplete="off"
                    value={date}
                    onChange={(e) => setDate(e.target.value)} 
                />

                <button type="submit">Создать мероприятие</button>
            </form>
            <h2>Распределение мест по секторам</h2>
            <p>
                Ниже находится таблица, в которую необходимо добавлять новый сектор (факультет) и выбирать цвет.
                Факультет, выделенный жирным цветом - выбранный. Его цветом будут помечаться места.
            </p>
            <p>
                <b>Факультеты</b>, которым не выделили мест - будут удалены.
            </p>
            <p>
                <b>Места</b>, которые не относятся ни к какому из факультетов - не будут доступны для бронирования.
            </p>

            <SectorList 
                mode="assign"
                selectedColor={sectorColor}
                setSelectedColor={setSectorColor}
                sectors={sectors}
                setSectors={setSectors}
            />

            <SeatsMap 
                mode="assign"
                selectedColor={sectorColor}
                seats={seats}
                setSeats={setSeats}         
            />
        </div>
    );
};

export default EventGenerationPage;