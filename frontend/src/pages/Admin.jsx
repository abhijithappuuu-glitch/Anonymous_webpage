import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API } from '../utils/api';

const Admin = () => {
  // Loading and messaging states
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Content states
  const [homeContent, setHomeContent] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  // Event management states
  const [newEvent, setNewEvent] = useState('');
  const [editEventId, setEditEventId] = useState(null);
  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEventDesc, setEditEventDesc] = useState('');
  const [editEventDate, setEditEventDate] = useState('');

  // Image management states
  const [editImgId, setEditImgId] = useState(null);
  const [editImgCaption, setEditImgCaption] = useState('');

  // Club info state with comprehensive fields
  const [clubInfo, setClubInfo] = useState({
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

  // Team members states
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    specialty: '',
    bio: '',
    initials: '',
    order: 0
  });
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage('');
    } else {
      setMessage(msg);
      setError('');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    return { 'Authorization': `Bearer ${token}` };
  };

  const loadAllData = async () => {
    setLoading(true);
    const headers = getAuthHeaders();

    try {
      // Load all data in parallel
      const [homeRes, timelineRes, galleryRes, clubRes, teamRes] = await Promise.all([
        fetch(`${API}/admin/home`, { headers }),
        fetch(`${API}/admin/timeline`, { headers }),
        fetch(`${API}/admin/gallery`, { headers }),
        fetch(`${API}/admin/club-info`, { headers }),
        fetch(`${API}/admin/team-members`, { headers })
      ]);

      if (homeRes.ok) {
        const homeData = await homeRes.json();
        setHomeContent(homeData.content || '');
      }

      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData);
      }

      if (galleryRes.ok) {
        const galleryData = await galleryRes.json();
        setGalleryImages(galleryData);
      }

      if (clubRes.ok) {
        const clubData = await clubRes.json();
        setClubInfo(clubData);
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMembers(teamData);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      showMessage('Failed to load admin data', true);
    } finally {
      setLoading(false);
    }
  };

  // Home content management
  const handleSaveHome = async () => {
    try {
      const res = await fetch(`${API}/admin/home`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ content: homeContent })
      });
      
      if (res.ok) {
        showMessage('Home content saved!');
      } else {
        showMessage('Failed to save home content', true);
      }
    } catch (err) {
      showMessage('Failed to save home content', true);
    }
  };

  // Event management
  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;
    
    try {
      const res = await fetch(`${API}/admin/timeline`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ title: newEvent, description: '', date: new Date() })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTimeline([...timeline, data.event]);
        setNewEvent('');
        showMessage('Event added!');
      } else {
        showMessage('Failed to add event', true);
      }
    } catch (err) {
      showMessage('Failed to add event', true);
    }
  };

  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setEditEventTitle(event.title);
    setEditEventDesc(event.description || '');
    setEditEventDate(event.date ? event.date.slice(0,10) : '');
  };

  const handleUpdateEvent = async () => {
    try {
      const res = await fetch(`${API}/admin/timeline/${editEventId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ title: editEventTitle, description: editEventDesc, date: editEventDate })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTimeline(timeline.map(e => e._id === editEventId ? data.event : e));
        setEditEventId(null);
        showMessage('Event updated!');
      } else {
        showMessage('Failed to update event', true);
      }
    } catch (err) {
      showMessage('Failed to update event', true);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`${API}/admin/timeline/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        setTimeline(timeline.filter(e => e._id !== id));
        showMessage('Event deleted!');
      } else {
        showMessage('Failed to delete event', true);
      }
    } catch (err) {
      showMessage('Failed to delete event', true);
    }
  };

  // Gallery management
  const handleImageUpload = async (e) => {
    setUploading(true);
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch(`${API}/admin/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setGalleryImages([...galleryImages, data.image]);
        showMessage('Image uploaded!');
      } else {
        showMessage('Upload failed', true);
      }
    } catch (err) {
      showMessage('Upload failed', true);
    } finally {
      setUploading(false);
    }
  };

  const handleEditImg = (img) => {
    setEditImgId(img._id);
    setEditImgCaption(img.caption || '');
  };

  const handleUpdateImg = async () => {
    try {
      const res = await fetch(`${API}/admin/gallery/${editImgId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ caption: editImgCaption })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(galleryImages.map(g => g._id === editImgId ? data.image : g));
        setEditImgId(null);
        showMessage('Image caption updated!');
      } else {
        showMessage('Failed to update image', true);
      }
    } catch (err) {
      showMessage('Failed to update image', true);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    
    try {
      const res = await fetch(`${API}/admin/gallery/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        setGalleryImages(galleryImages.filter(g => g._id !== id));
        showMessage('Image deleted!');
      } else {
        showMessage('Failed to delete image', true);
      }
    } catch (err) {
      showMessage('Failed to delete image', true);
    }
  };

  // Club info management
  const handleSaveClubInfo = async () => {
    try {
      const res = await fetch(`${API}/admin/club-info`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(clubInfo)
      });
      
      if (res.ok) {
        showMessage('Club info saved!');
      } else {
        showMessage('Failed to save club info', true);
      }
    } catch (err) {
      showMessage('Failed to save club info', true);
    }
  };

  // Team member management
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) {
      showMessage('Name and role are required', true);
      return;
    }
    
    try {
      const res = await fetch(`${API}/admin/team-members`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...newMember,
          order: teamMembers.length
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTeamMembers([...teamMembers, data.member]);
        setNewMember({ name: '', role: '', specialty: '', bio: '', initials: '', order: 0 });
        showMessage('Team member added!');
      } else {
        showMessage('Failed to add team member', true);
      }
    } catch (err) {
      showMessage('Failed to add team member', true);
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member._id);
    setNewMember({
      name: member.name,
      role: member.role,
      specialty: member.specialty || '',
      bio: member.bio || '',
      initials: member.initials || '',
      order: member.order || 0
    });
  };

  const handleUpdateMember = async () => {
    if (!newMember.name || !newMember.role) {
      showMessage('Name and role are required', true);
      return;
    }
    
    try {
      const res = await fetch(`${API}/admin/team-members/${editingMember}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newMember)
      });
      
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(teamMembers.map(m => m._id === editingMember ? data.member : m));
        setEditingMember(null);
        setNewMember({ name: '', role: '', specialty: '', bio: '', initials: '', order: 0 });
        showMessage('Team member updated!');
      } else {
        showMessage('Failed to update team member', true);
      }
    } catch (err) {
      showMessage('Failed to update team member', true);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    
    try {
      const res = await fetch(`${API}/admin/team-members/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        setTeamMembers(teamMembers.filter(m => m._id !== id));
        showMessage('Member deleted!');
      } else {
        showMessage('Failed to delete member', true);
      }
    } catch (err) {
      showMessage('Failed to delete member', true);
    }
  };

  const cancelMemberEdit = () => {
    setEditingMember(null);
    setNewMember({ name: '', role: '', specialty: '', bio: '', initials: '', order: 0 });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyber-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-cyber-blue">Admin Control Panel</h1>
        <p className="text-gray-600">Manage all website content and settings</p>
      </div>

      {/* Status Messages */}
      {(message || error) && (
        <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${
          message ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message || error}
        </div>
      )}

      {/* Home Page Content */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          📝 Home Page Content
          <span className="ml-2 text-sm text-gray-500 font-normal">Rich text editor for homepage</span>
        </h2>
        <ReactQuill 
          value={homeContent} 
          onChange={setHomeContent} 
          theme="snow" 
          className="mb-4"
          style={{ minHeight: '200px' }}
        />
        <button 
          className="btn-cyber btn-cyber-primary mt-4 flex items-center gap-2" 
          onClick={handleSaveHome}
        >
          💾 Save Home Content
        </button>
      </section>

      {/* Club Information */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          🏢 Club Information
          <span className="ml-2 text-sm text-gray-500 font-normal">Edit all club details and statistics</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyber-blue">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Mission Statement</label>
              <textarea 
                value={clubInfo.mission} 
                onChange={e => setClubInfo({...clubInfo, mission: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Our mission..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vision Statement</label>
              <textarea 
                value={clubInfo.vision} 
                onChange={e => setClubInfo({...clubInfo, vision: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Our vision..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Founded Year</label>
                <input 
                  type="text" 
                  value={clubInfo.founded} 
                  onChange={e => setClubInfo({...clubInfo, founded: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input 
                  type="text" 
                  value={clubInfo.location} 
                  onChange={e => setClubInfo({...clubInfo, location: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="University Campus"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyber-blue">Club Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Total Members</label>
                <input 
                  type="text" 
                  value={clubInfo.totalMembers} 
                  onChange={e => setClubInfo({...clubInfo, totalMembers: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="150+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTF Challenges</label>
                <input 
                  type="text" 
                  value={clubInfo.ctfChallenges} 
                  onChange={e => setClubInfo({...clubInfo, ctfChallenges: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="50+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">National Ranking</label>
                <input 
                  type="text" 
                  value={clubInfo.nationalRanking} 
                  onChange={e => setClubInfo({...clubInfo, nationalRanking: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="#3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vulnerabilities Disclosed</label>
                <input 
                  type="text" 
                  value={clubInfo.vulnerabilitiesDisclosed} 
                  onChange={e => setClubInfo({...clubInfo, vulnerabilitiesDisclosed: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="25+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Workshops Conducted</label>
                <input 
                  type="text" 
                  value={clubInfo.workshopsConducted} 
                  onChange={e => setClubInfo({...clubInfo, workshopsConducted: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="40+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry Partners</label>
                <input 
                  type="text" 
                  value={clubInfo.industryPartners} 
                  onChange={e => setClubInfo({...clubInfo, industryPartners: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="15+"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-cyber-blue">Contact Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={clubInfo.email} 
                  onChange={e => setClubInfo({...clubInfo, email: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="contact@club.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discord</label>
                <input 
                  type="text" 
                  value={clubInfo.discord} 
                  onChange={e => setClubInfo({...clubInfo, discord: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Discord link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <input 
                  type="text" 
                  value={clubInfo.github} 
                  onChange={e => setClubInfo({...clubInfo, github: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="GitHub link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Campus Location</label>
                <input 
                  type="text" 
                  value={clubInfo.campusLocation} 
                  onChange={e => setClubInfo({...clubInfo, campusLocation: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Campus location"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Footer Description</label>
              <textarea 
                value={clubInfo.footerDescription} 
                onChange={e => setClubInfo({...clubInfo, footerDescription: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="2"
                placeholder="Footer description..."
              />
            </div>
          </div>
        </div>

        <button 
          className="btn-cyber btn-cyber-primary mt-6 flex items-center gap-2" 
          onClick={handleSaveClubInfo}
        >
          💾 Save Club Information
        </button>
      </section>

      {/* Team Members Management */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          👥 Team Members Management
          <span className="ml-2 text-sm text-gray-500 font-normal">Add, edit, and manage team member profiles</span>
        </h2>
        
        {/* Add/Edit Member Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role/Position *</label>
              <input 
                type="text" 
                placeholder="e.g., Founder, VP Operations, CTF Captain" 
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialty/Skills</label>
              <input 
                type="text" 
                placeholder="e.g., Penetration Testing, Digital Forensics" 
                value={newMember.specialty}
                onChange={e => setNewMember({...newMember, specialty: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initials (auto-generated if empty)</label>
              <input 
                type="text" 
                placeholder="e.g., AC, SM" 
                value={newMember.initials}
                onChange={e => setNewMember({...newMember, initials: e.target.value.toUpperCase().slice(0, 3)})}
                className="w-full p-3 border rounded-lg"
                maxLength="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Bio/Description</label>
              <textarea 
                placeholder="Brief description of the member's experience and background" 
                value={newMember.bio}
                onChange={e => setNewMember({...newMember, bio: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="3"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {editingMember ? (
              <>
                <button 
                  className="btn-cyber btn-cyber-primary"
                  onClick={handleUpdateMember}
                  disabled={!newMember.name || !newMember.role}
                >
                  💾 Update Member
                </button>
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={cancelMemberEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className="btn-cyber btn-cyber-primary"
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.role}
              >
                ➕ Add Member
              </button>
            )}
          </div>
        </div>

        {/* Team Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member._id} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-cyber-blue transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-cyber-blue text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {member.initials || member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-cyber-blue font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-blue-600 hover:bg-blue-100 rounded px-2 py-1 text-sm"
                    onClick={() => handleEditMember(member)}
                    title="Edit member"
                  >
                    ✏️
                  </button>
                  <button 
                    className="text-red-600 hover:bg-red-100 rounded px-2 py-1 text-sm"
                    onClick={() => handleDeleteMember(member._id)}
                    title="Delete member"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {member.specialty && (
                <p className="text-sm text-gray-600 mb-2 font-medium">🔧 {member.specialty}</p>
              )}
              
              {member.bio && (
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              )}
              
              <div className="mt-2 text-xs text-gray-400">
                Order: {member.order || 0} | Created: {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        
        {teamMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No team members added yet</p>
            <p>Add your first team member using the form above!</p>
          </div>
        )}
      </section>

      {/* Timeline Events Management */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          📅 Timeline Events Management
          <span className="ml-2 text-sm text-gray-500 font-normal">Add, edit, or remove timeline events</span>
        </h2>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newEvent} 
            onChange={e => setNewEvent(e.target.value)} 
            className="flex-1 p-3 border rounded-lg" 
            placeholder="New event title..." 
          />
          <button 
            className="btn-cyber btn-cyber-accent flex items-center gap-2 px-6" 
            onClick={handleAddEvent}
          >
            ➕ Add Event
          </button>
        </div>
        
        <div className="space-y-3">
          {timeline.map(event => (
            <div key={event._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {editEventId === event._id ? (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={editEventTitle} 
                    onChange={e => setEditEventTitle(e.target.value)} 
                    className="w-full p-3 border rounded-lg" 
                    placeholder="Event title" 
                  />
                  <textarea 
                    value={editEventDesc} 
                    onChange={e => setEditEventDesc(e.target.value)} 
                    className="w-full p-3 border rounded-lg" 
                    placeholder="Event description"
                    rows="3"
                  />
                  <input 
                    type="date" 
                    value={editEventDate} 
                    onChange={e => setEditEventDate(e.target.value)} 
                    className="w-full p-3 border rounded-lg" 
                  />
                  <div className="flex gap-2">
                    <button className="btn-cyber btn-cyber-primary" onClick={handleUpdateEvent}>💾 Save</button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={() => setEditEventId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    )}
                    {event.date && (
                      <p className="text-sm text-gray-500 mt-2">📅 {new Date(event.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      className="btn-cyber btn-cyber-accent px-3 py-1 text-sm" 
                      onClick={() => handleEditEvent(event)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="text-red-600 hover:bg-red-100 rounded px-3 py-1 text-sm font-medium" 
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {timeline.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No events in timeline</p>
            <p>Add your first event using the form above!</p>
          </div>
        )}
      </section>

      {/* Gallery Management */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          🖼️ Gallery Management
          <span className="ml-2 text-sm text-gray-500 font-normal">Upload and manage gallery images</span>
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-colors ${
            uploading ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}
          onDrop={handleImageUpload}
          onDragOver={e => e.preventDefault()}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            disabled={uploading} 
            className="mb-3" 
          />
          <div className="text-gray-600">
            <p className="font-medium">{uploading ? 'Uploading...' : 'Drag and drop images here or click to select'}</p>
            <p className="text-sm">Supported formats: JPG, PNG, GIF</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img) => (
            <div key={img._id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 group hover:border-cyber-blue transition-colors">
              <img 
                src={img.url} 
                alt="Gallery" 
                className="w-full h-32 object-cover rounded mb-3" 
              />
              
              {editImgId === img._id ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={editImgCaption} 
                    onChange={e => setEditImgCaption(e.target.value)} 
                    className="w-full p-2 border rounded text-sm" 
                    placeholder="Image caption" 
                  />
                  <div className="flex gap-2">
                    <button 
                      className="btn-cyber btn-cyber-primary text-xs px-3 py-1" 
                      onClick={handleUpdateImg}
                    >
                      💾 Save
                    </button>
                    <button 
                      className="text-xs px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600" 
                      onClick={() => setEditImgId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-600 mb-2 min-h-[2rem]">
                    {img.caption || 'No caption'}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="btn-cyber btn-cyber-accent text-xs px-3 py-1" 
                      onClick={() => handleEditImg(img)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDeleteImage(img._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {galleryImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No images in gallery</p>
            <p>Upload your first image using the area above!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;