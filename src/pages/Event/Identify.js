import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Api";


const IdentifyPage = () => {

    const {eventId} = useParams();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [fathername, setFathername] = useState('');
    const [selectedSector, setSelectedSector] = useState('');

    const [sectors, setSectors] = useState([]);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchSectors = async () => {
            try{

                const response = await api.get(`/api/events/${eventId}/sectors`);
                setSectors(response.data);
            }catch (err){
                setError(err.response?.data?.message)
            }
        };
        fetchSectors();

    }, [eventId])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (surname && name && fathername && selectedSector){
            localStorage.setItem("NAME", name);
            localStorage.setItem("SURNAME", surname);
            localStorage.setItem("FATHERNAME", fathername);
            localStorage.setItem("SECTOR", selectedSector);


            window.location.href = `/events/${eventId}/reservation/${selectedSector}`;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
                {error && <p style={{color: "red"}}>{error}</p>}  
                <h1>Введите свои данные</h1>
                <input 
                            type="text"
                            autoComplete="off"
                            required
                            placeholder="Фамилия"
                            value={surname}
                            onChange={(event) => {setSurname(event.target.value)}}
                        />
                <input 
                            type="text"
                            autoComplete="off"
                            required
                            placeholder="Имя"
                            value={name}
                            onChange={(event) => {setName(event.target.value)}}
                        />
                <input
                            type="text"
                            autoComplete="off"
                            required
                            placeholder="Отчество"
                            value={fathername}
                            onChange={(event) => {setFathername(event.target.value)}}
                        />
                <label>
                        Выберите сектор:
                    </label>
                    {sectors.map((sector, index) => (
                        <div key={index}>
                            <input 
                                    type="radio"
                                    name="radio"
                                    value={sector.id}
                                    onChange={(event) => setSelectedSector(event.target.value)}
                                />
                                <label>{sector.name}</label>
                        </div>
                    ))}
                <button type="submit">
                    Выбрать место
                </button>
            </form>
    );
 
};

export default IdentifyPage;