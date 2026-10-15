/**
 * Camp & lodge write-ups from the live adequatesafaris.com journal
 * (/blog-3-columns/). The article bodies still live on WordPress, so the cards
 * link out to the published article; bring the text across and the hrefs can
 * become internal routes instead.
 *
 * Photography is resized client-owned artwork (max 1200px, WebP) in
 * `public/blog/`.
 */
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Display date, e.g. "28 Mar". */
  date: string;
  year: number;
  image: string;
  href: string;
}

export const articles: Article[] = [
  {
    slug: 'amani-mara-camp',
    title: 'Amani Mara Camp',
    excerpt:
      'The Swahili word “Amani” originates from Arabic meaning peace, desires, wishes, aspirations. Amani Mara is an eco-conscious luxury safari oasis nestled in Kenya’s world-renowned Maasai Mara Game Reserve.',
    date: '28 Mar',
    year: 2025,
    image: '/blog/amani-mara-camp.webp',
    href: 'https://adequatesafaris.com/amani-mara-camp/',
  },
  {
    slug: 'enchoro-tourist-camp',
    title: 'Enchoro Tourist Camp',
    excerpt:
      'Semi-luxury tented accommodation on the east side of the Masai Mara Game Reserve near Oloolaimutia Gate — 230km from Nairobi, four and a half hours by road or 45 minutes by air from Wilson.',
    date: '28 Mar',
    year: 2025,
    image: '/blog/enchoro-tourist-camp.webp',
    href: 'https://adequatesafaris.com/enchoro-tourist-camp/',
  },
  {
    slug: 'aberdare-cottages',
    title: 'Aberdare Cottages',
    excerpt:
      'In Nanyuki, a three-to-four-hour drive from Nairobi or a scheduled flight from Wilson airport. The cottages are comfortable and en suite — a good base for Mount Kenya and the northern conservancies.',
    date: '16 Apr',
    year: 2025,
    image: '/blog/aberdare-cottages.webp',
    href: 'https://adequatesafaris.com/aberdare-cottages/',
  },
  {
    slug: 'lake-naivasha-crescent-camp',
    title: 'Lake Naivasha Crescent Camp',
    excerpt:
      'On the shores of Lake Naivasha in the heart of Kenya’s Rift Valley, ninety minutes from Nairobi, or forty minutes by scheduled flight to Naivasha airstrip.',
    date: '16 Apr',
    year: 2025,
    image: '/blog/lake-naivasha-crescent-camp.webp',
    href: 'https://adequatesafaris.com/lake-naivasha-crescent-camp/',
  },
  {
    slug: 'doa-doa-safari-camp',
    title: 'Doa Doa Safari Camp',
    excerpt:
      'At Galana Ranch in Tsavo East National Park on the Galana River, where crocodiles, hippos and a wide range of wildlife gather. Five to six hours from Nairobi via the Mombasa highway.',
    date: '16 Apr',
    year: 2025,
    image: '/blog/doa-doa-safari-camp.webp',
    href: 'https://adequatesafaris.com/doa-doa-safari-camp/',
  },
  {
    slug: 'dove-nest-lodge',
    title: 'Dove Nest Lodge',
    excerpt:
      'Perched on the hill above Lake Naivasha, two to three hours from Nairobi via the Nakuru–Nairobi highway, and a short drive from the Rift Valley spur restaurants.',
    date: '16 Apr',
    year: 2025,
    image: '/blog/dove-nest-lodge.webp',
    href: 'https://adequatesafaris.com/dove-nest-lodge/',
  },
  {
    slug: 'comfort-gardens-sweetwaters',
    title: 'Comfort Gardens Sweetwaters',
    excerpt:
      'Near Nanyuki airstrip, twenty-five minutes from Nanyuki Sports Club and about three hours from Nairobi, with views across the conservancy.',
    date: '21 May',
    year: 2025,
    image: '/blog/comfort-gardens-sweetwaters.webp',
    href: 'https://adequatesafaris.com/comfort-gardens-sweetwaters/',
  },
  {
    slug: 'glee-hotel-nairobi',
    title: 'Glee Hotel Nairobi',
    excerpt:
      'A city hotel on the northern bypass in Runda, fifteen kilometres from Wilson Airport — the useful first or last night before a safari departure.',
    date: '21 May',
    year: 2025,
    image: '/blog/glee-hotel-nairobi.webp',
    href: 'https://adequatesafaris.com/glee-hotel-nairobi/',
  },
  {
    slug: 'great-rift-valley-lodge',
    title: 'Great Rift Valley Lodge',
    excerpt:
      'On the Eburu escarpment with views over Lake Naivasha and the Great Rift Valley — roughly an hour and a half from Nairobi.',
    date: '21 May',
    year: 2025,
    image: '/blog/great-rift-valley-lodge.webp',
    href: 'https://adequatesafaris.com/great-rift-valley-lodge/',
  },
  {
    slug: 'ithumba-camp-tsavo',
    title: 'Ithumba Camp Tsavo',
    excerpt:
      'On Ithumba Hill in northern Tsavo East, owned by the David Sheldrick Wildlife Trust, with spacious sleeping tents around a focal camp area.',
    date: '21 May',
    year: 2025,
    image: '/blog/ithumba-camp-tsavo.webp',
    href: 'https://adequatesafaris.com/ithumba-camp-tsavo/',
  },
];
