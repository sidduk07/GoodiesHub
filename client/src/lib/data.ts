import heroImage from '@assets/generated_images/abstract_3d_tech_shapes_hero_background.png';
import tshirtImage from '@assets/stock_images/developer_t-shirt_b2f7cffb.jpg';
import stickersImage from '@assets/stock_images/laptop_stickers_deve_80ac774e.jpg';
import bottleImage from '@assets/stock_images/modern_water_bottle_e103ebcc.jpg';

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
    description: 'Complete 4 pull requests to open source repositories during October to earn a limited edition t-shirt or plant a tree.',
    category: 'Open Source',
    image: tshirtImage,
    tags: ['T-Shirt', 'Stickers', 'Global'],
    requirements: ['4 PRs merged', 'Register on official site'],
    link: 'https://hacktoberfest.com',
    isFeatured: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'Google Cloud Innovators Swag',
    company: 'Google Cloud',
    description: 'Join the innovators program and complete the cloud skills challenge to receive a water bottle and sticker pack.',
    category: 'Program',
    image: bottleImage,
    tags: ['Bottle', 'Stickers', 'Cloud'],
    requirements: ['Complete 3 labs', 'Join Innovators Program'],
    link: '#',
    status: 'active'
  },
  {
    id: '3',
    title: 'Vercel Ship Stickers',
    company: 'Vercel',
    description: 'Exclusive sticker pack for Vercel Ship conference attendees and virtual participants.',
    category: 'Conference',
    image: stickersImage,
    tags: ['Stickers', 'Limited Edition'],
    requirements: ['Register for Vercel Ship'],
    link: '#',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Microsoft Student Ambassador',
    company: 'Microsoft',
    description: 'Become a student ambassador to get a welcome kit including a polo shirt, certificate, and LinkedIn premium.',
    category: 'Internship',
    image: tshirtImage, // Reusing for mock
    tags: ['Kit', 'Certificate', 'Software'],
    requirements: ['Apply', 'Interview', 'Host event'],
    link: '#',
    status: 'active'
  },
  {
    id: '5',
    title: 'Auth0 Hackathon Pack',
    company: 'Okta',
    description: 'Build an app using Auth0 to win a mechanical keyboard and hoodie.',
    category: 'Hackathon',
    image: heroImage, // Placeholder
    tags: ['Hoodie', 'Keyboard', 'Prizes'],
    requirements: ['Submit project', 'Use Auth0'],
    link: '#',
    status: 'active'
  }
];

export const HERO_IMAGE = heroImage;
