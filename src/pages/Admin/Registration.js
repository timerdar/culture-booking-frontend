import { useState } from "react";
import api from "../../components/Api";
import styles from '../Event/Identify.module.css';


const AdminRegistrationPage = () => {

    document.title = "Регистрация администратора";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mobilePhone, setMPhone] = useState("");
    const [name, setName] = useState("");
    const [code, setCode]  = useState("");

    const [status, setStatus] = useState(null);

    const handleRegistration = async (e) => {
        e.preventDefault();

        const requestBody = {
            username: username,
            password: password,
            mobilePhone: mobilePhone,
            name: name,
            creatingCode: code 
          };

        try {
            const response = await api.post('/api/admin', requestBody, {
                headers: {
                    "Content-Type" : "application/json"
                }
            });
            if (response.status === 201){
                setStatus(<p className="status success">Регистрация успешна</p>);
            }

            setTimeout(() => {
                window.location.href='/admin/login'
            }, 2500);
            
        } catch (err){
            setStatus(
                <p className="status error">{err.response?.data?.message}</p>
            );
        }

    };



    return (
        <div className={styles.container}>
            <div className={styles.logoCont}>
                <img src="../../../logo_192.png" alt="Логотип Культурной среды" className={styles.logo}/>
            </div>
            <h1 className={styles.title}>Регистрация нового администратора</h1>
            <form className={styles.form} onSubmit={handleRegistration}>
                
                <p className={styles.description}>Логин - используется для последующего входа</p>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Логин"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <p className={styles.description}>Имя и номер - используется для обратной связи при публикации мероприятия (в созданном мероприятии указываются контактные данные администратора)</p>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Иванов Иван"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="89123456789"
                    required
                    value={mobilePhone}
                    onChange={(e) => setMPhone(e.target.value)}
                />

                <p className={styles.description}>Пароль - от 8 символов, строчные + заглавные + цифры + спецсимовлы</p>
                <input 
                    className={styles.inputField}
                    type="password"
                    placeholder="Пароль"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className={styles.description}>Код активации - используется для верификации, можно получить у разработчика/ответственного за систему</p>
                <input 
                    className={styles.inputField}
                    type="text"
                    placeholder="Код активации"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button className={styles.submitButton} type="submit">Зарегистрироваться</button>
                {status}
            </form>
        </div>
    );

};

export default AdminRegistrationPage;