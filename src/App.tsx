import React, { useState } from 'react';
import { User } from './types';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';

const AppContent = ({ user, setUser }: { user: User | null; setUser: any }) => {
  if (!user) return <AuthView onAuth={(u) => setUser(u)} />;
  return <DashboardView onLogout={() => setUser(null)} />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  return <div className="app-root"><AppContent user={user} setUser={setUser} /></div>;
};

export default App;
