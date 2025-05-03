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
        imageUrl: '/article-placeholder.jpg'
    },
    {
        id: generateId(),
        title: 'Global Climate Summit Reaches Landmark Agreement',
        content: 'World leaders have committed to ambitious carbon reduction targets...',
        source: 'Global News Network',
        author: 'Michael Chen',
        publishedAt: new Date(2025, 4, 2), // May 2, 2025
        url: 'https://gnn.com/climate-summit-agreement',
        imageUrl: '/article-placeholder.jpg'
    },
    {
        id: generateId(),
        title: 'Next Generation Quantum Computers Break Processing Records',
        content: 'Scientists have achieved quantum supremacy with processors that can solve complex problems...',
        source: 'Science Today',
        author: 'Dr. Alan Reeves',
        publishedAt: new Date(2025, 4, 2), // May 2, 2025
        url: 'https://sciencetoday.org/quantum-breakthrough',
        imageUrl: '/article-placeholder.jpg'
    },
    {
        id: generateId(),
        title: 'New Study Reveals Benefits of Mediterranean Diet',
        content: 'Research confirms that the Mediterranean diet can reduce the risk of heart disease by up to 30%...',
        source: 'Health & Nutrition',
        author: 'Emma Rodriguez, PhD',
        publishedAt: new Date(2025, 4, 1), // May 1, 2025
        url: 'https://healthnutrition.com/mediterranean-diet-benefits',
        imageUrl: '/article-placeholder.jpg'
    },
    {
        id: generateId(),
        title: 'Space Tourism Company Announces First Civilian Moon Mission',
        content: 'SpaceX has revealed plans to take private citizens on a lunar orbit by the end of 2026...',
        source: 'Space Exploration Monthly',
        author: 'James Anderson',
        publishedAt: new Date(2025, 4, 3), // May 3, 2025
        url: 'https://spaceexploration.com/civilian-moon-mission',
        imageUrl: '/article-placeholder.jpg'
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