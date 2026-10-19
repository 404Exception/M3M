import fs from 'fs';
import path from 'path';

// All official M3M India projects mapped to categories and corridors
export function buildCompleteM3MDatabase() {
  const adminUsers = [
    {
      id: "admin-1",
      name: "M3M Executive Administrator",
      email: "admin@m3mproperties.com",
      passwordHash: "$2b$10$yDTUqFO0UZYlaGncpA5QEOw4ilNoy7mzQ64Dt/GEWRWZN8WDOM8pe",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "admin-2",
      name: "M3M Executive Administrator",
      email: "admin@m3mproperties.in",
      passwordHash: "$2b$10$yDTUqFO0UZYlaGncpA5QEOw4ilNoy7mzQ64Dt/GEWRWZN8WDOM8pe",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    }
  ];

  const locations = [
    {
      id: "loc-golf-course-ext",
      name: "Golf Course Extension Road",
      slug: "golf-course-extension-road",
      city: "Gurugram",
      state: "Haryana",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "loc-spr",
      name: "Southern Peripheral Road (SPR)",
      slug: "southern-peripheral-road",
      city: "Gurugram",
      state: "Haryana",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "loc-dwarka-exp",
      name: "Dwarka Expressway Corridor",
      slug: "dwarka-expressway-corridor",
      city: "Gurugram",
      state: "Haryana",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "loc-new-gurugram",
      name: "New Gurugram & Aravalli Foothills",
      slug: "new-gurugram-aravalli-foothills",
      city: "Gurugram",
      state: "Haryana",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "loc-mg-road",
      name: "MG Road & Central Gurugram",
      slug: "mg-road-central-gurugram",
      city: "Gurugram",
      state: "Haryana",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    },
    {
      id: "loc-noida-exp",
      name: "Noida Expressway & Sector 94",
      slug: "noida-expressway-sector-94",
      city: "Noida",
      state: "Uttar Pradesh",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z"
    }
  ];

  // High quality architectural gallery pool
  const galleryPools = {
    residential: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
    ],
    retail: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    office: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
    ],
    serviced: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    leasing: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80"
    ]
  };

  // Video embeds from M3M official corporate & project films
  const videoUrls = [
    "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
    "https://www.youtube.com/watch?v=kYJqYqf6c1w",
    "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
    "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    "https://www.youtube.com/watch?v=7b8Xy0b4j4s"
  ];

  // Raw list of all 62 official M3M projects (Prices strictly omitted/Price on Request)
  const rawProjects = [
    // --- 1. RESIDENTIAL (24 PROJECTS) ---
    {
      name: "M3M Altitude",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Ultra-luxury sky mansions in Sector 65, Gurugram with cantilevered glass sky lounges, Olympic infinity pools, and 360-degree skyline views.",
      features: "Sky Club on 40th Floor, Private Elevator Lobbies, Olympic Infinity Pool, Smart Automation, VRV Climate Control, 7-Star Concierge",
      locAdv: "Direct Golf Course Extn Rd access, 15 Mins to Cyber Hub, 20 Mins to IGI Airport, 5 Mins to Rapid Metro",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "4 BHK Sky Suite", size: "3,850 Sq.Ft." },
        { label: "5 BHK Sky Villa", size: "4,950 Sq.Ft." },
        { label: "Iconic Penthouse", size: "7,200 Sq.Ft." }
      ]
    },
    {
      name: "M3M Golfestate",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Flagship 9-hole executive golf resort living spread over 75+ acres of lush greens with iconic clubhouse and luxury concierge.",
      features: "9-Hole Golf Greens, 7-Star Resort Clubhouse, Private Elevators, Temperature Controlled Pools, Squash & Tennis Courts",
      locAdv: "Prime Sector 65, Frontage on Golf Course Extn Rd, 25 mins to IGI Airport, 10 mins to DLF Phase 5",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Golf Luxury", size: "2,850 Sq.Ft." },
        { label: "4 BHK Golf Duplex", size: "3,750 Sq.Ft." },
        { label: "5 BHK Presidential Sky Villa", size: "5,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M The Cullinan",
      locationId: "loc-noida-exp",
      siteType: "Residential",
      address: "Sector 94, Noida Expressway, Delhi NCR",
      desc: "Crown jewel mixed-use landmark in Sector 94 Noida featuring ultra-luxury residences with Yamuna river views and premier high-street retail.",
      features: "Yamuna River Views, 100,000 Sq.Ft. Clubhouse, Private Plunge Pools, Heli-pad Access, Five-Tier Security",
      locAdv: "0 km from South Delhi (Kalindi Kunj), Direct Noida-Greater Noida Expressway, 20 Mins to Connaught Place",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3.5 BHK Palace Suite", size: "3,200 Sq.Ft." },
        { label: "4.5 BHK Riverview Sky Villa", size: "4,300 Sq.Ft." },
        { label: "5.5 BHK Imperial Penthouse", size: "6,000 Sq.Ft." }
      ]
    },
    {
      name: "M3M Crown",
      locationId: "loc-dwarka-exp",
      siteType: "Residential",
      address: "Sector 111, Dwarka Expressway, Gurugram",
      desc: "Palatial 3 & 4 BHK residences on the 0-km Delhi border along Dwarka Expressway with lush central gardens and Italian marble finishes.",
      features: "Central Lake & Waterbodies, 5.5 Acre Central Greens, 75,000 Sq.Ft. Clubhouse, Shaded Walkways, Olympic Lap Pool",
      locAdv: "0 km to Delhi Border, 15 Mins to IGI Airport T3, Next to Diplomatic Enclave II, 5 Mins to Yashobhoomi",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Royal", size: "1,895 Sq.Ft." },
        { label: "3.5 BHK Supreme", size: "2,170 Sq.Ft." },
        { label: "4 BHK Imperial", size: "2,525 Sq.Ft." }
      ]
    },
    {
      name: "M3M Capital",
      locationId: "loc-dwarka-exp",
      siteType: "Residential",
      address: "Sector 113, Smart City Delhi Airport, Dwarka Expressway",
      desc: "Master-planned residential high-rises inside Smart City Delhi Airport (SCDA) township next to Yashobhoomi (IICC) and Diplomatic Enclave.",
      features: "Golf Putting Greens, 60,000 Sq.Ft. Grand Club, Multi-tier Security, Aerobic Gardens, International Fitness Center",
      locAdv: "Adjoining Delhi Border, 10 Mins to IGI Airport T3, 5 Mins to Yashobhoomi Convention Center",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2.5 BHK Luxury", size: "1,310 Sq.Ft." },
        { label: "3.5 BHK Executive", size: "1,665 Sq.Ft." },
        { label: "4.5 BHK Prime", size: "2,100 Sq.Ft." }
      ]
    },
    {
      name: "M3M Mansion",
      locationId: "loc-dwarka-exp",
      siteType: "Residential",
      address: "Sector 113, Smart City Delhi Airport, Dwarka Expressway",
      desc: "Bespoke ultra-luxury residences inside SCDA designed with global wellness architecture, aqua clubs, and central golf frontage.",
      features: "Aqua Club, Turkish Hammams, Private Zen Courtyards, 7-Star Hospitality Concierge, Sky Observation Deck",
      locAdv: "Adjacent to Delhi, 12 Mins to Terminal 3 Airport, Direct 8-Lane Expressway Link",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3.5 BHK Grand Mansion", size: "2,150 Sq.Ft." },
        { label: "4.5 BHK Royal Mansion", size: "2,850 Sq.Ft." },
        { label: "5 BHK Signature Suite", size: "3,800 Sq.Ft." }
      ]
    },
    {
      name: "M3M Golf Hills",
      locationId: "loc-spr",
      siteType: "Residential",
      address: "Sector 79, Southern Peripheral Road, Gurugram",
      desc: "Scenic golf-resort residences nestled against the Aravalli hills on SPR, featuring expansive balconies, cascading water features, and private golf greens.",
      features: "Hill View Residences, Golf Putting Green, Olympic Lap Pool, Clubhouse with Sports Arena, Private Cabanas",
      locAdv: "Fast connectivity to SPR & NH-8, 20 mins to Cyber City, Scenic Aravalli ridge views",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2.5 BHK Scenic View", size: "1,450 Sq.Ft." },
        { label: "3.5 BHK Hill Facing", size: "1,950 Sq.Ft." },
        { label: "4.5 BHK Panorama", size: "2,650 Sq.Ft." }
      ]
    },
    {
      name: "M3M Antalya Hills",
      locationId: "loc-spr",
      siteType: "Residential",
      address: "Sector 79, Southern Peripheral Road, Gurugram",
      desc: "Low-rise boutique luxury floors inspired by Mediterranean coastal elegance, featuring private terrace lounges and basement workspaces.",
      features: "Private Terrace & Basement Workspaces, Turkish Baths, Aravalli Hill View Deck, EV Charging, Gated Multi-tier Security",
      locAdv: "SPR Sector 79 corridor, minutes from NH-8 and Cloverleaf interchange",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2.5 BHK Luxury Floor", size: "1,195 Sq.Ft." },
        { label: "3.5 BHK Luxury Floor", size: "1,530 Sq.Ft." }
      ]
    },
    {
      name: "M3M OPUS",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Ultra-exclusive architectural landmark on Golf Course Extn Rd designed for the city's distinguished elite with private infinity pools.",
      features: "Private Plunge Pools, Double Height Lobbies, Curated Art Gallery, Temperature Controlled Lap Pool",
      locAdv: "Sector 67 prime junction, walking distance to M3M Urbana & IFC",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "4 BHK Ultra Opus", size: "3,650 Sq.Ft." },
        { label: "5 BHK Duplex Opus", size: "4,800 Sq.Ft." }
      ]
    },
    {
      name: "M3M Soulitude",
      locationId: "loc-new-gurugram",
      siteType: "Residential",
      address: "Sector 89, New Gurugram",
      desc: "Boutique low-rise independent luxury floors with basement offices and private terrace gazebos in New Gurugram.",
      features: "Private Rooftop Terraces, Dedicated Office Basement, Gated 5-tier Security, Designer Landscaped Parks",
      locAdv: "Sector 89 junction, direct access to Dwarka Expressway and NH-8",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2.5 BHK Independent Floor", size: "1,105 Sq.Ft." },
        { label: "3.5 BHK Independent Floor", size: "1,420 Sq.Ft." }
      ]
    },
    {
      name: "M3M Fairway West",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Exclusive golf-front residences within the M3M Golfestate ecosystem offering sweeping views of fairway greens.",
      features: "Golf Course Frontage, Private Elevator Access, Club Elevate Access, Concierge Services",
      locAdv: "Sector 65 core, direct Golf Course Extn Rd frontage",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Golf View", size: "2,900 Sq.Ft." },
        { label: "4 BHK Fairway Suite", size: "3,800 Sq.Ft." }
      ]
    },
    {
      name: "M3M Skycity",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Modern high-rise residential towers integrated above world-class high-street shopping promenades in Sector 65.",
      features: "Direct High-Street Retail Access, Rooftop Jogging Track, Sky Deck Lounge, Infinity Pool",
      locAdv: "Situated above M3M 65th Avenue, prime Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Sky Suite", size: "1,260 Sq.Ft." },
        { label: "3 BHK Sky Suite", size: "1,820 Sq.Ft." }
      ]
    },
    {
      name: "M3M Polo Suites",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Equestrian-inspired signature luxury residences curated for aristocracy and equestrian sports enthusiasts.",
      features: "Polo Lounge, Equestrian Decor & Design, Exclusive Butler Service, Helipad Access",
      locAdv: "Sector 65, Golf Course Extn Rd, 20 mins to Delhi",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Polo Suite", size: "3,980 Sq.Ft." },
        { label: "4 BHK Polo Residence", size: "4,990 Sq.Ft." }
      ]
    },
    {
      name: "M3M Merlin",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Singapore-style high-rise residences with lush tropical landscapes, sky bridges, and premium club lifestyle.",
      features: "Singapore-themed Tropical Gardens, Club Merlin, Mechanical Car Parking, Sports Arenas",
      locAdv: "Sector 67, near Golf Course Extn Rd and Sohna Road junction",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Modern", size: "1,850 Sq.Ft." },
        { label: "4 BHK Singapore Luxury", size: "2,400 Sq.Ft." }
      ]
    },
    {
      name: "M3M Latitude",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Iconic single-tower skyscraper with rooftop sky clubhouse, panoramic observation deck, and neo-futuristic design.",
      features: "Rooftop Crystal Club, Sky Observation Deck, VRV Air Conditioning, 4 High-speed Elevators",
      locAdv: "Sector 65, Golf Course Extn Rd, adjacent to M3M Golfestate",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Sky Residence", size: "2,499 Sq.Ft." },
        { label: "4 BHK Sky Villa", size: "2,980 Sq.Ft." }
      ]
    },
    {
      name: "M3M Woodshire",
      locationId: "loc-dwarka-exp",
      siteType: "Residential",
      address: "Sector 107, Dwarka Expressway, Gurugram",
      desc: "Sprawling ready-to-move-in mid-rise gated township nestled amidst 75% green open spaces on Dwarka Expressway.",
      features: "Ready to Move In, 3-Tier Security, Grand Clubhouse, Sports & Tennis Courts",
      locAdv: "Sector 107, 10 Mins to IGI Airport T3, 5 Mins to Delhi",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Ready", size: "1,366 Sq.Ft." },
        { label: "3 BHK Ready", size: "1,943 Sq.Ft." }
      ]
    },
    {
      name: "M3M Marina",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 68, Sohna Road - Golf Course Extn Link, Gurugram",
      desc: "Waterfront-themed luxury high-rise development featuring marina promenades, ripple fountains, and lush club amenities.",
      features: "Marina Waterfront Theme, 7-Acre Central Greens, 25,000 Sq.Ft. Clubhouse, Aerobics Center",
      locAdv: "Sector 68, direct access to SPR and Sohna Road corridor",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Marina", size: "1,260 Sq.Ft." },
        { label: "3 BHK Marina Grande", size: "1,650 Sq.Ft." }
      ]
    },
    {
      name: "M3M St. Andrews",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Exclusive Scottish-heritage golf residences offering palatial 4 & 5 BHK suites with private elevators and fairway views.",
      features: "Private Foyer & Elevator, Scottish Architecture, Fairway Facing Balconies, Private Spa",
      locAdv: "Sector 65 prime golf corridor, 20 mins to Delhi",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "4 BHK St. Andrews", size: "6,171 Sq.Ft." },
        { label: "5 BHK Scottish Penthouse", size: "8,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M SkySuites",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Private multi-level duplex and penthouse suites located atop M3M Golfestate with double-height living rooms.",
      features: "Double-Height Ceilings, Private Rooftop Pool, Jacuzzi on Terrace, 24x7 Valet Concierge",
      locAdv: "Golf Course Extn Rd Sector 65, Gurugram",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "4 BHK Sky Duplex", size: "5,100 Sq.Ft." },
        { label: "5 BHK Royal Duplex", size: "6,800 Sq.Ft." }
      ]
    },
    {
      name: "M3M Panorama Suites",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Limited-edition 360-degree panoramic sky suites overlooking the Aravallis and golf greens.",
      features: "Panoramic Glass Facades, Private Elevator Access, Infinity Jacuzzi, Wine Cellar",
      locAdv: "Sector 65, Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "3 BHK Panorama", size: "3,650 Sq.Ft." },
        { label: "4 BHK Panorama Suite", size: "4,400 Sq.Ft." }
      ]
    },
    {
      name: "M3M Heights",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Modern luxury high-rises connected seamlessly to M3M 65th Avenue retail boulevards.",
      features: "Connected to High-Street Mall, Sky Terrace Pool, Yoga Studios, Banquet Hall",
      locAdv: "Sector 65, Golf Course Extn Rd, 10 Mins to Cyber City",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Luxury", size: "1,260 Sq.Ft." },
        { label: "3 BHK Grand", size: "1,820 Sq.Ft." }
      ]
    },
    {
      name: "M3M Sierra68",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 68, Sohna Road - SPR, Gurugram",
      desc: "Lush residential towers with 90% open spaces, lake views, and modern club amenities.",
      features: "Lake Facing Balconies, 3-Tier Security, High-Speed Elevators, Tennis & Basketball Courts",
      locAdv: "Sector 68, near SPR & Sohna Road",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Sierra", size: "1,197 Sq.Ft." },
        { label: "3 BHK Sierra", size: "1,550 Sq.Ft." }
      ]
    },
    {
      name: "M3M Skywalk",
      locationId: "loc-spr",
      siteType: "Residential",
      address: "Sector 74, Southern Peripheral Road, Gurugram",
      desc: "Contemporary high-rises atop M3M Corner Walk featuring sky bridges, wellness gyms, and panoramic SPR views.",
      features: "Skywalk Balconies, Connected to High-Street Retail, Swimming Pool, High-Speed Elevators",
      locAdv: "Sector 74, SPR main boulevard, 2 Mins to NH-8",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "2 BHK Skywalk", size: "1,400 Sq.Ft." },
        { label: "3 BHK Skywalk", size: "1,980 Sq.Ft." }
      ]
    },
    {
      name: "M3M Jacob & Co Residences",
      locationId: "loc-golf-course-ext",
      siteType: "Residential",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "World's most coveted branded residences crafted in partnership with global haute horlogerie master Jacob & Co.",
      features: "Bespoke Haute Horlogerie Design, Private Helipad Access, Diamond Club Lounge, Private Butler",
      locAdv: "Ultra-luxury Sector 65 Golf Course Extn Rd corridor",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "4 BHK Haute Living", size: "4,500 Sq.Ft." },
        { label: "5 BHK Billionaire Sky Palace", size: "7,000 Sq.Ft." }
      ]
    },

    // --- 2. RETAIL (16 PROJECTS) ---
    {
      name: "M3M Jewel",
      locationId: "loc-mg-road",
      siteType: "Retail",
      address: "Sector 25, MG Road, Gurugram",
      desc: "Gurugram's ultimate luxury retail destination on MG Road, featuring iconic double-height luxury flagship stores and international fine dining.",
      features: "Double-Height Retail Flagships, 5-Screen PVR Luxe Multiplex, Open Air European Boulevard, Valet Concierge",
      locAdv: "Main MG Road Sector 25, 2 Mins to MG Road Metro, 15 Mins to IGI Airport T3",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Ground Floor Flagship Retail", size: "550 Sq.Ft." },
        { label: "First Floor Boulevard Store", size: "850 Sq.Ft." },
        { label: "Terrace F&B Dining Suite", size: "1,450 Sq.Ft." }
      ]
    },
    {
      name: "M3M 65th Avenue",
      locationId: "loc-golf-course-ext",
      siteType: "Retail",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "One of Delhi NCR's largest open-air high-street retail developments spread across 14 acres with water features, escalators, and 8-screen cinema.",
      features: "14-Acre High-Street Promenade, 8-Screen Multiplex, Open-to-Sky Boulevards, 100% Power Backup",
      locAdv: "Sector 65 Golf Course Extn Rd, next to M3M Golfestate",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "High-Street Retail Shop", size: "450 Sq.Ft." },
        { label: "Gourmet Dining Lounge", size: "1,200 Sq.Ft." }
      ]
    },
    {
      name: "M3M Route65",
      locationId: "loc-golf-course-ext",
      siteType: "Retail",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Ultra-modern retail boulevard with futuristic glass facades, world-class entertainment zones, and open plazas.",
      features: "Futuristic Glass Facade, Food Court & Anchor Stores, Dedicated Pedestrian Plazas",
      locAdv: "Golf Course Extn Rd, Sector 65, surrounded by 50,000+ luxury residences",
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Anchor Retail Store", size: "1,100 Sq.Ft." },
        { label: "Boutique Retail Unit", size: "380 Sq.Ft." }
      ]
    },
    {
      name: "M3M Urbana",
      locationId: "loc-golf-course-ext",
      siteType: "Retail",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Established California-style commercial high-street retail boulevard featuring top fashion labels, cafes, and rooftop lounges.",
      features: "California Architecture, Operational Food Street, Grade-A Corporate Offices Connected",
      locAdv: "Sector 67, Golf Course Extn Rd, 15 Mins to DLF Cyber City",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Operational Retail Shop", size: "650 Sq.Ft." },
        { label: "Premium Restaurant Space", size: "1,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M Broadway",
      locationId: "loc-spr",
      siteType: "Retail",
      address: "Sector 71, Southern Peripheral Road, Gurugram",
      desc: "Iconic mixed-use commercial development on SPR with 150-meter-wide road frontage, 10-screen multiplex, and double-height shops.",
      features: "150m Wide Frontage, 10-Screen Multiplex, 22-Storey Office Tower, Double-Height Retail",
      locAdv: "Sector 71, direct on Southern Peripheral Road, 5 Mins to Sohna Elevated Road",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Double-Height Retail Shop", size: "520 Sq.Ft." },
        { label: "Food Court Multi-Cuisine Unit", size: "400 Sq.Ft." }
      ]
    },
    {
      name: "M3M Prive73",
      locationId: "loc-spr",
      siteType: "Retail",
      address: "Sector 73, Southern Peripheral Road, Gurugram",
      desc: "Boutique high-street retail destination offering curated pedestrian streets, glass showrooms, and landscaped open courtyards.",
      features: "Pedestrianized Open Streets, Cascading Fountains, Underground 3-Level Parking",
      locAdv: "Sector 73, SPR corridor, direct connection to NH-8",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "High-Street Retail Shop", size: "480 Sq.Ft." },
        { label: "Boutique Cafe Space", size: "900 Sq.Ft." }
      ]
    },
    {
      name: "M3M Paragon57",
      locationId: "loc-mg-road",
      siteType: "Retail",
      address: "Sector 57, Sushant Lok III, Gurugram",
      desc: "Prime 3-side open retail plaza in central Gurugram featuring hypermarket anchors, entertainment zones, and alfresco dining.",
      features: "3-Side Open Boulevard, Hypermarket Anchor, Open Rooftop Dining, Central Atrium",
      locAdv: "Sector 57, Sushant Lok III, 5 Mins to Golf Course Road & Metro",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Ground Floor Retail Shop", size: "410 Sq.Ft." },
        { label: "First Floor Fashion Outlet", size: "750 Sq.Ft." }
      ]
    },
    {
      name: "M3M Atrium57",
      locationId: "loc-mg-road",
      siteType: "Retail",
      address: "Sector 57, Sushant Lok III, Gurugram",
      desc: "Modern open-concept commercial gallery with 30-foot glass frontage, grand atrium, and pedestrian plazas in Sector 57.",
      features: "30-Ft Glass Frontage, Triple-Height Grand Atrium, Dedicated Food Court Zone",
      locAdv: "Sector 57 central junction, surrounded by 100,000+ residents",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "High-Visibility Retail Shop", size: "380 Sq.Ft." },
        { label: "Anchor Commercial Space", size: "1,150 Sq.Ft." }
      ]
    },
    {
      name: "M3M Corner Walk",
      locationId: "loc-spr",
      siteType: "Retail",
      address: "Sector 74, Southern Peripheral Road, Gurugram",
      desc: "Corner commercial development offering 2-side arterial road frontage, retail shops, gourmet dining, and office suites.",
      features: "Corner Plot 2-Side Frontage, 3-Tier Security, Escalator Connectivity, Underground Parking",
      locAdv: "Sector 74, intersection of SPR & Golf Course Extn Road link",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Corner Retail Unit", size: "490 Sq.Ft." },
        { label: "Upper Floor Retail Outlet", size: "720 Sq.Ft." }
      ]
    },
    {
      name: "M3M Cosmopolitan",
      locationId: "loc-golf-course-ext",
      siteType: "Retail",
      address: "Sector 66, Golf Course Extension Road, Gurugram",
      desc: "Operational international retail & dining promenade featuring acclaimed restaurants, salons, and specialty shops on Golf Course Extn Rd.",
      features: "Operational International High-Street, Renowned Dining Brands, 24x7 Security",
      locAdv: "Sector 66, Golf Course Extn Rd, 10 Mins to DLF 5",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Operational Retail Shop", size: "580 Sq.Ft." },
        { label: "F&B Terrace Restaurant", size: "1,600 Sq.Ft." }
      ]
    },
    {
      name: "M3M Tee Point",
      locationId: "loc-golf-course-ext",
      siteType: "Retail",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Boutique retail & corporate hub at the key junction connecting Golf Course Extn Rd and Sector 65 residential belt.",
      features: "T-Junction High Visibility, Multi-level Commercial Spaces, Dedicated Car Drop-off",
      locAdv: "Sector 65 prime corner, direct link to Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "High-Visibility Shop", size: "420 Sq.Ft." },
        { label: "Retail Showroom", size: "850 Sq.Ft." }
      ]
    },
    {
      name: "M3M 84Market",
      locationId: "loc-new-gurugram",
      siteType: "Retail",
      address: "Sector 84, New Gurugram",
      desc: "Commercial retail promenade catering to the high-density residential developments in New Gurugram.",
      features: "Pedestrian Friendly Plazas, Wide Corridor Corridors, Food Court & Retail Mix",
      locAdv: "Sector 84, adjacent to Dwarka Expressway and CPR link",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Convenience Retail Shop", size: "360 Sq.Ft." },
        { label: "Anchor Departmental Store", size: "1,200 Sq.Ft." }
      ]
    },
    {
      name: "M3M 114 Market",
      locationId: "loc-dwarka-exp",
      siteType: "Retail",
      address: "Sector 114, Dwarka Expressway, Gurugram",
      desc: "Shop-Cum-Office (SCO) commercial development on 0 km Delhi border along 150-meter Dwarka Expressway.",
      features: "SCO Commercial Plots, 100% Ground Coverage, Basement + 4 Floor Permissions, Surface Parking",
      locAdv: "Sector 114, 0 km Delhi Border, 10 Mins to IGI Airport T3",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "SCO Commercial Plot (84 Sq.Yd)", size: "756 Sq.Ft." },
        { label: "SCO Commercial Plot (120 Sq.Yd)", size: "1,080 Sq.Ft." }
      ]
    },
    {
      name: "M3M Innovation Park",
      locationId: "loc-new-gurugram",
      siteType: "Retail",
      address: "Sector 84, New Gurugram",
      desc: "Next-generation mixed retail and lifestyle destination serving upcoming residential communities of New Gurugram.",
      features: "Open Plazas, Green Landscaped Patios, Multi-cuisine Dining, Multi-tier Parking",
      locAdv: "Sector 84, Dwarka Expressway & NH-8 link",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Retail Shop", size: "400 Sq.Ft." },
        { label: "Lifestyle Showroom", size: "950 Sq.Ft." }
      ]
    },
    {
      name: "M3M Capital Walk",
      locationId: "loc-dwarka-exp",
      siteType: "Retail",
      address: "Sector 113, Smart City Delhi Airport, Dwarka Expressway",
      desc: "A 1-kilometer long international high-street retail boulevard located next to Delhi border inside SCDA township.",
      features: "1-Km Long Retail Boulevard, 4-Storey High-Street Shopping, 0 Km Delhi Border",
      locAdv: "Sector 113, Dwarka Expressway, next to Yashobhoomi & IGI Airport",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Boulevard Retail Shop", size: "520 Sq.Ft." },
        { label: "Luxury Brand Flagship", size: "1,350 Sq.Ft." }
      ]
    },
    {
      name: "M3M The Cullinan Avenue",
      locationId: "loc-noida-exp",
      siteType: "Retail",
      address: "Sector 94, Noida Expressway, Delhi NCR",
      desc: "Ultra-luxury retail promenade situated at the gateway of Noida featuring world-class luxury brands and fine dining.",
      features: "World Luxury Brand Showrooms, Riverfront Promenade, Grand Central Piazza, Valet Drop-off",
      locAdv: "Sector 94 Noida, 0 km Kalindi Kunj South Delhi, 20 Mins to CP",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Luxury High-Street Shop", size: "650 Sq.Ft." },
        { label: "Gourmet Promenade Restaurant", size: "1,800 Sq.Ft." }
      ]
    },

    // --- 3. OFFICES (9 PROJECTS) ---
    {
      name: "M3M International Financial Center (IFC)",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 66, Golf Course Extension Road, Gurugram",
      desc: "Northern India's benchmark Grade-A corporate tower, hosting Fortune 500 multinationals and global financial headquarters.",
      features: "LEED Gold Certified, High-Speed Mitsubishi Elevators, Double-Height Grand Atrium, Triple-Basement Parking",
      locAdv: "Sector 66, direct on Golf Course Extn Rd, 10 Mins to Cyber City, 25 Mins to Airport",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Grade-A Corporate Suite", size: "1,850 Sq.Ft." },
        { label: "Full Floor Executive Office", size: "12,000 Sq.Ft." },
        { label: "Multi-Floor Global HQ", size: "35,000 Sq.Ft." }
      ]
    },
    {
      name: "M3M Urbana Business Park",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "State-of-the-art corporate IT/ITeS business park featuring campus-style office plates, lush green atriums, and dining avenues.",
      features: "Large Floor Plates, 100% Power Backup, High-Speed Optical Fiber, 24x7 Security",
      locAdv: "Sector 67, Golf Course Extn Rd, 15 Mins to DLF Cyber City",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "IT/ITeS Office Suite", size: "1,250 Sq.Ft." },
        { label: "Corporate Office Plate", size: "8,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M Urbana Premium",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Bespoke corporate commercial suites integrated with luxury dining and boutique high-street promenades.",
      features: "Boutique Office Suites, Executive Boardrooms, Central Air Conditioning, Dedicated Concierge",
      locAdv: "Sector 67, Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Executive Office Suite", size: "980 Sq.Ft." },
        { label: "Corporate Wing", size: "4,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M Jewel Corporate Suites",
      locationId: "loc-mg-road",
      siteType: "Office",
      address: "Sector 25, MG Road, Gurugram",
      desc: "Ultra-luxury corporate suites situated in Gurugram's prime CBD on MG Road with immediate metro access.",
      features: "CBD Gurugram Location, High-Speed Elevators, 24x7 Access, Luxury Drop-off Porch",
      locAdv: "Main MG Road Sector 25, 2 Mins to MG Road Metro, 15 Mins to IGI Airport",
      videoUrl: "https://www.youtube.com/watch?v=kYJqYqf6c1w",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "CBD Executive Suite", size: "1,150 Sq.Ft." },
        { label: "Corporate Penthouse Office", size: "3,200 Sq.Ft." }
      ]
    },
    {
      name: "M3M CFC (Corporate Financial Center)",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 66, Golf Course Extension Road, Gurugram",
      desc: "Dedicated financial services hub engineered for banking institutions, private equity firms, and corporate headquarters.",
      features: "Banking Grade Security, High Floor-to-Ceiling Height, Double-Glazed Glass Facade",
      locAdv: "Sector 66, Golf Course Extn Rd, 10 Mins to Cyber City",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Financial Suite", size: "2,200 Sq.Ft." },
        { label: "Full Floor Headquarters", size: "14,000 Sq.Ft." }
      ]
    },
    {
      name: "M3M Tee Point Offices",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 65, Golf Course Extension Road, Gurugram",
      desc: "Modern boutique corporate offices with expansive windows and central location in Sector 65.",
      features: "Efficient Floor Layouts, Multi-Tier Security, 100% Power Backup, High-Speed Lifts",
      locAdv: "Sector 65, Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Boutique Office", size: "750 Sq.Ft." },
        { label: "Executive Suite", size: "1,800 Sq.Ft." }
      ]
    },
    {
      name: "M3M Broadway Offices",
      locationId: "loc-spr",
      siteType: "Office",
      address: "Sector 71, Southern Peripheral Road, Gurugram",
      desc: "22-storey iconic corporate glass tower commanding uninterrupted views of Southern Peripheral Road and Aravallis.",
      features: "22-Storey Iconic Tower, Double Height Entrance Lobby, High-Speed Elevators, 3-Level Parking",
      locAdv: "Sector 71, direct on Southern Peripheral Road, 5 Mins to NH-8",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Grade-A Office Suite", size: "1,100 Sq.Ft." },
        { label: "Full Corporate Floor", size: "9,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M Corner Walk Offices",
      locationId: "loc-spr",
      siteType: "Office",
      address: "Sector 74, Southern Peripheral Road, Gurugram",
      desc: "Contemporary office suites designed for startups, legal firms, and consulting companies with integrated retail avenues.",
      features: "Integrated Retail & Food Court, 24x7 Power Backup, Professional Facility Management",
      locAdv: "Sector 74, SPR corridor, 2 Mins to NH-8",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Commercial Office Suite", size: "890 Sq.Ft." },
        { label: "Corporate Office", size: "2,400 Sq.Ft." }
      ]
    },
    {
      name: "M3M Cosmopolitan Offices",
      locationId: "loc-golf-course-ext",
      siteType: "Office",
      address: "Sector 66, Golf Course Extension Road, Gurugram",
      desc: "Operational corporate suites above Cosmopolitan high-street with vibrant dining and networking avenues.",
      features: "Operational Office Hub, Double Height Lobbies, Ample Multi-level Parking",
      locAdv: "Sector 66, Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Commercial Suite", size: "950 Sq.Ft." },
        { label: "Executive Office Floor", size: "5,200 Sq.Ft." }
      ]
    },

    // --- 4. SERVICED APARTMENTS (6 PROJECTS) ---
    {
      name: "M3M 57Suites",
      locationId: "loc-mg-road",
      siteType: "Serviced Apartments",
      address: "Sector 57, Sushant Lok III, Gurugram",
      desc: "Fully-furnished ultra-luxury managed serviced suites curated for corporate expatriates, business travelers, and discerning investors.",
      features: "Fully Furnished Luxury Suites, Housekeeping & Concierge, Rooftop Swimming Pool, Business Lounge",
      locAdv: "Sector 57, Sushant Lok III, 5 Mins to Golf Course Road & Huda City Metro",
      videoUrl: "https://www.youtube.com/watch?v=U9v7h3bFw1Y",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "1 BHK Studio Suite", size: "650 Sq.Ft." },
        { label: "2 BHK Luxury Serviced Suite", size: "1,150 Sq.Ft." }
      ]
    },
    {
      name: "M3M Sky Lofts",
      locationId: "loc-spr",
      siteType: "Serviced Apartments",
      address: "Sector 71, Southern Peripheral Road, Gurugram",
      desc: "Double-height 19-foot loft apartments managed by international hospitality operators atop M3M Broadway on SPR.",
      features: "19-Ft Double Height Ceilings, Managed Hospitality Operator, Club House Access, Infinity Pool",
      locAdv: "Sector 71, SPR boulevard, 5 Mins to Sohna Elevated Road",
      videoUrl: "https://www.youtube.com/watch?v=w7wK7QhJ7a4",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Double-Height Loft (1 BHK)", size: "750 Sq.Ft." },
        { label: "Double-Height Loft (2 BHK)", size: "1,250 Sq.Ft." }
      ]
    },
    {
      name: "M3M My Den",
      locationId: "loc-golf-course-ext",
      siteType: "Serviced Apartments",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Premium serviced residences integrated inside M3M Urbana, managed with 5-star hotel amenities and corporate rental pool.",
      features: "Integrated Hotel Services, All-Day Dining Restaurant, Swimming Pool & Spa, 24x7 Concierge",
      locAdv: "Sector 67, Golf Course Extn Rd, 10 Mins to Cyber City",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Studio Suite", size: "580 Sq.Ft." },
        { label: "1 BHK Executive Suite", size: "875 Sq.Ft." }
      ]
    },
    {
      name: "M3M One Key Resiments",
      locationId: "loc-golf-course-ext",
      siteType: "Serviced Apartments",
      address: "Sector 67, Golf Course Extension Road, Gurugram",
      desc: "Smart studio and 1 BHK suites equipped with cutting-edge home automation and hotel concierge on Golf Course Extn Rd.",
      features: "Fully Automated Smart Suites, Keyless Digital Entry, Rooftop Pool, High Rental Yield Pool",
      locAdv: "Sector 67, Golf Course Extn Rd",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Smart Studio", size: "540 Sq.Ft." },
        { label: "1 BHK Smart Suite", size: "820 Sq.Ft." }
      ]
    },
    {
      name: "M3M Lofts 74",
      locationId: "loc-spr",
      siteType: "Serviced Apartments",
      address: "Sector 74, Southern Peripheral Road, Gurugram",
      desc: "Urban loft residences with private club, fitness center, and direct access to high-street retail promenades on SPR.",
      features: "Modern Loft Design, Sky Gym, Heated Swimming Pool, 24x7 Valet",
      locAdv: "Sector 74, SPR main artery, 2 Mins to NH-8",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Urban Loft", size: "690 Sq.Ft." },
        { label: "Executive Loft Suite", size: "1,120 Sq.Ft." }
      ]
    },
    {
      name: "M3M The Cullinan Suites",
      locationId: "loc-noida-exp",
      siteType: "Serviced Apartments",
      address: "Sector 94, Noida Expressway, Delhi NCR",
      desc: "Ultra-luxury riverfront serviced residences in Sector 94 Noida, managed with 7-star global hospitality standards.",
      features: "Riverfront Views, 7-Star Hospitality Management, Private Plunge Pool, Helipad Access",
      locAdv: "Sector 94 Noida, 0 km to South Delhi, 20 Mins to CP",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "1 BHK Palace Suite", size: "850 Sq.Ft." },
        { label: "2 BHK Imperial Suite", size: "1,450 Sq.Ft." }
      ]
    },

    // --- 5. LEASING (5 PROGRAMS) ---
    {
      name: "M3M High-Street Retail Leasing",
      locationId: "loc-golf-course-ext",
      siteType: "Leasing",
      address: "Sector 65, 25, 71 & Dwarka Expressway, Gurugram",
      desc: "Direct developer retail leasing solutions for international luxury brands, fashion anchors, cafes, and entertainment multiplexes across Delhi NCR's top footfall corridors.",
      features: "Double-Height Showroom Frontage, Grade-A Facility Management, High Affluent Catchment Footfalls, Dedicated Anchor Zoning",
      locAdv: "Prime high-density retail corridors of Gurugram & Noida",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Fashion & Lifestyle Anchor Lease", size: "3,000 - 15,000 Sq.Ft." },
        { label: "Boutique Retail & Kiosk Lease", size: "350 - 1,200 Sq.Ft." }
      ]
    },
    {
      name: "M3M Grade-A Corporate Office Leasing",
      locationId: "loc-golf-course-ext",
      siteType: "Leasing",
      address: "Sector 66 & 67, Golf Course Extension Road, Gurugram",
      desc: "Institutional Grade-A corporate office leasing in LEED Gold certified towers (M3M IFC, Urbana Business Park) for Fortune 500 multinationals.",
      features: "LEED Gold Certified Buildings, High-Speed Fiber Backbone, Campus Style Amenities, 24x7 Turnstile Security",
      locAdv: "Golf Course Extension Road & Cyber City Corridor",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Warm Shell Corporate Office Floor", size: "10,000 - 45,000 Sq.Ft." },
        { label: "Fully Fitted Managed Office Suite", size: "2,500 - 8,000 Sq.Ft." }
      ]
    },
    {
      name: "M3M Food Court & Gourmet Dining Leasing",
      locationId: "loc-mg-road",
      siteType: "Leasing",
      address: "Sector 25 (Jewel), Sector 57 (Paragon) & Sector 71 (Broadway)",
      desc: "Turnkey restaurant and food court leasing spaces with complete kitchen MEP, gas pipelines, exhaust systems, and dedicated seating areas.",
      features: "Ready Kitchen Exhaust & MEP, High Footfall Common Seating, Alfresco Terrace Seating, Valet Parking",
      locAdv: "MG Road, SPR, and Golf Course Extn Rd retail hubs",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Food Court Multi-Cuisine Counter", size: "400 - 800 Sq.Ft." },
        { label: "Fine Dining Terrace Restaurant", size: "2,000 - 6,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M Pre-Leased Institutional Assets",
      locationId: "loc-golf-course-ext",
      siteType: "Leasing",
      address: "Sector 66, Sector 65 & Sector 25, Gurugram",
      desc: "Pre-leased high-yield commercial assets with AAA-rated multinational corporate and retail tenants with long-term lock-in agreements.",
      features: "AAA Rated MNC Tenants, 9-Year Lock-in Agreements, Institutional Asset Class, Bank Lease Guarantee",
      locAdv: "Gurugram's highest yielding corporate and retail hubs",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Pre-Leased Retail Asset", size: "850 Sq.Ft." },
        { label: "Pre-Leased Corporate Office", size: "2,500 Sq.Ft." }
      ]
    },
    {
      name: "M3M SCO Commercial Plots Leasing",
      locationId: "loc-dwarka-exp",
      siteType: "Leasing",
      address: "Sector 114 & 84, Dwarka Expressway, Gurugram",
      desc: "Shop-Cum-Office (SCO) commercial multi-level plots available for complete building leases or multi-tenant commercial leasing on Dwarka Expressway.",
      features: "Basement + Ground + 4 Storey Customization, 100% Ground Coverage, Ample Surface Parking",
      locAdv: "0 km from Delhi Border, 150m wide Dwarka Expressway corridor",
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80",
      configs: [
        { label: "Entire SCO Building Lease", size: "5,500 Sq.Ft. Built-up" }
      ]
    }
  ];

  // Helper to generate slugs
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const sites = rawProjects.map((p, idx) => {
    const slug = slugify(p.name);

    // Pick a curated gallery array based on category
    const cat = p.siteType.toLowerCase();
    let pool = galleryPools.residential;
    if (cat.includes('retail')) pool = galleryPools.retail;
    else if (cat.includes('office')) pool = galleryPools.office;
    else if (cat.includes('serviced')) pool = galleryPools.serviced;
    else if (cat.includes('leasing')) pool = galleryPools.leasing;

    // Pick video from corporate video list if not explicitly provided
    const videoUrl = p.videoUrl || videoUrls[idx % videoUrls.length];

    // Build 4 curated images per site
    const images = [
      {
        id: `img-${idx + 1}-1`,
        siteId: `m3m-site-${idx + 1}`,
        imageUrl: p.image || pool[0],
        caption: `${p.name} Architectural Exterior View`,
        isCover: true,
        displayOrder: 0,
        createdAt: "2026-09-18T19:43:00.828Z"
      },
      {
        id: `img-${idx + 1}-2`,
        siteId: `m3m-site-${idx + 1}`,
        imageUrl: pool[1 % pool.length],
        caption: `${p.name} Grand Entrance & Double-Height Lobby`,
        isCover: false,
        displayOrder: 1,
        createdAt: "2026-09-18T19:43:00.828Z"
      },
      {
        id: `img-${idx + 1}-3`,
        siteId: `m3m-site-${idx + 1}`,
        imageUrl: pool[2 % pool.length],
        caption: `${p.name} Signature Luxury Club & Amenities`,
        isCover: false,
        displayOrder: 2,
        createdAt: "2026-09-18T19:43:00.828Z"
      },
      {
        id: `img-${idx + 1}-4`,
        siteId: `m3m-site-${idx + 1}`,
        imageUrl: pool[3 % pool.length],
        caption: `${p.name} Designer Penthouse / Office Suite Interiors`,
        isCover: false,
        displayOrder: 3,
        createdAt: "2026-09-18T19:43:00.828Z"
      }
    ];

    return {
      id: `m3m-site-${idx + 1}`,
      locationId: p.locationId,
      name: p.name,
      slug,
      address: p.address,
      description: p.desc,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.name + ', ' + p.address)}`,
      latitude: 28.4116 + (idx * 0.002),
      longitude: 77.0655 + (idx * 0.002),
      siteType: p.siteType,
      startingPrice: "", // Strictly confidential / on request
      features: p.features,
      locationAdvantages: p.locAdv,
      videoUrl: videoUrl,
      status: "Available",
      isPublished: true,
      createdAt: "2026-09-18T19:43:00.828Z",
      updatedAt: "2026-09-18T19:43:00.828Z",
      images,
      plotSizes: p.configs.map((c, cIdx) => ({
        id: `plot-${idx + 1}-${cIdx + 1}`,
        siteId: `m3m-site-${idx + 1}`,
        plotSize: c.label,
        area: c.size,
        price: "Price on Request",
        status: "Available",
        createdAt: "2026-09-18T19:43:00.828Z"
      }))
    };
  });

  const blogs = [
    {
      id: "blog-1",
      title: "Why Golf Course Extension Road is Gurugram's Billionaires' Row in 2026",
      slug: "golf-course-extension-road-investment-guide",
      excerpt: "An authoritative analysis on infrastructure expansion, Grade-A corporate relocations, and ultra-luxury residential appreciation along Golf Course Extension Road.",
      content: "## The Evolution of Golf Course Extension Road\n\nOver the past decade, Golf Course Extension Road has transformed from an upcoming expressway into Northern India's most coveted luxury residential and commercial corridor. Anchored by world-class developments by M3M, such as M3M Altitude and M3M IFC, the belt commands unrivaled capital appreciation and rental yields.\n\n### Key Growth Drivers\n\n1. **Arterial Infrastructure**: Seamless multi-lane connectivity to Cyber City, DLF Phase 5, and IGI Airport.\n2. **Grade-A Commercial Hubs**: M3M IFC and Urbana Business Park host global MNC headquarters.\n3. **Ultra-Luxury Living**: Golf-facing sky mansions with global standard amenities.",
      category: "Market Insights",
      authorName: "M3M Strategic Research Desk",
      readTime: "5 min read",
      coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      isPublished: true,
      publishedAt: "2026-09-20T10:00:00.000Z",
      createdAt: "2026-09-20T10:00:00.000Z",
      updatedAt: "2026-09-20T10:00:00.000Z"
    },
    {
      id: "blog-2",
      title: "High-Street Retail vs Traditional Malls: The High Rental Yield Advantage",
      slug: "high-street-retail-rental-yield-advantage",
      excerpt: "Discover why institutional investors and retail brands are shifting from enclosed malls to open-air experiential high-street boulevards like M3M Jewel and 65th Avenue.",
      content: "## The High-Street Commercial Revolution\n\nHigh-street retail assets have consistently outperformed traditional enclosed malls in Gurugram, commanding superior footfalls, lower CAM charges, and sustainable rental yields.\n\n### Why Investors Choose High-Street Retail\n\n- **Double-Height Showroom Frontage**: Maximum brand visibility and consumer engagement.\n- **Open-to-Sky Promenades**: European boulevard ambiance attracting affluent catchments.\n- **Low Common Area Maintenance (CAM)**: Highly sustainable operational model for retail tenants.",
      category: "Commercial Real Estate",
      authorName: "M3M Commercial Advisory",
      readTime: "4 min read",
      coverImage: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
      isPublished: true,
      publishedAt: "2026-09-22T10:00:00.000Z",
      createdAt: "2026-09-22T10:00:00.000Z",
      updatedAt: "2026-09-22T10:00:00.000Z"
    },
    {
      id: "blog-3",
      title: "Dwarka Expressway & Smart City Delhi Airport: The Next Decade of NCR Real Estate",
      slug: "dwarka-expressway-smart-city-delhi-airport-future",
      excerpt: "How the 8-lane grade-separated Dwarka Expressway and SCDA township are creating a new global gateway between Delhi and Gurugram.",
      content: "## The Global Gateway of Delhi NCR\n\nWith direct connectivity to IGI Airport Terminal 3, Yashobhoomi Convention Center, and Diplomatic Enclave II, the Dwarka Expressway corridor is NCR's most strategic growth node.\n\n### M3M's SCDA Master Development\n\nM3M Capital, M3M Crown, and M3M Capital Walk are anchored inside this master-planned destination, offering seamless live-work-play luxury ecosystems.",
      category: "Infrastructure & Growth",
      authorName: "M3M Infrastructure Research",
      readTime: "6 min read",
      coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      isPublished: true,
      publishedAt: "2026-09-25T10:00:00.000Z",
      createdAt: "2026-09-25T10:00:00.000Z",
      updatedAt: "2026-09-25T10:00:00.000Z"
    }
  ];

  const settings: Record<string, string> = {
    company_name: "M3M Properties",
    logo_url: "/logo/m3m-logo.png",
    hero_headline: "Redefining Luxury Living & Iconic Commercial Hubs",
    hero_subheadline: "Discover iconic luxury residences, high-street retail promenades, Grade-A corporate towers, ultra-luxury serviced suites & institutional leasing across Gurugram & NCR by M3M.",
    phone_number: "+91 98765 43210",
    whatsapp_number: "919876543210",
    company_address: "M3M Experion Center, Golf Course Extension Road, Sector 65, Gurugram, Haryana 122018",
    email: "concierge@m3mproperties.in",
    business_hours: "Mon - Sun: 9:00 AM - 8:00 PM",
    hero_stats: JSON.stringify([
      { label: "Sq.Ft Delivered", value: "30M+" },
      { label: "Master Developments", value: "60+" },
      { label: "Prime Corridors", value: "6" },
      { label: "RERA Compliance", value: "100%" }
    ]),
    about_title: "Magnificence in Men, Materials & Money",
    about_description: "M3M India stands for 'Magnificence in the Trinity of Men, Materials & Money'. Over the past two decades, M3M has emerged as one of India's fastest growing luxury real estate developers, transforming Gurugram into a world-class global metropolis.",
    about_mission: "Our vision is to craft architectural masterworks that merge cutting-edge global design, sustainable construction, unmatched lifestyle amenities, and exceptional investment value for discerning homeowners and corporate enterprises."
  };

  const dbData = {
    adminUsers,
    locations,
    sites,
    blogs,
    settings
  };

  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log(`✅ Generated db.json with ${sites.length} projects across ${locations.length} locations!`);
}

buildCompleteM3MDatabase();
