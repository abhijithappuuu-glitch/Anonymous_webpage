import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { eventAPI } from '../utils/api';

// DEPRECATED: Gallery page replaced by integrated timeline modal.
// Keeping temporarily in case of rollback; not routed anymore.
const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await eventAPI.getAll();
        setEvents(data.filter(e => e.images?.length > 0));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
  <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-cyber-blue text-glow text-center mb-12">
          PHOTO GALLERY
        </h1>

        {events.map((event) => (
          <div key={event._id} className="mb-24">
            <h2 className="text-3xl font-bold tracking-wide mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple inline-block">
              {event.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ rotateX: 3, rotateY: -3, scale: 1.03 }}
                  onClick={() => setSelectedImage(img)}
                  className="relative group glass border-gradient cursor-pointer overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={img.caption || event.title}
                    className="w-full h-60 object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/60 flex items-center justify-center text-center p-4">
                    <p className="text-text text-sm leading-relaxed">{img.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-w-full max-h-[90vh] object-contain rounded-lg border border-cyber-blue"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
