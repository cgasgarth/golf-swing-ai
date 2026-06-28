import React from 'react';
import { User } from '../types';

export const AuthView: React.FC<{ onAuth: (u: User) => void }> = ({ onAuth }) => {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');

  return (
    <div className="auth-container">
      <h2>Golf Swing AI Login</h2>
      <input value={user} onChange={e => setUser(e.target.value)} placeholder="Username" />
      <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
      <button disabled={!user} onClick={() => onAuth({ id: 1, username: user })}>Login / Register</button>
    </div>
  );
};
