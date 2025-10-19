import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const TimelineEditor = ({ refreshStats }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API}/admin/timeline`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API}/admin/timeline/${editingId}` : `${API}/admin/timeline`;
      const method = editingId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      alert(editingId ? 'Timeline event updated!' : 'Timeline event created!');
      fetchEvents();
      setFormData({ title: '', description: '', date: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this timeline event?')) return;
    try {
      await fetch(`${API}/admin/timeline/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: new Date(event.date).toISOString().split('T')[0]
    });
  };

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
        Timeline Events
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
          >
            {editingId ? '💾 Update' : '✨ Add Event'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setFormData({ title: '', description: '', date: '' }); }}
              className="px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {events.map(event => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme === 'hacker' ? 'bg-hacker-panel/30 border border-hacker-green/20' : 'bg-black/20 border border-white/10'} rounded-lg p-4 flex justify-between items-start`}
          >
            <div className="flex-1">
              <h4 className={`font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                {event.title}
              </h4>
              <p className="text-sm text-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
              {event.description && <p className="text-sm mt-1">{event.description}</p>}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(event)}
                className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineEditor;
