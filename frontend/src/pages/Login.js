import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

/**
 * Two-step login page:
 * 1. Enter phone (and optional name) -> sends OTP
 * 2. Enter OTP -> verifies and logs in
 */
function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = phone entry, 2 = OTP entry
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to the appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const paths = { CITIZEN: '/citizen', VOLUNTEER: '/volunteer', AUTHORITY: '/authority' };
      navigate(paths[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  // Step 1: request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/send-otp', { phone });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP and complete login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp, name, role });
      const { token, user: userData } = res.data;
      login(token, userData);

      // Redirect by role
      const paths = { CITIZEN: '/citizen', VOLUNTEER: '/volunteer', AUTHORITY: '/authority' };
      navigate(paths[userData.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">CDRN</h1>
        <p className="login-subtitle">Community Disaster Response Network</p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>Name (for new users)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Role (for new users)</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="CITIZEN">Citizen</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="AUTHORITY">Authority</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="otp-info">OTP sent to <strong>{phone}</strong></p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                required
                maxLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              style={{ marginTop: 8 }}
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
            >
              Back
            </button>
          </form>
        )}

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
