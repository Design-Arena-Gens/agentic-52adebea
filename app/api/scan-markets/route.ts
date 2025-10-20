import { NextResponse } from 'next/server';

// Simulated market data scraping
// In production, this would use actual web scraping with Puppeteer/Cheerio
interface MarketData {
  platform: string;
  category: string;
  searchVolume: number;
  competitorCount: number;
  averageRating: number;
  reviewCount: number;
  priceRange: [number, number];
  keywords: string[];
}

// Competition scoring algorithm
function calculateCompetitionScore(competitorCount: number, avgRating: number): number {
  const normalizedCompetitors = Math.min(competitorCount / 1000, 1) * 60;
  const ratingFactor = avgRating >= 4.5 ? 20 : avgRating >= 4.0 ? 10 : 0;
  return Math.min(normalizedCompetitors + ratingFactor, 100);
}

// Buying intent analysis based on review sentiment and sales velocity
function calculateBuyingIntent(reviewCount: number, searchVolume: number, competitorCount: number): number {
  const reviewVelocity = reviewCount / Math.max(competitorCount, 1);
  const searchToCompetitionRatio = searchVolume / Math.max(competitorCount, 1);

  const reviewScore = Math.min((reviewVelocity / 100) * 40, 40);
  const demandScore = Math.min((searchToCompetitionRatio / 50) * 60, 60);

  return Math.min(reviewScore + demandScore, 100);
}

// Simulated market data for various digital product categories
const simulatedMarketData: MarketData[] = [
  {
    platform: 'amazon',
    category: 'Budget Planner Journal',
    searchVolume: 45000,
    competitorCount: 120,
    averageRating: 4.2,
    reviewCount: 3400,
    priceRange: [6.99, 14.99],
    keywords: ['budget planner', 'finance tracker', 'money management', 'expense journal', 'savings planner']
  },
  {
    platform: 'etsy',
    category: 'Mindfulness Coloring Book',
    searchVolume: 38000,
    competitorCount: 85,
    averageRating: 4.1,
    reviewCount: 2200,
    priceRange: [7.99, 12.99],
    keywords: ['mindfulness coloring', 'stress relief', 'adult coloring', 'meditation art', 'relaxation']
  },
  {
    platform: 'amazon',
    category: 'Social Media Content Planner',
    searchVolume: 52000,
    competitorCount: 95,
    averageRating: 4.3,
    reviewCount: 4100,
    priceRange: [8.99, 16.99],
    keywords: ['content calendar', 'social media planner', 'instagram planner', 'content strategy', 'post scheduler']
  },
  {
    platform: 'etsy',
    category: 'Wedding Planning Checklist',
    searchVolume: 67000,
    competitorCount: 240,
    averageRating: 4.5,
    reviewCount: 8900,
    priceRange: [5.99, 19.99],
    keywords: ['wedding planner', 'bride checklist', 'wedding organizer', 'ceremony planning', 'wedding timeline']
  },
  {
    platform: 'amazon',
    category: 'Habit Tracker Journal',
    searchVolume: 41000,
    competitorCount: 110,
    averageRating: 4.0,
    reviewCount: 2800,
    priceRange: [6.99, 13.99],
    keywords: ['habit tracker', 'daily habits', 'productivity journal', 'goal tracker', 'routine planner']
  },
  {
    platform: 'etsy',
    category: 'Recipe Organization Templates',
    searchVolume: 34000,
    competitorCount: 65,
    averageRating: 3.9,
    reviewCount: 1600,
    priceRange: [4.99, 11.99],
    keywords: ['recipe cards', 'cookbook template', 'meal planner', 'cooking organizer', 'recipe binder']
  },
  {
    platform: 'amazon',
    category: 'Gratitude Journal Prompts',
    searchVolume: 48000,
    competitorCount: 150,
    averageRating: 4.4,
    reviewCount: 5200,
    priceRange: [7.99, 15.99],
    keywords: ['gratitude journal', 'thankful prompts', 'positive thinking', 'daily gratitude', 'mindfulness journal']
  },
  {
    platform: 'etsy',
    category: 'Kids Activity Puzzle Book',
    searchVolume: 56000,
    competitorCount: 180,
    averageRating: 4.3,
    reviewCount: 6700,
    priceRange: [5.99, 14.99],
    keywords: ['kids puzzles', 'activity book', 'children games', 'brain teasers', 'educational puzzles']
  },
  {
    platform: 'amazon',
    category: 'Fitness Workout Log',
    searchVolume: 39000,
    competitorCount: 105,
    averageRating: 4.1,
    reviewCount: 3100,
    priceRange: [6.99, 14.99],
    keywords: ['workout log', 'exercise tracker', 'fitness journal', 'gym log', 'training diary']
  },
  {
    platform: 'etsy',
    category: 'Motivational Quote Stickers',
    searchVolume: 44000,
    competitorCount: 320,
    averageRating: 4.6,
    reviewCount: 12000,
    priceRange: [3.99, 9.99],
    keywords: ['motivational stickers', 'inspirational quotes', 'planner stickers', 'affirmation stickers', 'positive vibes']
  }
];

export async function POST(request: Request) {
  try {
    const { platforms } = await request.json();

    // Simulate processing delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter and analyze market data
    const filteredData = simulatedMarketData.filter(data =>
      platforms.includes(data.platform)
    );

    // Calculate opportunity scores and filter high-potential products
    const trends = filteredData.map(data => {
      const competition = calculateCompetitionScore(data.competitorCount, data.averageRating);
      const buyingIntent = calculateBuyingIntent(data.reviewCount, data.searchVolume, data.competitorCount);
      const averagePrice = (data.priceRange[0] + data.priceRange[1]) / 2;
      const salesVelocity = data.reviewCount / Math.max(data.competitorCount, 1);

      return {
        productType: data.category,
        searchVolume: data.searchVolume,
        competition: Math.round(competition),
        buyingIntent: Math.round(buyingIntent),
        keywords: data.keywords,
        averagePrice: Math.round(averagePrice * 100) / 100,
        salesVelocity: Math.round(salesVelocity * 100) / 100,
        opportunityScore: (100 - competition) * 0.3 + buyingIntent * 0.4 + Math.min(data.searchVolume / 1000, 50) * 0.3
      };
    })
    .filter(trend =>
      trend.searchVolume >= 30000 && // Minimum 30k monthly searches
      trend.competition <= 50 && // Low to medium competition
      trend.buyingIntent >= 50 // High buying intent
    )
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 6); // Top 6 opportunities

    return NextResponse.json({
      success: true,
      trends,
      scannedPlatforms: platforms,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market scan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan markets' },
      { status: 500 }
    );
  }
}
