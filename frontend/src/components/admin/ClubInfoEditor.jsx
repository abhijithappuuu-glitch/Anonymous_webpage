import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const ClubInfoEditor = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    mission: '',
    vision: '',
    founded: '',
    location: '',
    totalMembers: '',
    ctfChallenges: '',
    nationalRanking: '',
    vulnerabilitiesDisclosed: '',
    workshopsConducted: '',
    industryPartners: '',
    email: '',
    discord: '',
    github: '',
    campusLocation: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      youtube: '',
      instagram: ''
    },
    footerDescription: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubInfo();
  }, []);

  const fetchClubInfo = async () => {
    try {
      const response = await fetch(`${API}/admin/club-info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching club info:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/admin/club-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Club information updated successfully!');
      }
    } catch (error) {
      console.error('Error saving club info:', error);
      alert('❌ Failed to save club information');
    }
  };

  if (loading) {
    return (
      <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6 text-center`}>
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p>Loading club information...</p>
      </div>
    );
  }

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
        {theme === 'hacker' ? 'CLUB_INFO // EDIT' : 'Edit Club Information'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Section */}
        <div className={`${theme === 'hacker' ? 'border border-hacker-green/20' : 'border border-cyber-blue/20'} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
            📝 About Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mission Statement</label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vision Statement</label>
              <textarea
                rows={2}
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Founded Year</label>
                <input
                  type="text"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`${theme === 'hacker' ? 'border border-hacker-green/20' : 'border border-cyber-blue/20'} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
            📊 Statistics
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Members</label>
              <input
                type="text"
                value={formData.totalMembers}
                onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })}
                placeholder="150+"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTF Challenges</label>
              <input
                type="text"
                value={formData.ctfChallenges}
                onChange={(e) => setFormData({ ...formData, ctfChallenges: e.target.value })}
                placeholder="50+"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">National Ranking</label>
              <input
                type="text"
                value={formData.nationalRanking}
                onChange={(e) => setFormData({ ...formData, nationalRanking: e.target.value })}
                placeholder="#3"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVEs Disclosed</label>
              <input
                type="text"
                value={formData.vulnerabilitiesDisclosed}
                onChange={(e) => setFormData({ ...formData, vulnerabilitiesDisclosed: e.target.value })}
                placeholder="25+"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workshops Conducted</label>
              <input
                type="text"
                value={formData.workshopsConducted}
                onChange={(e) => setFormData({ ...formData, workshopsConducted: e.target.value })}
                placeholder="40+"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry Partners</label>
              <input
                type="text"
                value={formData.industryPartners}
                onChange={(e) => setFormData({ ...formData, industryPartners: e.target.value })}
                placeholder="15+"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`${theme === 'hacker' ? 'border border-hacker-green/20' : 'border border-cyber-blue/20'} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
            📧 Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Campus Location</label>
              <input
                type="text"
                value={formData.campusLocation}
                onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discord Link</label>
              <input
                type="text"
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Link</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className={`${theme === 'hacker' ? 'border border-hacker-green/20' : 'border border-cyber-blue/20'} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
            🌐 Social Media
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="text"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="text"
                value={formData.socialLinks.youtube}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, youtube: e.target.value } })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram URL</label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${theme === 'hacker' ? 'border border-hacker-green/20' : 'border border-cyber-blue/20'} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
            👣 Footer
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2">Footer Description</label>
            <textarea
              rows={2}
              value={formData.footerDescription}
              onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
        >
          💾 Save Club Information
        </button>
      </form>
    </div>
  );
};

export default ClubInfoEditor;
