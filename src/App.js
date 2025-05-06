import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);

  // Check auth state on component mount
  useEffect(() => {
    // 1) Check current session
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // 2) Listen for changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
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

  // If there's a session, show chat; otherwise show login
  if (session) {
    return <Chat />;
  }

  // Login screen
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

// Placeholder Chat component
function Chat() {
  return (
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Chat Screen (Logged In)</h2>
      <p>This is where we'll build our chat interface.</p>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
}

export default App;
