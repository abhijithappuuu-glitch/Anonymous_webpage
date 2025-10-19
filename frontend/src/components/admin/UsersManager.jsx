import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const UsersManager = () => {
  const { theme } = useTheme();
  const [users] = useState([]);

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
        User Management
      </h2>

      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <p className="text-xl mb-2">User Management Coming Soon</p>
        <p className="text-text-secondary">This feature will allow you to manage registered users, permissions, and roles.</p>
      </div>
    </div>
  );
};

export default UsersManager;
