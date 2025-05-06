import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 1) Fetch existing messages from Supabase on component mount
  useEffect(() => {
  const subscription = supabase
    .channel('any_unique_channel_name')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        // This runs when a new row is inserted
        setMessages((current) => [...current, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);


  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')   // or whatever table name you choose
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.log('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  // 2) Handle sending a new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ text: newMessage }]); // add user_id if needed

    if (error) {
      console.log('Error sending message:', error);
    } else {
      setNewMessage('');
      // fetchMessages(); // or rely on real-time subscription to update
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      
      {/* Message List */}
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ margin: '8px 0' }}>
            <strong>{msg.user_id || 'Anon'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* New Message Input */}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
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
