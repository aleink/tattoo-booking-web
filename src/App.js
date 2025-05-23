// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Chat from './Chat';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://aleink.github.io/tattoo-booking-web'
        }
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Check your email for a magic link to log in!');
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err.message}`);
    }
  };

  if (session) {
    return <Chat />;
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Welcome to Tattoo Booking</h2>
      <form onSubmit={handleLogin}>
        <label>
          Enter your email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 8 }}
          />
        </label>
        <button
          type="submit"
          style={{ marginTop: 12, padding: '8px 16px', cursor: 'pointer' }}
        >
          Send Magic Link
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default App;
