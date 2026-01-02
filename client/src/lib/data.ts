import heroImage from '@assets/generated_images/abstract_3d_tech_shapes_hero_background.png';
import tshirtImage from '@assets/stock_images/developer_t-shirt_b2f7cffb.jpg';
import stickersImage from '@assets/stock_images/laptop_stickers_deve_80ac774e.jpg';
import bottleImage from '@assets/stock_images/modern_water_bottle_e103ebcc.jpg';
import hoodieImage from '@assets/stock_images/developer_hoodie_30be8d48.jpg';
import backpackImage from '@assets/stock_images/tech_backpack_cf11bd3b.jpg';
import socksImage from '@assets/stock_images/developer_socks_b682cdc0.jpg';
import notebookImage from '@assets/stock_images/branded_notebook_15ec5621.jpg';
import hackathonStickersImage from '@assets/stock_images/hackathon_stickers_5a39c9ef.jpg';

export type SwagCategory = 'Hackathon' | 'Internship' | 'Open Source' | 'Conference' | 'Program';

export interface SwagItem {
  id: string;
  title: string;
  company: string;
  description: string;
  category: SwagCategory;
  image: string;
  tags: string[];
  requirements: string[];
  link: string;
  isFeatured?: boolean;
  status: 'active' | 'expired' | 'upcoming';
  videoUrl?: string;
}

export const CATEGORIES: SwagCategory[] = ['Hackathon', 'Internship', 'Open Source', 'Conference', 'Program'];

export const MOCK_SWAG_ITEMS: SwagItem[] = [
  {
    id: '1',
    title: 'Hacktoberfest 2025 Kit',
    company: 'DigitalOcean',
    description: 'Complete 4 pull requests to open source repositories during October to earn a limited edition t-shirt or plant a tree. This annual event encourages participation in the open source community.',
    category: 'Open Source',
    image: tshirtImage,
    tags: ['T-Shirt', 'Stickers', 'Global', 'Seasonal'],
    requirements: ['Register on official site', '4 PRs merged in October', 'Follow participation rules'],
    link: 'https://hacktoberfest.com',
    isFeatured: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'Microsoft Learn Student Ambassadors',
    company: 'Microsoft',
    description: 'Become a student ambassador to lead a community, organize events, and get a welcome kit including a polo shirt, certificate, LinkedIn premium, and more. Advance through milestones to unlock more swag like backpacks and event support.',
    category: 'Program',
    image: backpackImage,
    tags: ['Kit', 'Certificate', 'Software', 'Community'],
    requirements: ['Apply online', 'Record submission video', 'Host 1 event per quarter'],
    link: 'https://studentambassadors.microsoft.com',
    isFeatured: true,
    status: 'active'
  },
  {
    id: '3',
    title: 'GitHub Student Developer Pack',
    company: 'GitHub',
    description: 'The ultimate swag bag of digital tools! Get free access to GitHub Copilot, Canva Pro, Namecheap domains, JetBrains IDEs, and credits for DigitalOcean and Azure. While mostly digital, partners often send physical swag to verified students.',
    category: 'Program',
    image: stickersImage,
    tags: ['Software', 'Credits', 'Global', 'Tools'],
    requirements: ['Verify student status', 'Have school email'],
    link: 'https://education.github.com/pack',
    status: 'active'
  },
  {
    id: '4',
    title: 'Google Developer Student Clubs (GDSC)',
    company: 'Google',
    description: 'Lead a Google Developer Student Club at your university. Leads receive an exclusive swag kit with t-shirts, stickers, and event materials. Members also get opportunities to win swag during challenges.',
    category: 'Program',
    image: tshirtImage,
    tags: ['Leadership', 'T-Shirt', 'Community', 'Events'],
    requirements: ['Apply to be a Lead', 'Interview', 'Build a core team'],
    link: 'https://developers.google.com/community/gdsc',
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'MLH Member Hackathon Season',
    company: 'Major League Hacking',
    description: 'Participate in MLH-sanctioned hackathons to receive the season\'s official t-shirt, stickers, and sponsor swag. Winning teams often get tech gadgets, hardware kits, or cash prizes.',
    category: 'Hackathon',
    image: hackathonStickersImage,
    tags: ['T-Shirt', 'Stickers', 'Gadgets', 'Competition'],
    requirements: ['Register for MLH event', 'Check-in at event', 'Submit project'],
    link: 'https://mlh.io/seasons/2025/events',
    status: 'active'
  },
  {
    id: '6',
    title: 'Auth0 Ambassador Program',
    company: 'Okta',
    description: 'Join the Auth0 Ambassador program to advocate for secure identity. Ambassadors get a welcome pack with a hoodie, stickers, and opportunities for travel support to conferences.',
    category: 'Program',
    image: hoodieImage,
    tags: ['Hoodie', 'Travel', 'Advocacy', 'Security'],
    requirements: ['Apply', 'Create content', 'Speak at events'],
    link: 'https://auth0.com/ambassador-program',
    status: 'active'
  },
  {
    id: '7',
    title: 'Postman Student Leader Program',
    company: 'Postman',
    description: 'Become a leader in API literacy on your campus. Student Leaders get a certification, exclusive swag kit (t-shirt, socks, bottle), and training resources to host API workshops.',
    category: 'Program',
    image: socksImage,
    tags: ['Socks', 'Certification', 'Workshops', 'API'],
    requirements: ['Complete Student Expert training', 'Apply for Leader', 'Host workshop'],
    link: 'https://www.postman.com/student-program/student-leader/',
    status: 'active'
  },
  {
    id: '8',
    title: 'Twilio SIGNAL Conference Swag',
    company: 'Twilio',
    description: 'Attendees of the annual SIGNAL conference (virtual or in-person) often receive a swag box containing a t-shirt, notebook, and the famous Twilio track jacket (for challenges).',
    category: 'Conference',
    image: notebookImage,
    tags: ['Notebook', 'Apparel', 'Conference', 'Seasonal'],
    requirements: ['Register for SIGNAL', 'Complete "Superclass" challenge'],
    link: 'https://signal.twilio.com',
    status: 'upcoming'
  },
  {
    id: '9',
    title: 'MongoDB Student Advocacy Program',
    company: 'MongoDB',
    description: 'Advocate for modern databases and receive perks. Active participants can earn swag drops including hoodies, mugs, and plushies.',
    category: 'Program',
    image: bottleImage,
    tags: ['Hoodie', 'Plushie', 'Database', 'Advocacy'],
    requirements: ['Join community', 'Contribute blogs/code', 'Host meetups'],
    link: 'https://www.mongodb.com/students',
    status: 'active'
  },
  {
    id: '10',
    title: 'Figma Student Groups',
    company: 'Figma',
    description: 'Lead or join a Figma student group to get design swag. Leaders receive a kit with tote bags, pins, stickers, and socks to distribute at events.',
    category: 'Program',
    image: backpackImage,
    tags: ['Design', 'Tote Bag', 'Pins', 'Creative'],
    requirements: ['Apply to lead', 'Host design workshops', 'Report events'],
    link: 'https://www.figma.com/education/students/',
    status: 'active'
  },
  {
    id: '11',
    title: 'Stripe CTF / Capture the Flag',
    company: 'Stripe',
    description: 'Participate in Stripe\'s occasional engineering challenges. Winners and top participants historically receive high-quality t-shirts and sometimes mechanical keyboards.',
    category: 'Hackathon',
    image: tshirtImage,
    tags: ['T-Shirt', 'Challenge', 'Engineering', 'Exclusive'],
    requirements: ['Solve engineering puzzles', 'Rank on leaderboard'],
    link: 'https://stripe.com/ctf',
    status: 'upcoming'
  },
  {
    id: '12',
    title: 'Vercel Community Swag',
    company: 'Vercel',
    description: 'Vercel frequently drops swag for contributors to their open source projects (like Next.js) or for winning specific deployment challenges on Twitter/X.',
    category: 'Open Source',
    image: hoodieImage,
    tags: ['Hoodie', 'Mug', 'Deployment', 'Next.js'],
    requirements: ['Contribute code', 'Participate in social challenges'],
    link: 'https://vercel.com/community',
    status: 'active'
  },
  {
    id: '13',
    title: 'Notion Campus Leaders',
    company: 'Notion',
    description: 'Bring Notion to your campus. Leaders get a "Notion for Students" swag box with stickers, a t-shirt, and sometimes a backpack or notebook.',
    category: 'Program',
    image: notebookImage,
    tags: ['Productivity', 'Community', 'T-Shirt', 'Leadership'],
    requirements: ['Apply', 'Host Notion workshop', 'Build templates'],
    link: 'https://www.notion.so/students',
    status: 'active'
  }
];

export const HERO_IMAGE = heroImage;
