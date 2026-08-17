export interface ContactRoute {
  id: 'general' | 'business' | 'press' | 'support' | 'privacy';
  label: string;
  email: string;
  description: string;
  subject: string;
  primary?: boolean;
}

export const contactRoutes: ContactRoute[] = [
  {
    id: 'general',
    label: 'General inquiries',
    email: 'hello@blightfall.ca',
    description: 'General questions and public inquiries.',
    subject: 'General inquiry',
    primary: true,
  },
  {
    id: 'business',
    label: 'Business',
    email: 'business@blightfall.ca',
    description: 'Business and partnership inquiries.',
    subject: 'Business inquiry',
  },
  {
    id: 'press',
    label: 'Press',
    email: 'press@blightfall.ca',
    description: 'Press and public-relations inquiries.',
    subject: 'Press inquiry',
  },
  {
    id: 'support',
    label: 'Game support',
    email: 'support@blightfall.ca',
    description: 'Game-related support inquiries.',
    subject: 'Support inquiry',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    email: 'privacy@blightfall.ca',
    description: 'Privacy questions and data requests.',
    subject: 'Privacy inquiry',
  },
];
