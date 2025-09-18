/**
 * @type {import('./types.js').User[]}
 */
export const SEED_USERS = [
  {
    id: 'user1',
    name: 'Aunty Z',
    phone: '080-300-0001',
    completedCount: 5,
    trusted: true,
    earnings: 2400
  },
  {
    id: 'user2', 
    name: 'Jide',
    phone: '080-300-0002',
    completedCount: 2,
    trusted: false,
    earnings: 800
  },
  {
    id: 'user3',
    name: 'Ngozi',
    phone: '080-300-0003', 
    completedCount: 8,
    trusted: true,
    earnings: 4200
  },
  {
    id: 'user4',
    name: 'Sani',
    phone: '080-400-0004',
    completedCount: 15,
    trusted: true,
    earnings: 0 // Task Manager
  }
];

/**
 * @type {import('./types.js').Task[]}
 */
export const SEED_TASKS = [
  {
    id: 'task1',
    title: 'Clean market stall',
    description: 'Need help cleaning my vegetable stall after market hours. Should take about 2 hours.',
    pay: 800,
    location: 'Ikeja Market',
    dateTime: '2025-01-15T16:00:00Z',
    mode: 'single',
    status: 'active',
    posterId: 'user1',
    applicants: [],
    proofRequired: true,
    escrowRequired: false,
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'task2', 
    title: 'Deliver documents to office',
    description: 'Pick up documents from my house and deliver to office in Victoria Island.',
    pay: 1200,
    location: 'Lagos Island',
    dateTime: '2025-01-15T14:30:00Z', 
    mode: 'applications',
    status: 'active',
    posterId: 'user3',
    applicants: [
      {
        userId: 'user2',
        note: 'I have a bike, can deliver quickly',
        appliedAt: '2025-01-15T11:00:00Z',
        distance: 2.5
      }
    ],
    proofRequired: true,
    escrowRequired: false,
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'task3',
    title: 'Help move furniture', 
    description: 'Need 2 people to help move furniture from old apartment to new one.',
    pay: 6000,
    location: 'Surulere',
    dateTime: '2025-01-16T09:00:00Z',
    mode: 'applications', 
    status: 'active',
    posterId: 'user1',
    applicants: [],
    proofRequired: false,
    escrowRequired: true,
    createdAt: '2025-01-15T12:00:00Z'
  }
];