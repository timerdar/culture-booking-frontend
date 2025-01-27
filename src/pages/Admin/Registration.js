import { useState } from "react";
import api from "../../components/Api";


const AdminRegistrationPage = () => {

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
                setStatus(<p style={{color: "green"}}>Регистрация успешна</p>);
            }

            setTimeout(() => {
                window.location.href='/admin/login'
            }, 2500);
            
        } catch (err){
            setStatus(
                <p style={{color: "red"}}>{err.response?.data?.message}</p>
            );
        }

    };



    return (
        <div>
            <h1>Регистрация нового администратора</h1>
            <form onSubmit={handleRegistration}>
                
                <input
                    type="text"
                    placeholder="Логин"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p>Логин - используется для последующего входа</p>
                
                <input
                    type="text"
                    placeholder="Иванов Иван"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="89123456789"
                    required
                    value={mobilePhone}
                    onChange={(e) => setMPhone(e.target.value)}
                />
                <p>Имя и номер - используется для обратной связи при публикации мероприятия (в созданном мероприятии указываются контактные данные администратора)</p>

                <input 
                    type="password"
                    placeholder="Пароль"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>Пароль - от 8 символов, строчные + заглавные + цифры + спецсимовлы</p>

                <input 
                    type="text"
                    placeholder="Код активации"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <p>Код активации - используется для верификации, можно получить у разработчика/ответственного за систему</p>
                <button type="submit">Зарегистрироваться</button>
                {status}
            </form>
        </div>
    );

};

export default AdminRegistrationPage;