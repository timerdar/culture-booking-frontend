import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/Event/Events';
import AdminLoginPage from './pages/Admin/Login';
import AdminRegistrationPage from './pages/Admin/Registration';
import AdminDashboardPage from './pages/Admin/Dashboard';
import SelectedEventPage from './pages/Event/SelectedEventInfo';
import SeatReservationPage from './pages/Event/SeatReservation';
import EventGenerationPage from './pages/Admin/EventGeneration';
import IdentifyPage from './pages/Event/Identify';
import TicketPage from './pages/Ticket/Ticket';
import AdminTicketsList from './pages/Admin/AdminTicketsList';
import SeatsControlPage from './pages/Admin/SeatsControlPage';
import './App.css';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/events" />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<SelectedEventPage />} />
          <Route path="/events/:eventId/identify" element={<IdentifyPage />} />
          <Route path="/events/:eventId/reservation/:sectorId" element={<SeatReservationPage />} />

          <Route path="/tickets/:uuid" element={<TicketPage />} />

          <Route path="/admin" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/registration" element={<AdminRegistrationPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/:eventId/tickets" element={<AdminTicketsList />} />
          <Route path="/admin/createEvent" element={<EventGenerationPage />} />
          <Route path="/admin/:eventId/seatsControl" element={<SeatsControlPage />} />

        </Routes>
      </BrowserRouter>
      <div style={{
        textAlign: "center",
        alignItems: "center"
        }}>
        dev by <a href="https://vk.com/timerdar">timerdar</a>
      </div>
    </div>
  );
};

export default App;
