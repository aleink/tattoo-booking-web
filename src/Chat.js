// src/Chat.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1) Get current user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2) Fetch messages from 'messages' table
    fetchMessages();

    // 3) Subscribe to new messages in real time
    subscribeToNewMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  // Real-time subscription so new messages appear instantly
  const subscribeToNewMessages = () => {
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((current) => [...current, payload.new]);
      })
      .subscribe();
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // If user is logged in, attach their user_id
    const userId = session?.user?.id || null;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ text: newMessage, user_id: userId }]);
    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      // no need to refetch because of real-time subscription
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Chat Screen (Logged In)</h2>
      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'auto',
          padding: 10,
          marginBottom: 10
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <strong>{msg.user_id || 'Anonymous'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', marginRight: 8 }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
