import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const EventsManager = ({ refreshStats }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'Workshop',
    summary: '',
    description: '',
    tags: '',
    status: 'upcoming',
    images: []
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const url = currentEvent ? `${API}/events/${currentEvent._id}` : `${API}/events`;
      const method = currentEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        alert(currentEvent ? 'Event updated!' : 'Event created!');
        fetchEvents();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      category: event.category,
      summary: event.summary,
      description: event.description,
      tags: event.tags.join(', '),
      status: event.status,
      images: event.images || []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`${API}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Event deleted!');
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setCurrentEvent(null);
    setIsEditing(false);
    setFormData({
      title: '',
      date: '',
      category: 'Workshop',
      summary: '',
      description: '',
      tags: '',
      status: 'upcoming',
      images: []
    });
  };

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h2>
        {isEditing && (
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Form */}
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

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            >
              <option>Workshop</option>
              <option>Hackathon</option>
              <option>Webinar</option>
              <option>Conference</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary *</label>
          <textarea
            required
            rows={2}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="workshop, security, beginner"
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
        >
          {currentEvent ? '💾 Update Event' : '✨ Create Event'}
        </button>
      </form>

      {/* Events List */}
      <div>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
          All Events ({events.length})
        </h3>
        <div className="space-y-4">
          {events.map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme === 'hacker' ? 'bg-hacker-panel/30 border border-hacker-green/20' : 'bg-black/20 border border-white/10'} rounded-lg p-4`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-bold text-lg ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                    {event.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    📅 {new Date(event.date).toLocaleDateString()} • {event.category} • 
                    <span className={event.status === 'upcoming' ? 'text-green-400' : 'text-gray-400'}>
                      {' '}{event.status}
                    </span>
                  </p>
                  <p className="text-sm mb-2">{event.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded ${theme === 'hacker' ? 'bg-hacker-green/10 text-hacker-aqua' : 'bg-cyber-blue/10 text-cyber-blue'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsManager;
