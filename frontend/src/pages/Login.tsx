import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const dest = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={dest} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid username or password!');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/assets/images/Logo.png" alt="Barangay Seal" width={90} height={90} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            <h2>Registry of Barangay Inhabitants</h2>
            <p>System Login</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i> Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              <i className="fas fa-sign-in-alt"></i> {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <strong>
              Registry of Barangay Nayong Kanluran Inhabitants System
              <br />
              Powered by: Lavender Fields Research and Development
              <br />
              Developed by: NICOR TECH
            </strong>
          </div>
          <div className="login-version">
            <small>RBIS v1.0.0 &copy; {new Date().getFullYear()}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
