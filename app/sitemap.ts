import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jigsolitaire.online';
  const currentDate = new Date();

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/game`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/levels`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Generate level-specific URLs for better SEO
  // This helps search engines discover individual puzzle levels
  const totalLevels = 77; // Total puzzles available
  const levelPages: MetadataRoute.Sitemap = [];

  for (let level = 1; level <= totalLevels; level++) {
    // Every 5th level is a "hard" level - give them slightly higher priority
    const isHardLevel = level % 5 === 0;
    
    levelPages.push({
      url: `${baseUrl}/?level=${level}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: isHardLevel ? 0.7 : 0.6,
    });

    // Also add game page with level parameter
    levelPages.push({
      url: `${baseUrl}/game?level=${level}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: isHardLevel ? 0.65 : 0.55,
    });
  }

  // Collection pages (6 puzzles per collection)
  const collections = [
    'discovery',
    'nature', 
    'adventure',
    'serenity',
    'heritage',
    'horizons',
    'cosmos',
    'treasures',
  ];

  const collectionPages: MetadataRoute.Sitemap = collections.map((collection, index) => ({
    url: `${baseUrl}/levels#${collection}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.75 - (index * 0.02), // Slightly decreasing priority
  }));

  return [...corePages, ...collectionPages, ...levelPages];
}
