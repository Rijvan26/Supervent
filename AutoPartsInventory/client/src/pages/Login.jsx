import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { HiOutlineLockClosed, HiOutlineEnvelope, HiOutlineEye, HiOutlineEyeSlash, HiOutlineBuildingStorefront } from 'react-icons/hi2';

const Login = () => {
  const [email, setEmail] = useState('admin@autoparts.com');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password, remember);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <HiOutlineBuildingStorefront size={24} />
            </div>
            <div>
              <h1>AutoParts Hub</h1>
              <p>Inventory made simple</p>
            </div>
          </div>
          <h2>Manage your spare parts inventory with ease.</h2>
          <p>A clean workspace for store owners to track stock, reduce errors, and move faster.</p>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-title-wrap">
              <div className="auth-icon-pill">
                <HiOutlineLockClosed size={22} />
              </div>
              <div>
                <h3>Welcome back</h3>
                <p>Sign in to continue managing your shop.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error ? <div className="auth-error">{error}</div> : null}

              <label className="auth-field">
                <span>Email</span>
                <div className="auth-input-wrap">
                  <HiOutlineEnvelope className="auth-input-icon" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@store.com" />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>
                <div className="auth-input-wrap">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                  <button type="button" className="auth-toggle" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </label>

              <div className="auth-meta-row">
                <label className="auth-checkbox">
                  <input type="checkbox" checked={remember} onChange={() => setRemember((value) => !value)} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
              </div>

              <Button type="submit" className="auth-submit-btn" isLoading={loading}>Login</Button>
            </form>

            <div className="auth-footer-link">
              New here? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
