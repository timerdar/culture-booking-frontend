import api from "../../components/Api";
import { useState } from "react";


const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();
        const loginBody = {
            username: username,
            password: password
        };

        try {
            const response = await api.post("/api/authenticate", loginBody, {
                headers: {
                    "Content-Type" : "application/json"
                }
            });
            localStorage.setItem("ADMIN_ID", response.data.adminId);
            localStorage.setItem("CULT_JWT", response.data.token);
            window.location.href = "/admin/dashboard";
        } catch (err){
            console.log(err);
            setError(err.response?.data?.message);
        };
    };

    return (
        <div>
            <h1>Вход в панель администратора</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type="text"
                    placeholder="Логин"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type='submit'>Войти</button>
                <p>Нет аккаунта? <a href="/admin/registration">Зарегистрироваться</a></p>
            </form>
        </div>
    );

};


export default AdminLoginPage;