import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, getErrorMessage } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch((e) => setError(getErrorMessage(e)));
  }, []);

  return (
    <>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of hospital operations</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {!stats && !error && <div className="loading">Loading statistics…</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">Total Patients</div>
              <div className="value">{stats.patientCount}</div>
            </div>
            <div className="stat-card">
              <div className="label">Doctors</div>
              <div className="value">{stats.doctorCount}</div>
            </div>
            <div className="stat-card">
              <div className="label">Appointments</div>
              <div className="value">{stats.appointmentCount}</div>
            </div>
            <div className="stat-card">
              <div className="label">Upcoming</div>
              <div className="value">{stats.upcomingAppointments}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Quick actions</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/patients" className="btn btn-primary">Register patient</Link>
              <Link to="/doctors" className="btn btn-primary">Add doctor</Link>
              <Link to="/appointments" className="btn btn-primary">Book appointment</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
