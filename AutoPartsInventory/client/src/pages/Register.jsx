import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineBuildingStorefront, HiOutlineUser, HiOutlineEnvelope, HiOutlineDevicePhoneMobile } from 'react-icons/hi2';

const Register = () => {
  const [form, setForm] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.storeName || !form.ownerName || !form.email || !form.mobile || !form.password || !form.confirmPassword) {
      setError('Please complete all fields.');
      return;
    }
    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password should be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('');
    }, 800);
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
          <h2>Create your store account</h2>
          <p>Set up your workspace in minutes and start managing stock with clarity.</p>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-title-wrap">
              <div className="auth-icon-pill">
                <HiOutlineBuildingStorefront size={22} />
              </div>
              <div>
                <h3>Register</h3>
                <p>Start with a few details about your store.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error ? <div className="auth-error">{error}</div> : null}

              <label className="auth-field">
                <span>Store Name</span>
                <input name="storeName" value={form.storeName} onChange={handleChange} placeholder="North Star Parts" />
              </label>

              <label className="auth-field">
                <span>Owner Name</span>
                <div className="auth-input-wrap">
                  <HiOutlineUser className="auth-input-icon" />
                  <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Ahsan Khan" />
                </div>
              </label>

              <label className="auth-field">
                <span>Email</span>
                <div className="auth-input-wrap">
                  <HiOutlineEnvelope className="auth-input-icon" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="owner@store.com" />
                </div>
              </label>

              <label className="auth-field">
                <span>Mobile Number</span>
                <div className="auth-input-wrap">
                  <HiOutlineDevicePhoneMobile className="auth-input-icon" />
                  <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="0300 1234567" />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>
                <div className="auth-input-wrap">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" />
                  <button type="button" className="auth-toggle" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </label>

              <label className="auth-field">
                <span>Confirm Password</span>
                <div className="auth-input-wrap">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
                  <button type="button" className="auth-toggle" onClick={() => setShowConfirmPassword((value) => !value)}>
                    {showConfirmPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </label>

              <Button type="submit" className="auth-submit-btn" isLoading={loading}>Register</Button>
            </form>

            <div className="auth-footer-link">
              Already have an account? <Link to="/login">Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
