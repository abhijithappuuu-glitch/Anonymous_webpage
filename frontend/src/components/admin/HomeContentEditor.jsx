import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const HomeContentEditor = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API}/admin/home`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setContent(data.content || '');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/admin/home`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      alert('✅ Home content saved!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to save');
    }
  };

  if (loading) {
    return (
      <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6 text-center`}>
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
        Home Page Content
      </h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Home Content (HTML/Markdown)</label>
          <textarea
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter home page content here..."
            className={`w-full px-4 py-2 rounded-lg font-mono text-sm ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
        >
          💾 Save Content
        </button>
      </form>
    </div>
  );
};

export default HomeContentEditor;
