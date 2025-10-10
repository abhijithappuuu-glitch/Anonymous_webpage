import React from 'react';

const clubHistory = [
  {
    year: '2018',
    title: 'Club Founded',
    description: 'Anonymous Club was founded by a group of passionate students to foster innovation and collaboration in technology.'
  },
  {
    year: '2019',
    title: 'First Hackathon',
    description: 'Hosted our first hackathon, attracting over 100 participants and launching several successful projects.'
  },
  {
    year: '2020',
    title: 'Community Expansion',
    description: 'Expanded our community to include workshops, webinars, and guest lectures from industry experts.'
  },
  {
    year: '2021',
    title: 'Cybersecurity Initiative',
    description: 'Launched a cybersecurity awareness program and partnered with local organizations for outreach.'
  },
  {
    year: '2022',
    title: 'Innovation Awards',
    description: 'Recognized club members for outstanding contributions in tech innovation and leadership.'
  },
  {
    year: '2023',
    title: 'Global Collaboration',
    description: 'Collaborated with international clubs and hosted virtual events with global participation.'
  },
  {
    year: '2024',
    title: 'AI & ML Bootcamp',
    description: 'Organized a bootcamp focused on artificial intelligence and machine learning.'
  },
  {
    year: '2025',
    title: 'Future Vision',
    description: 'Continuing to innovate and inspire, Anonymous Club looks forward to new challenges and opportunities.'
  }
];

const Timeline = () => (
  <div className="min-h-screen bg-cyber-dark py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 text-cyber-blue">Club Timeline</h1>
      <ol className="relative border-l-4 border-cyber-blue/40">
        {clubHistory.map((event, idx) => (
          <li key={idx} className="mb-10 ml-6">
            <div className="absolute w-4 h-4 bg-cyber-blue rounded-full -left-2 border-2 border-white"></div>
            <div className="bg-black/60 p-6 rounded-lg shadow-lg">
              <span className="text-cyber-green font-mono text-xs">{event.year}</span>
              <h3 className="text-xl font-bold text-cyber-blue mt-2 mb-1">{event.title}</h3>
              <p className="text-gray-300 text-sm">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

export default Timeline;
