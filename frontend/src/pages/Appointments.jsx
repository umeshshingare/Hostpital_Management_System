import { useEffect, useState } from 'react';
import { appointmentsApi, patientsApi, doctorsApi, getErrorMessage } from '../api/client';

const today = new Date().toISOString().split('T')[0];
const initialForm = { patientId: '', doctorId: '', appointmentDate: today };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [appts, pts, docs] = await Promise.all([
        appointmentsApi.list(),
        patientsApi.list(),
        doctorsApi.list(),
      ]);
      setAppointments(appts);
      setPatients(pts);
      setDoctors(docs);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await appointmentsApi.create({
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        appointmentDate: form.appointmentDate,
      });
      setForm({ ...initialForm, appointmentDate: today });
      setSuccess('Appointment booked successfully.');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setError('');
    try {
      await appointmentsApi.remove(id);
      setSuccess('Appointment cancelled.');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <header className="page-header">
        <h2>Appointments</h2>
        <p>Schedule and manage patient visits</p>
      </header>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3>Book appointment</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patient">Patient</label>
                <select
                  id="patient"
                  required
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="doctor">Doctor</label>
                <select
                  id="doctor"
                  required
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                >
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      #{d.id} — {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  min={today}
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!patients.length || !doctors.length}>
                Book
              </button>
            </div>
          </form>
          {(!patients.length || !doctors.length) && (
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Add at least one patient and one doctor before booking.
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All appointments ({appointments.length})</h3>
        </div>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">No appointments scheduled.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td>{a.doctorSpecialization}</td>
                    <td>{a.appointmentDate}</td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={() => handleCancel(a.id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
