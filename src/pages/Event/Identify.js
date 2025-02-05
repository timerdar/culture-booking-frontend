import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Api";
import styles from './Identify.module.css'


const IdentifyPage = () => {

    document.title = "Анкета зрителя";

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
        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            <form onSubmit={handleSubmit} className={styles.container}>
            {error && <p className={styles.errorMessage}>{error}</p>}  
            <h1 className={styles.title}>Введите свои данные</h1>
            <input 
                        type="text"
                        autoComplete="off"
                        required
                        placeholder="Фамилия"
                        value={surname}
                        onChange={(event) => {setSurname(event.target.value)}}
                        className={styles.inputField}
                    />
            <input 
                        type="text"
                        autoComplete="off"
                        required
                        placeholder="Имя"
                        value={name}
                        onChange={(event) => {setName(event.target.value)}}
                        className={styles.inputField}
                    />
            <input
                        type="text"
                        autoComplete="off"
                        required
                        placeholder="Отчество"
                        value={fathername}
                        onChange={(event) => {setFathername(event.target.value)}}
                        className={styles.inputField}
                    />

                    <div className={styles.radioContainer}>
                        <label>
                            Выберите сектор:
                        </label>
                        {sectors.map((sector, index) => (
                        <div key={index}>
                            <input 
                                type="radio"
                                name="radio"
                                value={sector.id}
                                className={styles.radioLabel}
                                onChange={(event) => setSelectedSector(event.target.value)}
                            />
                            <label className={styles.radioLabel}>{sector.name}</label>
                    </div>
                ))}
                    </div>
                
                
            <button type="submit" className={styles.submitButton}>
                Выбрать место
            </button>
        </form>
        </div>
        
    );
 
};

export default IdentifyPage;