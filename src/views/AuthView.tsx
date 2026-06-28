import React from 'react';
import { User } from '../types';

export const AuthView: React.FC<{ onAuth: (u: User) => void }> = ({ onAuth }) => {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');

  return (
    <div className="auth-container">
      <form onSubmit={(e) => { e.preventDefault(); onAuth({ id: 1, username: user }); }}>
        <h2>Golf Swing AI Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" value={user} onChange={e => setUser(e.target.value)} placeholder="Username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required />
        </div>
        <button type="submit" disabled={!user}>Login / Register</button>
      </form>
    </div>
  );
};
