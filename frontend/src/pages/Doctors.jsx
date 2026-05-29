import { useEffect, useState } from 'react';
import { doctorsApi, getErrorMessage } from '../api/client';

const initialForm = { name: '', specialization: '' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    setLoading(true);
    doctorsApi
      .list()
      .then(setDoctors)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await doctorsApi.create({
        name: form.name.trim(),
        specialization: form.specialization.trim(),
      });
      setForm(initialForm);
      setSuccess('Doctor added successfully.');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <header className="page-header">
        <h2>Doctors</h2>
        <p>Manage hospital medical staff</p>
      </header>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <h3>Add doctor</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label htmlFor="doc-name">Name</label>
                  <input
                    id="doc-name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="spec">Specialization</label>
                  <input
                    id="spec"
                    required
                    maxLength={100}
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="Cardiology"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add doctor
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>All doctors ({doctors.length})</h3>
          </div>
          {loading ? (
            <div className="loading">Loading…</div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">No doctors found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>{d.specialization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
