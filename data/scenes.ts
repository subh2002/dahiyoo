export interface Scene {
  id: string;
  folderPath: string;
  totalFrames: number;
  flavor: string;
  tagline: string;
  description: string;
  fruit: string;
  ctaText: string;
}

export const scenes: Scene[] = [
  {
    id: 'hero1',
    folderPath: '/frames/1 Hero',
    totalFrames: 200,
    flavor: 'Strawberry',
    tagline: 'Red. Real. Refreshing.',
    description: 'Fresh strawberry froyo. Real fruit. Zero guilt. The swirl that started it all.',
    fruit: 'Strawberry',
    ctaText: 'Order on Zomato',
  },
  {
    id: 'hero2',
    folderPath: '/frames/2 Hero',
    totalFrames: 51,
    flavor: 'Blueberry',
    tagline: 'Deep. Bold. Unforgettable.',
    description: 'Dark blueberry compote meets pure white froyo. One swirl, a hundred reasons to come back.',
    fruit: 'Blueberry',
    ctaText: 'Order on Zomato',
  },
  {
    id: 'hero3',
    folderPath: '/frames/3 Hero',
    totalFrames: 125,
    flavor: 'Mango',
    tagline: 'Golden. Sweet. Unstoppable.',
    description: 'Alphonso mango froyo. Summer in every swirl. The king of fruits, now in a cup.',
    fruit: 'Mango',
    ctaText: 'Order on Zomato',
  },
];
