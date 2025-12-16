import { MetadataRoute } from 'next';

const BUILD_DATE = '2025-12-16';
const BASE_URL = 'https://jigsolitaire.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: BASE_URL + '/game',
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: BASE_URL + '/levels',
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: BASE_URL + '/settings',
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const totalLevels = 77;
  const levelPages: MetadataRoute.Sitemap = [];

  for (let level = 1; level <= totalLevels; level++) {
    const isHardLevel = level % 5 === 0;
    
    levelPages.push({
      url: BASE_URL + '/?level=' + level,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: isHardLevel ? 0.7 : 0.6,
    });

    levelPages.push({
      url: BASE_URL + '/game?level=' + level,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: isHardLevel ? 0.65 : 0.55,
    });
  }

  const collections = ['discovery', 'nature', 'adventure', 'serenity', 'heritage', 'horizons', 'cosmos', 'treasures'];

  const collectionPages: MetadataRoute.Sitemap = collections.map((collection, index) => ({
    url: BASE_URL + '/levels#' + collection,
    lastModified: BUILD_DATE,
    changeFrequency: 'weekly',
    priority: 0.75 - (index * 0.02),
  }));

  return [...corePages, ...collectionPages, ...levelPages];
}