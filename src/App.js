import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/Event/Events';
import AdminLoginPage from './pages/Admin/Login';
import AdminRegistrationPage from './pages/Admin/Registration';
import AdminDashboardPage from './pages/Admin/Dashboard';
import SelectedEventPage from './pages/Event/SelectedEventInfo';
import SeatReservationPage from './pages/Event/SeatReservation';

const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/events"/>}/>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<SelectedEventPage />} />
        <Route path="/events/:id/identify" />
        <Route path="/events/:eventId/reservation/:sectorId" element={<SeatReservationPage/>}/>

        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLoginPage/>} />
        <Route path="/admin/registration" element={<AdminRegistrationPage/>} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage/> }/>
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
