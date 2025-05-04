// src/utils/mockData.ts
import { Article } from '../types/article.types';
import { generateId } from './string.utils';

// Mock data cho articles
export const mockArticles: Article[] = [
    {
        id: generateId(),
        title: 'The Rise of Artificial Intelligence in Healthcare',
        content: 'AI is transforming healthcare with better diagnostics and personalized treatment plans...',
        source: 'Tech Health Journal',
        author: 'Dr. Sarah Johnson',
        publishedAt: new Date(2025, 4, 1), // May 1, 2025
        url: 'https://techhealthjournal.com/ai-healthcare',
        imageUrl: 'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-b6ec-61f7-a503-c4b914edad6b/raw?se=2025-05-04T02%3A23%3A47Z&sp=r&sv=2024-08-04&sr=b&scid=e4d3599d-5e4c-5bf4-ad73-5a97f4e54bcb&skoid=dfdaf859-26f6-4fed-affc-1befb5ac1ac2&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-03T19%3A35%3A26Z&ske=2025-05-04T19%3A35%3A26Z&sks=b&skv=2024-08-04&sig=E%2BrO4XD0sETimQlJ0vj9poUyZoNV2nSZqAl93DRSGDc%3D'
    },
    {
        id: generateId(),
        title: 'Global Climate Summit Reaches Landmark Agreement',
        content: 'World leaders have committed to ambitious carbon reduction targets...',
        source: 'Global News Network',
        author: 'Michael Chen',
        publishedAt: new Date(2025, 4, 2), // May 2, 2025
        url: 'https://gnn.com/climate-summit-agreement',
        imageUrl: 'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-fa58-61f7-995d-2bd3f66f96f3/raw?se=2025-05-04T02%3A17%3A09Z&sp=r&sv=2024-08-04&sr=b&scid=172dbf1f-4829-52b0-908c-92389d331c55&skoid=dfdaf859-26f6-4fed-affc-1befb5ac1ac2&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-03T19%3A37%3A36Z&ske=2025-05-04T19%3A37%3A36Z&sks=b&skv=2024-08-04&sig=gY789iGQnVTWVXdLXT5meNVG9ialQ0cAY5dueoJF1PM%3D'
    },
    {
        id: generateId(),
        title: 'Next Generation Quantum Computers Break Processing Records',
        content: 'Scientists have achieved quantum supremacy with processors that can solve complex problems...',
        source: 'Science Today',
        author: 'Dr. Alan Reeves',
        publishedAt: new Date(2025, 4, 2), // May 2, 2025
        url: 'https://sciencetoday.org/quantum-breakthrough',
        imageUrl: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-56c4-622f-8c0c-16496a1c3077/raw?se=2025-05-04T02%3A17%3A02Z&sp=r&sv=2024-08-04&sr=b&scid=34d6c131-fd6e-5645-8141-14902445ad62&skoid=de76bc29-7017-43d4-8d90-7a49512bae0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-04T01%3A13%3A43Z&ske=2025-05-05T01%3A13%3A43Z&sks=b&skv=2024-08-04&sig=3grMty/eOAOKaoebvQNxk6dNnsldCIN4w/Ds0VKhC4g%3D'
    },
    {
        id: generateId(),
        title: 'New Study Reveals Benefits of Mediterranean Diet',
        content: 'Research confirms that the Mediterranean diet can reduce the risk of heart disease by up to 30%...',
        source: 'Health & Nutrition',
        author: 'Emma Rodriguez, PhD',
        publishedAt: new Date(2025, 4, 1), // May 1, 2025
        url: 'https://healthnutrition.com/mediterranean-diet-benefits',
        imageUrl: 'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-1914-61f7-b382-28eb8cfe3af6/raw?se=2025-05-04T02%3A20%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=35323a70-1ead-5750-bdf1-3af7800b80d0&skoid=dfdaf859-26f6-4fed-affc-1befb5ac1ac2&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-03T19%3A35%3A16Z&ske=2025-05-04T19%3A35%3A16Z&sks=b&skv=2024-08-04&sig=BllPJV0%2BPRWz8FdmT25RzIkPAT4Pz47krk0K5BbJw1Y%3D'
    },
    {
        id: generateId(),
        title: 'Space Tourism Company Announces First Civilian Moon Mission',
        content: 'SpaceX has revealed plans to take private citizens on a lunar orbit by the end of 2026...',
        source: 'Space Exploration Monthly',
        author: 'Nguyen Minh Hieu',
        publishedAt: new Date(2025, 4, 3), // May 3, 2025
        url: 'https://spaceexploration.com/civilian-moon-mission',
        imageUrl: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-a070-622f-b811-b64979a8ddde/raw?se=2025-05-04T02%3A23%3A30Z&sp=r&sv=2024-08-04&sr=b&scid=94976d89-7491-5db9-9e1b-41e39b5360b0&skoid=de76bc29-7017-43d4-8d90-7a49512bae0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-03T19%3A37%3A16Z&ske=2025-05-04T19%3A37%3A16Z&sks=b&skv=2024-08-04&sig=FZsAbJBWroFaovhNhXCYfnn9UjQSSrJq2yC%2B2x%2BrBc8%3D'
    }
];

// Simulated API to get articles
export const getArticles = (): Promise<Article[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockArticles);
        }, 500); // Simulate network delay
    });
};