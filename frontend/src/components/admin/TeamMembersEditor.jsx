import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const TeamMembersEditor = ({ refreshStats }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    bio: '',
    initials: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API}/admin/team-members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMembers(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = currentMember ? `${API}/admin/team-members/${currentMember._id}` : `${API}/admin/team-members`;
      const method = currentMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(currentMember ? 'Team member updated!' : 'Team member added!');
        fetchMembers();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Failed to save team member');
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      specialty: member.specialty || '',
      bio: member.bio || '',
      initials: member.initials || '',
      order: member.order || 0,
      isActive: member.isActive !== undefined ? member.isActive : true
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const response = await fetch(`${API}/admin/team-members/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Team member deleted!');
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const resetForm = () => {
    setCurrentMember(null);
    setIsEditing(false);
    setFormData({
      name: '',
      role: '',
      specialty: '',
      bio: '',
      initials: '',
      order: 0,
      isActive: true
    });
  };

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
          {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
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
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Initials</label>
            <input
              type="text"
              maxLength="3"
              value={formData.initials}
              onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
              placeholder="JD (auto-generated if empty)"
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Founder & Technical Lead"
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Specialty *</label>
            <input
              type="text"
              required
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="Penetration Testing"
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              placeholder="0"
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              <span>Active Member</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio *</label>
          <textarea
            required
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Expert in red team operations with 5+ years in cybersecurity research..."
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
        >
          {currentMember ? '💾 Update Member' : '✨ Add Member'}
        </button>
      </form>

      {/* Members List */}
      <div>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
          All Team Members ({members.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {members.map(member => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${theme === 'hacker' ? 'bg-hacker-panel/30 border border-hacker-green/20' : 'bg-black/20 border border-white/10'} rounded-lg p-4`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme === 'hacker' ? 'from-hacker-green/20 to-hacker-aqua/20' : 'from-cyber-blue/20 to-cyber-purple/20'} flex items-center justify-center text-2xl font-mono ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                  {member.initials || member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                    {member.name}
                    {!member.isActive && <span className="text-xs text-red-400 ml-2">(Inactive)</span>}
                  </h4>
                  <p className={`text-sm ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
                    {member.role}
                  </p>
                  <p className="text-xs text-text-secondary mb-2">{member.specialty}</p>
                  <p className="text-sm text-text-secondary line-clamp-2">{member.bio}</p>
                  <p className="text-xs text-text-secondary mt-2">Order: {member.order}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-3 py-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="flex-1 px-3 py-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersEditor;
