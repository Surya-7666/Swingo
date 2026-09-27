import { Palette, Smile, Zap, Settings as SettingsIcon, Info } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'charms', label: 'Charms', icon: Smile },
  { id: 'interaction', label: 'Interaction', icon: Zap },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'about', label: 'About', icon: Info },
];

export const ROPE_STYLES = [
  {
    id: 'custom-cord',
    name: 'Custom Cord',
    type: 'cord',
    color: '#6366f1',
    accent: '#a5b4fc',
  },
  {
    id: 'gold-chain',
    name: 'Gold Chain',
    type: 'gold-chain',
    color: '#eab308',
    accent: '#fef08a',
  },
  {
    id: 'silver-chain',
    name: 'Silver Chain',
    type: 'silver-chain',
    color: '#94a3b8',
    accent: '#f8fafc',
  },
  {
    id: 'black-thread',
    name: 'Silk Thread',
    type: 'cord',
    color: '#1e293b',
    accent: '#475569',
  },
  {
    id: 'crimson-thread',
    name: 'Sacred Red',
    type: 'cord',
    color: '#dc2626',
    accent: '#f87171',
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Charms' },
  { id: 'cultural', label: 'Cultural & Temples' },
  { id: 'marvel', label: 'Marvel / Avengers' },
  { id: 'Bikes', label: 'Bikes' },
  // { id: 'anime', label: 'Anime' },
  { id: 'cartoon', label: 'Cartoons' },
  { id: 'memes', label: 'Comedy Memes' },
  { id: 'emojis', label: 'Emojis & Objects' },
];

export const CHARMS = [
  // 1. Cultural & Temples
  { id: 'cultural-1', name: 'Nimbu Mirchi', category: 'cultural', image: './charms/cultural/nimbu-mirchi.png' },
  { id: 'cultural-2', name: 'Murugan Vel', category: 'cultural', image: './charms/cultural/vel (2).png' },
  { id: 'cultural-3', name: 'Ganapati', category: 'cultural', image: './charms/cultural/ganesh.png' },
  { id: 'cultural-4', name: 'Jesus Cross', category: 'cultural', image: './charms/cultural/cross.png' },
  { id: 'cultural-5', name: 'Moon', category: 'cultural', image: './charms/cultural/moon.png' },
  { id: 'cultural-6', name: 'Thrisul', category: 'cultural', image: './charms/cultural/thrisul.png' },
  { id: 'cultural-7', name: 'Bommai', category: 'cultural', image: './charms/cultural/bommai.png' },
  { id: 'cultural-8', name: 'Bell', category: 'cultural', image: './charms/cultural/bell.png' },

  // 2. Marvel / Avengers
  { id: 'marvel-1', name: 'Captain America Shield', category: 'marvel', image: './charms/marvel/captain america.png' },
  { id: 'marvel-2', name: 'Spider', category: 'marvel', image: './charms/marvel/spider.png' },
  { id: 'marvel-3', name: 'Infinity Stone', category: 'marvel', image: './charms/marvel/infinity stone.png' },
  { id: 'marvel-4', name: 'StormBreaker', category: 'marvel', image: './charms/marvel/stormbreaker.png' },


  // 3. bikes
  { id: 'Bikes-1', name: 'R15', category: 'Bikes', image: './charms/bikes/r15.png' },
  { id: 'Bikes-2', name: 'Bullet', category: 'Bikes', image: './charms/bikes/bullet.png' },
  { id: 'Bikes-3', name: 'Harley Davidson', category: 'Bikes', image: './charms/bikes/harley.png' },
  { id: 'Bikes-4', name: 'KTM', category: 'Bikes', image: './charms/bikes/ktm.png' },
  { id: 'Bikes-5', name: 'Pulsar', category: 'Bikes', image: './charms/bikes/pulsar.png' },



  // 4. Cartoons
  { id: 'cartoon-1', name: 'Ben 10 Omnitrix', category: 'cartoon', image: './charms/cartoon/ben 10.png' },
  { id: 'cartoon-2', name: 'Tom', category: 'cartoon', image: './charms/cartoon/tom.png' },
  { id: 'cartoon-3', name: 'Jackie Chan', category: 'cartoon', image: './charms/cartoon/jackie chan.png' },
  { id: 'cartoon-4', name: 'Squid Game', category: 'cartoon', image: './charms/cartoon/squid.png' },


  // 5. Emojis & Objects
  { id: 'emoji-1', name: 'Evil Eye', category: 'emojis', image: './charms/emojis/evileye.png' },
  { id: 'emoji-2', name: 'Football', category: 'emojis', image: './charms/emojis/football.png' },
  { id: 'emoji-3', name: 'Smiley Face', category: 'emojis', image: './charms/emojis/smiley.png' },
  { id: 'emoji-4', name: 'Heart', category: 'emojis', image: './charms/emojis/heart.png' },
  { id: 'emoji-5', name: 'Love', category: 'emojis', image: './charms/emojis/love.png' },

 // 6. Memes
  { id: 'meme-1', name: 'Aahaan', category: 'memes', image: './charms/memes/aahaan.png' },
  { id: 'meme-2', name: 'Chellom', category: 'memes', image: './charms/memes/Chellom.png' },
  { id: 'meme-3', name: 'Vadachennai', category: 'memes', image: './charms/memes/Vadachennai.png' },

  { id: 'meme-4', name: 'Gangster Ganesh', category: 'memes', image: './charms/memes/Gangster Ganesh.png' },
];