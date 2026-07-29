import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HiOutlineEnvelope } from 'react-icons/hi2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md p-6 md:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <HiOutlineEnvelope size={24} />
          </div>
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">We will send a recovery email to your inbox.</p>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            Password reset instructions were sent to {email || 'your email'}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-group block">
              <span className="form-label">Email</span>
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@store.com" required />
            </label>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
