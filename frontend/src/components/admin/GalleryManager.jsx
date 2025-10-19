import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../utils/api';

const GalleryManager = ({ refreshStats }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API}/admin/gallery`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setImages(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);

    try {
      await fetch(`${API}/admin/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      alert('Image uploaded successfully!');
      fetchImages();
      setSelectedFile(null);
      setCaption('');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload image');
    }
  };

  const handleUpdateCaption = async (id) => {
    try {
      await fetch(`${API}/admin/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ caption: editCaption })
      });
      
      alert('Caption updated!');
      fetchImages();
      setEditingId(null);
      setEditCaption('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`${API}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchImages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
        Gallery Manager
      </h2>

      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption"
            className={`w-full px-4 py-2 rounded-lg ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'} focus:outline-none focus:ring-2 focus:ring-cyber-blue`}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'}`}
        >
          📤 Upload Image
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {images.map(image => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${theme === 'hacker' ? 'bg-hacker-panel/30 border border-hacker-green/20' : 'bg-black/20 border border-white/10'} rounded-lg overflow-hidden`}
          >
            <img 
              src={`${API}${image.url}`} 
              alt={image.caption} 
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              {editingId === image._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className={`w-full px-2 py-1 rounded text-sm ${theme === 'hacker' ? 'bg-hacker-panel/50 border border-hacker-green/30 text-hacker-green' : 'bg-black/30 border border-cyber-blue/30'}`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCaption(image._id)}
                      className="flex-1 px-2 py-1 text-xs rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditCaption(''); }}
                      className="flex-1 px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm mb-2 line-clamp-2">{image.caption || 'No caption'}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingId(image._id); setEditCaption(image.caption || ''); }}
                      className="flex-1 px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="flex-1 px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
