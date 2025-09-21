import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaYoutube, FaTiktok, FaInstagram, FaSnapchatGhost, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import crashIcon from '../public/favicon.png';


// =====================
// Dashboard Shell
// =====================
function DashboardShell({ children }) {
  return (
    <div className="min-h-screen    ">
      <main className="bg-gray-50/60">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Crash Adams – Media Kit</div>
            <div className="text-xs text-gray-500">Editable React dashboard</div>
          </div>
        </header>
        <div className=" mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}

// =====================
// Tiny UI primitives
// =====================
const Card = ({ className = "", style, children }) => (
  <div className={`rounded-2xl border ${className}`} style={style}>{children}</div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// =====================
// Utils
// =====================
const fmtShort = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toLocaleString();
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const safeNum = (v, fallback = 0) => {
  const n = typeof v === "string" && v.trim() === "" ? NaN : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const makeBg = (solid, grad) => (grad && grad.enabled && grad.from && grad.to)
  ? `linear-gradient(${grad.angle || 0}deg, ${grad.from}, ${grad.to})`
  : solid;

// =====================
// Theme / Constants
// =====================
const PLATFORM_ORDER = ["youtube", "tiktok", "tik_tok_backup", "facebook", "instagram", "snapchat"];

const PLATFORM_LABEL = {
  youtube: "YouTube",
  tiktok: "TikTok",
  tik_tok_backup: "Tik Tok Backup Page",
  facebook: "Facebook",
  instagram: "Instagram",
  snapchat: "Snapchat"
};

const PLATFORM_ICON = {
  youtube: <FaYoutube className="text-red-600 text-[24px]" />,
  tiktok: <FaTiktok className="text-black text-[24px]" />,
  tik_tok_backup: <img src={crashIcon} alt="Tik Tok Backup Page " className="w-8 h-8" />,
  facebook: <FaFacebook className="text-blue-600 text-[24px]" />,
  instagram: <FaInstagram className="text-pink-500 text-[24px]" />,
  snapchat: <FaSnapchatGhost className="text-yellow-400 text-[24px]" />,
};

const PLATFORM_LINKS = {
  youtube: "https://www.youtube.com/channel/UCAxCk_CU0lnz6vJyslY9-Tw",
  tiktok: "https://www.tiktok.com/@crashadams?lang=en",
  tik_tok_backup: "https://www.tiktok.com/@crashadams?lang=en", // backup URL (if you have one)
  instagram: "https://www.instagram.com/crashadams/",
  facebook: "https://www.facebook.com/crashadamsmusic/",
  snapchat: "https://www.snapchat.com/@crashadamsmusic?locale=en-US",
};

const STORAGE_KEY = "creator_analytics_v1";

// =====================
// Default Config
// =====================
const DEFAULT_CONFIG = {
  customColors: {
    primary: "",
    secondary: "",
    pageBg: "#ffffff",
    pageBgGradient: { enabled: false, from: "#ffffff", to: "#f9fafb", angle: 0 },
    cardBg: "#f9fafb",
    cardBgGradient: { enabled: false, from: "#f9fafb", to: "#f3f4f6", angle: 0 },
    border: "#e5e7eb",
    text: "#0b0b0b",
    muted: "#6b7280",
    highlightIconBg: "#f0fdf4",
  },
  profile: { displayName: "CRASH ADAMS", photo: "./ProfilePicture.jpeg" },
  avatarSize: 112,
  platform: "youtube",
  labels: {
    heading: "Analytics Overview (Last 60 Days)",
    followers: "Followers",
    engagement: "Engagement",
    totalImpressions: "Total Impressions",
    shares: "Shares",
    views: "Views",
    likes: "Likes",
    comments: "Comments",
    gender: "Gender",
    ageGender: "Age and Gender",
    topCountries: "Top Countries",
  },
  tagVideos: {
    // FEATURED grid (replaced per user's latest list)
    featured: [
      { title: "Lays", url: "https://www.instagram.com/reel/Cu2gKKProiB/?igsh=NTc4MTIwNjQ2YQ==", description: "", thumbnail: "./thumbnails/lays.webp" },
      { title: "Old Spice", url: "https://www.youtube.com/shorts/VdLA0SWpD8Q", description: "" },
      { title: "KFC", url: "https://drive.google.com/file/d/1-ncm5Rs9t86-6QWw06l3ERkRMl3NAsIo/view?usp=sharing", description: "" },
      { title: "Qatar Airlines", url: "https://www.instagram.com/reel/C-iJ8fmoeVn/?hl=en", description: "" , thumbnail: "./thumbnails/Qatar.png"},
      { title: "Nissan", url: "https://www.instagram.com/reel/C48O17bLphn/?igsh=NTc4MTIwNjQ2YQ==", description: "" , thumbnail: "./thumbnails/Nissan.png"},
      { title: "Dubai Tourism Board", url: "https://www.tiktok.com/@crashadamsbackup/video/7396452328678886702", description: "",  thumbnail: "./thumbnails/DubaiToursim.png"  },
      { title: "W Hotels", url: "https://www.instagram.com/reel/DFCxRSkxy4m/?igsh=NTc4MTIwNjQ2YQ==", description: "" , thumbnail: "./thumbnails/W-hotel.png" },
      { title: "US Open", url: "https://www.instagram.com/reel/CwtYLy8vyi1/?igsh=NTc4MTIwNjQ2YQ==", description: "" , thumbnail: "./thumbnails/US-Open.png"},
      { title: "RW & Co", url: "https://www.tiktok.com/@crashadams/video/7535688521193934136?lang=en", description: "" , thumbnail: "./thumbnails/RW.png" },
      { title: "Chicago Cubs", url: "https://www.instagram.com/p/DK7s4UmyR20/?img_index=2&igsh=NTc4MTIwNjQ2YQ==", description: "" , thumbnail: "./thumbnails/Chicago.png" },
      { title: "HSBC", url: "https://www.youtube.com/shorts/yU87LL9GJLU", description: "" },
      { title: "Vaughan Mills", url: "https://www.instagram.com/reel/DCBXgcixRMK/?igsh=NTc4MTIwNjQ2YQ==", description: "" , thumbnail: "./thumbnails/VAUGHAN-MILLS.png" }
    ],
    // LIVE MUSIC ACTIVATIONS grid
    moreFeatured: [
      { title: "New Year's Eve 2025 @ Hong Kong", url: "https://www.youtube.com/watch?v=NpDXBwPkr2w", description: "Headlined Hong Kong's official NYE celebration, reaching an estimated 39M TV viewers." },
      { title: "New Year's Eve 2025 @ Singapore", url: "https://www.youtube.com/watch?v=eKrXPyowCv0", description: "Headlined Singapore's official NYE celebration, broadcast to an estimated 5M TV viewers." },
      { title: "Dubai Tourism Music Videos", url: "https://www.youtube.com/watch?v=PS2mxYk-Tfo", description: "Partnered with Dubai Tourism to create and film two music videos in Dubai." },
      { title: "Google Store Pop-Up @ New York", url: "https://www.instagram.com/p/CqmGci-v_t8/?img_index=6&igsh=NTc4MTIwNjQ2YQ==", description: "Surprise pop-up at the Google Store Chelsea; reached venue capacity."  , thumbnail: "./thumbnails/Google.png" },
      { title: "AIA Carnival Secret Performance @ Hong Kong", url: "https://www.instagram.com/reel/DE1bR5Dg51c/?igsh=NTc4MTIwNjQ2YQ==", description: "Fan scavenger hunt ending in a surprise live performance."  , thumbnail: "./thumbnails/AIA.png"},
      { title: "YouTube Music Nights @ Harbour City, Hong Kong", url: "https://www.youtube.com/watch?v=lWk_yYHbFBM&t=1495s", description: "Contest with a special 30-min set overlooking the marina." },
      { title: "Qatar Airport Flash Mob", url: "https://www.tiktok.com/@emiliopiano/video/7401954904463412513", description: "Surprise performance with Qatar Airways and Emilio Piano at DOH."  , thumbnail: "./thumbnails/Qatar.png" },
      { title: "Canada Day Celebration @ Toronto", url: "https://www.instagram.com/reel/C9deomGPHmH/?igsh=NTc4MTIwNjQ2YQ==", description: "Headlined for 20k+ attendees."   , thumbnail: "./thumbnails/canada-day.png"} ,
      { title: "Lido Connect 'Secret Busking' @ Thailand", url: "https://www.youtube.com/watch?v=GOF3gb8Cl4Y", description: "Secret location busking-style pop-up in Bangkok." },
      { title: "TikTok Canada & Toronto Maple Leafs Parking Lot Party", url: "", description: "Headlined pre-game parking lot party for Leafs playoff home opener.", allowPhoto: true },
      { title: "San Jose Sharks Intermission Performance", url: "https://www.youtube.com/shorts/jRsVk7hMVGQ", description: "Intermission performance at Sharks home opener." },
      // Ensure Rixos renders beside the Sharks card in the grid
      { title: "Rixos Hotels - Hotel Party Music Video", url: "https://www.youtube.com/watch?v=ku1zZfNbTNk", description: "Partnered with Dubai Tourism to create and film two music videos in Dubai." }
    ]
  },
  bioText: `Crash Adams is a Toronto-based pop duo made up of childhood friends Rafaele "Crash"
Massarelli and Vince "Adams" Sasso. They've built a dedicated fanbase and launched a
successful music career by leveraging their ability to go insanely viral through fun and authentic
content.Their music is an infectious blend of pop and pop-rock, defined by catchy hooks and
feel-good, cinematic storytelling. 
In 2025/26, they’ll expand their viral short-form series while taking fans on the road—sharing
concert footage, press moments, tour life, and the process of creating music and videos.
Rafaele and Vince bring fans closer by showing both the highs of performing and the
behind-the-scenes of their journey`,
  highlights: [
    { emoji: "🎧", bold: "450M", text: " Video/Audio Streams" },
    { emoji: "📺", bold: "12 Million Subscribers", text: " on YouTube and 5.8 Billion Views" },
    { emoji: "📱", bold: "Top 5", text: " Most Viewed Artist in Canada on TikTok" },
    { emoji: "🌟", bold: "Featured", text: " on America’s Got Talent" },
    { emoji: "🏆", bold: "2025 Juno Nominee", text: " for “Group Of The Year”" },
    { emoji: "🤝", bold: "Notable Content Collabs Include:", text: " Victoria Justice, JVKE, Emilio Piano, Huddy, America’s Got Talent" }
  ],
  brandCollabs: {
    title: "NOTABLE BRAND COLLABS:",
    logos: [
      { name: "Meta", img: "https://cdn.simpleicons.org/meta" },
      { name: "YouTube", img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
      { name: "Google", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
      { name: "Old Spice", img: "https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Current_Old_Spice_Logo_2016.svg/1200px-Current_Old_Spice_Logo_2016.svg.png" },
      { name: "Qatar Airways", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Qatar_Airways_Logo.png/1200px-Qatar_Airways_Logo.png" },
      { name: "Xbox", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1200px-Xbox_one_logo.svg.png" },
      { name: "Snapchat", img: "https://upload.wikimedia.org/wikipedia/it/c/c4/Snapchat_logo.svg" },
      { name: "TikTok", img: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png" },
      { name: "KFC", img: "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/KFC_logo-image.svg/1200px-KFC_logo-image.svg.png" },
      { name: "Dubai Travel Board", img: "https://i0.wp.com/www.matjoez.com/wp-content/uploads/2017/11/tourism-dubai-logo.png?fit=765%2C402&ssl=1" },
      { name: "Hong Kong Tourism Board", img: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/HKTourismBoard.svg/250px-HKTourismBoard.svg.png" },
      { name: "HSBC", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/1200px-HSBC_logo_%282018%29.svg.png" },
      { name: "TD Bank", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TD_Bank.svg/2560px-TD_Bank.svg.png" },
      { name: "Nissan", img: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg" },
      { name: "W Hotels", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/W_Hotels_Logo.svg/2426px-W_Hotels_Logo.svg.png" },
      { name: "The Standard Hotels", img: "https://static1.squarespace.com/static/595ae4d7b11be1e84976a6ba/t/6599f3ef4c5478429ebd9c2b/1757500285650/" },
      { name: "Doc Martens", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dr._Martens_Logo.svg/2560px-Dr._Martens_Logo.svg.png" },
      { name: "Miller Genuine Draft", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Y0YbpJOZBhgdJyJNwnXCMlk7JMVehGnQcw&s" },
      { name: "Harry Rosen", img: "https://upload.wikimedia.org/wikipedia/commons/6/64/HRI_Logo.jpg" },
      { name: "RW & Co", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMmAZKcAEEwYRSvDNHjFIjPHH_uUNmDhV54g&s" },
      { name: "San Jose Sharks", img: "https://upload.wikimedia.org/wikipedia/en/3/37/SanJoseSharksLogo.svg" },
      { name: "NHL", img: "https://upload.wikimedia.org/wikipedia/en/3/3a/05_NHL_Shield.svg" },
      { name: "Chicago Cubs", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chicago_Cubs_logo.svg/1191px-Chicago_Cubs_logo.svg.png" },
      { name: "Rixos Hotels", img: "https://upload.wikimedia.org/wikipedia/fr/c/c3/RIXOS-HOTELS-Logo.jpg" },
      { name: "Fender", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Fender_guitars_logo.svg/1200px-Fender_guitars_logo.svg.png" }
    ]
  },
  press: {
    title: "NOTABLE PRESS:",
    articles: [
      { title: "NBC", url: "https://www.nbc.com/nbc-insider/all-about-crash-adams-agt", img: "./NBC.jpg" },
      { title: "Rolling Stone", url: "https://www.rollingstone.com/music/music-features/shakira-olivia-rodrigo-future-metro-boomin-songs-you-need-to-know-1234992889/", img: "./ROLLING-STONE.jpeg" },
      { title: "Sirius XM Hits 1", url: "https://www.youtube.com/watch?v=U7aM5iBp5co", img: "./SIRIUS-XM.jpg" },
      { title: "Billboard", url: "https://ca.billboard.com/music/pop/new-and-upcoming-canadian-releases-crash-adams-sum-41-good-kid-more", img: "./BILLBOARD.webp" },
      { title: "The Zach Sang Show", url: "https://www.youtube.com/watch?v=fenyzc8axtc", img: "./ZACH-SANG.jpg" },
      { title: "TMRW MAG", url: "https://www.tmrwmagazine.com/en/news/crash-adams-looks-out-for-the-little-guy", img: "./TMRW-MAG.jpg" }
    ]
  }
};

// =====================
// Per-platform stats
// =====================
const youtubeStats = () => ({ followers: 12000000, engagementRate: 3, totalImpressions: 205000000, shares: 1200000, views: 250000000, likes: 2500000, comments: 44000 });
// Updated per user: YouTube gender split Male 61.1% / Female 38.6%
const youtubeGender = () => ({ male: 61.1, female: 38.6 });
const youtubeAges = () => ([
  { range: "18–24", value: 8.0 },
  { range: "25–34", value: 21.8 },
  { range: "35–44", value: 23.4 },
  { range: "45–54", value: 19.3 },
  { range: "55–64", value: 15.3 }
]);
const youtubeCountries = () => ([
  { name: "United States", value: 21.6 },
  { name: "India", value: 8.8 },
  { name: "United Kingdom", value: 4.6 },
  { name: "Germany", value: 4.6 },
  { name: "Canada", value: 2.3 }
]);

const tiktokStats = () => ({ followers: 7500000, engagementRate: 9, totalImpressions: 178000000, shares: 522000, views: 504000000, likes: 15000000, comments: 395000 });
const tiktokGender = () => ({ male: 62, female: 37 });
const tiktokAges = () => ([
  { range: "18–24", value: 15.2 },
  { range: "25–34", value: 30.1 },
  { range: "35–44", value: 24.5 },
  { range: "45–54", value: 17.5 },
  { range: "55–64", value: 12.7 }
]);
const tiktokCountries = () => ([
  { name: "United States", value: 12.9 },
  { name: "Other", value: 8.6 },
  { name: "Unknown", value: 3.1 },
  { name: "United Kingdom", value: 2.7 },
  { name: "Canada", value: 2.2 },
  { name: "Brazil", value: 2.0 }
]);

// Tik Tok Backup Page  
const crashAdamNetworkStats = () => ({ followers: 2500000, engagementRate: 9.84, totalImpressions: 133000000, shares: 302000, views: 155000000, likes: 14000000, comments: 295000 });
const crashAdamNetworkGender = () => ({ male: 61.65, female: 37.37 });
const crashAdamNetworkAges = () => ([
  { range: "18–24", value: 24.98 },
  { range: "25–34", value: 35.72 },
  { range: "35–44", value: 22.42 },
  { range: "45–54", value: 10.97 },
  { range: "55+", value: 5.88 }
]);
const crashAdamNetworkCountries = () => ([
  { name: "United States", value: 9.16 },
  { name: "Other", value: 60.54 },
  { name: "Philippines", value: 6.35 },
  { name: "South Africa", value: 4.51 },
  { name: "Nigeria", value: 2.59 },
]);

const instagramStats = () => ({ followers: 3400000, engagementRate: 13, totalImpressions: 62000000, shares: 401000, views: 203000000, likes: 7500000, comments: 125000 });
const instagramGender = () => ({ male: 67.3, female: 32.7 });
const instagramAges = () => ([
  { range: "18–24", value: 20.6 },
  { range: "25–34", value: 40.4 },
  { range: "35–44", value: 21.2 },
  { range: "45–54", value: 7.5 },
  { range: "55–64", value: 2.9 }
]);
const instagramCountries = () => ([
  { name: "United States", value: 15.8 },
  { name: "Indonesia", value: 9.8 },
  { name: "Unknown", value: 9.1 },
  { name: "India", value: 4.8 },
  { name: "Brazil", value: 3.2 },
  { name: "Malaysia", value: 2.0 }
]);


const facebookStats = () => ({ followers: 3200000, engagementRate: 7.2, totalImpressions: 68000000, shares: 60000, views: 133000000, likes: 4800000, comments: 49000 });
const facebookGender = () => ({ male: 64, female: 36 });
const facebookAges = () => ([
  { range: "18–24", value: 22.1 },
  { range: "25–34", value: 39.3 },
  { range: "35–44", value: 22.3 },
  // { range: "45–54", value: 7.5 },
  // { range: "55–64", value: 2.9 }
]);
const facebookCountries = () => ([
  { name: "United States", value: 27.0 },
  { name: "Philippines", value: 15.2 },
  { name: "Nigeria", value: 6.0 },
  { name: "South Africa", value: 5.4 },
]);

const snapchatStats = () => ({ followers: 1100000, engagementRate: null, totalImpressions: 13000000, shares: null, views: 70000000, likes: null, comments: null });
const snapchatGender = () => ({ male: 48.9, female: 51.1 });
const snapchatAges = () => ([
  { range: "18–24", value: 12 },
  { range: "25–34", value: 9 },
  { range: "35–44", value: 21.2 },
  { range: "45–54", value: 7.5 },
  { range: "55–64", value: 2.9 }
]);
const snapchatCountries = () => ([
  { name: "Makkah", value: 3 },
  { name: "Riyadh", value: 3 },
  { name: "Tashkent City", value: 3 },
  { name: "Punjab", value: 2 },
  { name: "Arbil", value: 2 },
]);

// =====================
// Shape guards & normalization
// =====================
const ensurePlatformShape = (p) => ({
  username: p?.username ?? "@crashadams",
  avatar: p?.avatar ?? "",
  stats: {
    followers: safeNum(p?.stats?.followers, 0),
    engagementRate: p?.stats?.engagementRate == null ? null : safeNum(p?.stats?.engagementRate, 0),
    totalImpressions: safeNum(p?.stats?.totalImpressions, 0),
    shares: p?.stats?.shares == null ? null : safeNum(p?.stats?.shares, 0),
    views: safeNum(p?.stats?.views, 0),
    likes: p?.stats?.likes == null ? null : safeNum(p?.stats?.likes, 0),
    comments: p?.stats?.comments == null ? null : safeNum(p?.stats?.comments, 0)
  },
  gender: { male: clamp(safeNum(p?.gender?.male, 0), 0, 100), female: clamp(safeNum(p?.gender?.female, 0), 0, 100) },
  ages: Array.isArray(p?.ages) && p.ages.length
    ? p.ages.map((r) => ({ range: String(r?.range ?? ""), value: clamp(safeNum(r?.value, 0), 0, 100) }))
    : youtubeAges(),
  countries: Array.isArray(p?.countries) && p.countries.length
    ? p.countries.map((c) => ({ name: String(c?.name ?? "Country"), value: clamp(safeNum(c?.value, 0), 0, 100) }))
    : youtubeCountries()
});
const ensurePlatformData = (pd) => {
  const base = pd || {};
  const next = {};
  PLATFORM_ORDER.forEach((k) => { next[k] = ensurePlatformShape(base[k]); });
  return next;
};

// =====================
// Video Helpers
// =====================
function toEmbed(url) {
  if (!url) return ""

  // YouTube handling
  const ytShort = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/)
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?modestbranding=1&rel=0&showinfo=0`
  const yt = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?modestbranding=1&rel=0&showinfo=0`

  // TikTok handling
  const tiktok = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  if (tiktok) return `https://www.tiktok.com/embed/v2/${tiktok[1]}?lang=en-US`

  // Instagram handling
  const igReel = url.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/)
  if (igReel)
    return `https://www.instagram.com/p/${igReel[1]}/embed/captioned/?cr=1&v=14&wp=1080&rd=https%3A%2F%2Fwww.instagram.com&rp=%2Fp%2F${igReel[1]}%2F#%7B%22ci%22%3A0%2C%22os%22%3A0%7D`
  const igPost = url.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/)
  if (igPost)
    return `https://www.instagram.com/p/${igPost[1]}/embed/captioned/?cr=1&v=14&wp=1080&rd=https%3A%2F%2Fwww.instagram.com&rp=%2Fp%2F${igPost[1]}%2F#%7B%22ci%22%3A0%2C%22os%22%3A0%7D`

  return url
}
const getVideoDesc = (item) => item?.desc ?? item?.description ?? "";
// Updated VideoGallery function with thumbnail support for TikTok/Instagram

function VideoGallery({ links = [], colors, itemTitleBold = false, itemTitleColor }) {
  const c = {
    muted: DEFAULT_CONFIG.customColors.muted,
    border: DEFAULT_CONFIG.customColors.border,
    _cardBg: DEFAULT_CONFIG.customColors.cardBg,
    ...colors,
  }

  // Helper function to check if URL is TikTok or Instagram
  const isTikTokOrInstagram = (url) => {
    return url && (url.includes("tiktok.com") || url.includes("instagram.com"))
  }

  // Helper function to check if URL is YouTube
  const isYouTube = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"))
  }

  // Helper function to get thumbnail path from item property
  const getThumbnailPath = (item) => {
    return item.thumbnail || './thumbnails/default.jpg'
  }

  const videoOnlyLinks = links.filter((item) => {
    if (!item.url) return false
    // Check if URL is a valid video platform URL
    return (
      item.url.includes("youtube.com") ||
      item.url.includes("youtu.be") ||
      item.url.includes("tiktok.com") ||
      item.url.includes("instagram.com")
    )
  })

  // Separate videos by platform for different layouts
  const tiktokIgVideos = videoOnlyLinks.filter(
    (item) => item.url && (item.url.includes("tiktok.com") || item.url.includes("instagram.com")),
  )

  const youtubeVideos = videoOnlyLinks.filter(
    (item) => item.url && (item.url.includes("youtube.com") || item.url.includes("youtu.be")),
  )

  const otherVideos = videoOnlyLinks.filter(
    (item) =>
      !item.url ||
      (!item.url.includes("tiktok.com") &&
        !item.url.includes("instagram.com") &&
        !item.url.includes("youtube.com") &&
        !item.url.includes("youtu.be")),
  )

  const renderVideoItem = (item, i, isVertical = false) => {
    const isTikTokIg = isTikTokOrInstagram(item.url)
    const isYT = isYouTube(item.url)
    const thumbnailPath = getThumbnailPath(item)

    return (
      <div key={i} className="flex flex-col gap-1">
        <div
          className={`text-[16px] line-clamp-1 ${itemTitleBold ? "font-semibold" : ""}`}
          style={{ color: itemTitleColor ?? c.muted }}
        >
          {item.title || "Featured"}
        </div>
        <div
          className={`w-full ${isVertical ? "h-80" : "h-40"} rounded-md overflow-hidden border flex items-center justify-center relative group cursor-pointer`}
          style={{ borderColor: c.border, background: c._cardBg }}
          onClick={() => {
            if (item.url) {
              window.open(item.url, '_blank', 'noopener,noreferrer')
            }
          }}
        >
          {item.url ? (
            <>
              {isTikTokIg ? (
                // Render thumbnail for TikTok/Instagram with play overlay
                <div className="relative w-full h-full">
                  <img
                    src={thumbnailPath}
                    alt={item.title || "Video thumbnail"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a default thumbnail or placeholder
                      e.target.src = "./thumbnails/default.jpg"
                    }}
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-gray-800 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Platform indicator */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {item.url.includes("tiktok.com") ? "TikTok" : "Instagram"}
                  </div>
                </div>
              ) : isYT ? (
                // Keep YouTube embeds as before
                <iframe
                  title={`video-${i}`}
                  src={toEmbed(item.url)}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "none" }}
                />
              ) : (
                // Fallback for other video types
                <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: c.muted }}>
                  Video not supported
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: c.muted }}>
              No video
            </div>
          )}
        </div>
        {getVideoDesc(item) && (
          <div className="text-xs leading-snug mt-1" style={{ color: c.muted }}>
            {getVideoDesc(item)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* TikTok/Instagram Videos - Vertical Layout with Thumbnails */}
      {tiktokIgVideos.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-3" style={{ color: c.muted }}>
            TikTok & Instagram
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {tiktokIgVideos.map((item, i) => renderVideoItem(item, `tiktok-${i}`, true))}
          </div>
        </div>
      )}

      {/* Other Videos */}
      {otherVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {otherVideos.map((item, i) => renderVideoItem(item, `other-${i}`))}
        </div>
      )}

      {/* YouTube Videos - Horizontal Layout with Embeds */}
      {youtubeVideos.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-3" style={{ color: c.muted }}>
            YouTube
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {youtubeVideos.map((item, i) => renderVideoItem(item, `youtube-${i}`))}
          </div>
        </div>
      )}

      <div className="text-[11px]" style={{ color: c.muted }}>
        Note: YouTube videos are embedded. TikTok/Instagram show thumbnails - click to open original video.
      </div>
    </div>
  )
}
// =====================
// Stat & Info Sections
// =====================
function StatCard({ label, value, suffix, colors }) {
  return (
    <Card className="border shadow-md" style={{ background: colors._cardBg, borderColor: colors.border, color: colors.text }}>
      <CardContent>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: colors.muted }}>{label}</div>
        <div className="mt-2 text-3xl font-semibold">{fmtShort(value)}{suffix || ""}</div>
        <div className="mt-1 text-[10px] uppercase tracking-widest" style={{ color: colors.muted }}>Last 60 days</div>
      </CardContent>
    </Card>
  );
}

function HighlightsGrid({ items = [], colors = {} }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-md"
            style={{ background: DEFAULT_CONFIG.customColors.highlightIconBg }}
          >
            <span className="text-lg">{it.emoji}</span>
          </div>
          <div className="text-sm leading-5" style={{ color: colors.text }}>
            <span className="font-semibold">{it.bold}</span>
            <span> {it.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandCollabsSection({ cfg = DEFAULT_CONFIG.brandCollabs, colors }) {
  const border = { borderColor: colors.border };
  return (
    <Card className='shadow-md' style={{ background: colors._cardBg, ...border }}>
      <CardContent>
        <h2 className="text-xl font-bold tracking-wide mb-4 border-b pb-2 uppercase" style={{ color: colors.text, borderColor: colors.border }}>
          {cfg.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
          {(cfg.logos || []).map((l, idx) => (
            <div key={idx} className="w-28 h-16 flex items-center justify-center">
              {l.img ? (
                <img src={l.img} alt={l.name} className="max-w-[100px] max-h-[40px] object-contain" />
              ) : (
                <div className="text-sm font-semibold text-center" style={{ color: colors.text }}>{l.name}</div>
              )}
            </div>
          ))}
          {(!cfg.logos || cfg.logos.length === 0) && (
            <div className="text-sm" style={{ color: colors.muted }}>Logos coming soon.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PressSection({ cfg = DEFAULT_CONFIG.press, colors }) {
  const border = { borderColor: colors.border };
  return (
    <Card className='shadow-md' style={{ background: colors._cardBg, ...border }}>
      <CardContent>
        <h2 className="text-xl font-bold tracking-wide mb-4 border-b pb-2 uppercase" style={{ color: colors.text, borderColor: colors.border }}>
          {cfg.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(cfg.articles || []).map((a, idx) => (
            <a
              key={idx}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg overflow-hidden hover:shadow-md transition"
              style={{ borderColor: colors.border }}
            >
              {a.img && (
                <div className="aspect-[16/9] w-full bg-white border-b" style={{ borderColor: colors.border }}>
                  <img src={a.img} alt={a.title} className="w-full h-full object-center" />
                </div>
              )}

              <div className="p-4">
                <div className="font-semibold mb-2" style={{ color: colors.text }}>{a.title}</div>
                <div className="text-sm break-all" style={{ color: colors.muted }}>{a.url}</div>
              </div>
            </a>
          ))}
          {(!cfg.articles || cfg.articles.length === 0) && (
            <div className="text-sm" style={{ color: colors.muted }}>Press highlights coming soon.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================
// Main Component
// =====================
function EditableAnalyticsDashboard() {
  const [customColors, setCustomColors] = useState(DEFAULT_CONFIG.customColors);
  const [profile, setProfile] = useState(DEFAULT_CONFIG.profile);
  const [avatarSize] = useState(DEFAULT_CONFIG.avatarSize);
  const [platform, setPlatform] = useState(DEFAULT_CONFIG.platform);
  const [platformData, setPlatformData] = useState(() => ensurePlatformData({
    youtube: { username: "@crashadams", avatar: "", stats: youtubeStats(), gender: youtubeGender(), ages: youtubeAges(), countries: youtubeCountries() },
    tiktok: { username: "@crashadams", avatar: "", stats: tiktokStats(), gender: tiktokGender(), ages: tiktokAges(), countries: tiktokCountries() },
    tik_tok_backup: { username: "@crashadams", avatar: "", stats: crashAdamNetworkStats(), gender: crashAdamNetworkGender(), ages: crashAdamNetworkAges(), countries: crashAdamNetworkCountries() },

    instagram: { username: "@crashadams", avatar: "", stats: instagramStats(), gender: instagramGender(), ages: instagramAges(), countries: instagramCountries() },
    facebook: { username: "@crashadams", avatar: "", stats: facebookStats(), gender: facebookGender(), ages: facebookAges(), countries: facebookCountries() },
    snapchat: { username: "@crashadams", avatar: "", stats: snapchatStats(), gender: snapchatGender(), ages: snapchatAges(), countries: snapchatCountries() }
  }));
  const [labels] = useState(DEFAULT_CONFIG.labels);
  const [tagVideos, setTagVideos] = useState(() => ({ ...DEFAULT_CONFIG.tagVideos }));
  const [view, setView] = useState("overview");
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const cfg = JSON.parse(saved);
        setProfile((p) => ({ ...p, photo: cfg?.profile?.photo || p.photo }));
        if (cfg?.tagVideos) setTagVideos((prev) => ({ ...prev, ...cfg.tagVideos }));
      }
    } catch { }
  }, []);

  const palette = useMemo(() => ["#A78BFA", "#7C3AED", "#6D28D9", "#4C1D95", "#C4B5FD"], []);
  const colors = useMemo(() => ({
    primary: customColors.primary || palette[1],
    secondary: customColors.secondary || palette[0],
    pageBg: customColors.pageBg || "#ffffff",
    cardBg: customColors.cardBg || "#f9fafb",
    border: customColors.border,
    text: customColors.text,
    muted: customColors.muted,
  }), [customColors, palette]);
  colors._pageBg = makeBg(colors.pageBg, DEFAULT_CONFIG.customColors.pageBgGradient);
  colors._cardBg = makeBg(colors.cardBg, DEFAULT_CONFIG.customColors.cardBgGradient || { enabled: false });

  const normalizedPlatformData = useMemo(() => ensurePlatformData(platformData), [platformData]);
  const active = normalizedPlatformData[platform];
  const totalFollowers = useMemo(
    () => PLATFORM_ORDER.reduce((s, p) => s + safeNum(normalizedPlatformData[p]?.stats?.followers, 0), 0),
    [normalizedPlatformData]
  );

  const tooltipStyle = { background: colors._cardBg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text };

  const pieData = [
    { name: "Male", value: clamp(safeNum(active?.gender?.male, 0), 0, 100) },
    { name: "Female", value: clamp(safeNum(active?.gender?.female, 0), 0, 100) }
  ];
  const barData = (active?.ages && active.ages.length ? active.ages : youtubeAges()).map((r) => ({
    range: String(r.range || ""),
    value: clamp(safeNum(r.value, 0), 0, 100)
  }));

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: colors._pageBg, color: colors.text, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <div className="max-w-[1100px] mx-auto space-y-5">
        {/* Header */}
        <Card
          className="overflow-hidden shadow-md"
          style={{ background: colors._cardBg, borderColor: colors.border }}
        >
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Avatar */}
              <div
                className="relative rounded-xl overflow-hidden border shrink-0 flex items-center justify-center mx-auto sm:mx-0"
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderColor: colors.border,
                  background: colors.border,
                }}
              >
                {imgOk && profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="profile"
                    className="h-full w-full object-cover"
                    onError={() => setImgOk(false)}
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-xs"
                    style={{ color: colors.muted, background: "#fff" }}
                  >
                    Add
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e?.target?.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = String(reader.result || "");
                      setProfile((prev) => ({ ...prev, photo: dataUrl }));
                      try {
                        const saved =
                          typeof window !== "undefined"
                            ? window.localStorage.getItem(STORAGE_KEY)
                            : null;
                        const cfg = saved ? JSON.parse(saved) : {};
                        cfg.profile = { ...(cfg.profile || {}), photo: dataUrl };
                        if (typeof window !== "undefined")
                          window.localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(cfg)
                          );
                      } catch { }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Info section */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold">
                  {profile.displayName || "Display Name"}
                </h2>

                {/* View Switcher */}
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "analytics", label: "Analytics" },
                    { id: "brands", label: "Brands/Performances" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setView(b.id)}
                      className={`px-6 py-2 cursor-pointer rounded-full border ${view === b.id
                        ? "opacity-100"
                        : "opacity-80 hover:opacity-100"
                        }`}
                      style={{
                        borderColor: colors.border,
                        background:
                          view === b.id ? colors.secondary : "transparent",
                        color: view === b.id ? "#0b0b0b" : colors.text,
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                {/* Followers summary row */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Followers + Views */}
                  <div className="flex justify-center sm:justify-start gap-6">
                    <div>
                      <div
                        className="text-[9px] uppercase tracking-widest"
                        style={{ color: colors.muted }}
                      >
                        Total Followers
                      </div>
                      <div className="text-2xl font-semibold">
                        {fmtShort(totalFollowers)}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[9px] uppercase tracking-widest"
                        style={{ color: colors.muted }}
                      >
                        Total Views
                      </div>
                      <div className="text-2xl font-semibold">10.0B</div>
                    </div>
                  </div>

                  {/* Contact + Socials */}
                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="flex items-center gap-2 bg-customYellow text-customBrown px-4 py-1 rounded-full shadow-sm w-fit mx-auto sm:mx-0">
                      <MdEmail className="text-[18px]" />
                      <a
                        href="mailto:crashadamsmusic@crashadamsmusic.com"
                        className="font-medium hover:underline text-xs sm:text-sm"
                      >
                        Contact Us : crashadamsmusic@.com
                      </a>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                      {PLATFORM_ORDER.filter((p) => p !== "tik_tok_backup").map(
                        (p) => (
                          <a
                            key={p}
                            href={PLATFORM_LINKS[p]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-80 transition"
                          >
                            <div className="h-7 w-7 flex items-center justify-center">
                              {PLATFORM_ICON[p]}
                            </div>
                            <span className="text-[14px] sm:text-[16px]">
                              {fmtShort(
                                normalizedPlatformData[p]?.stats?.followers
                              )}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Switcher (Analytics only) */}
        {view === "analytics" && (
          <div className="" id="analytics">
            <div className="flex flex-wrap items-center gap-2 whitespace-nowrap text-xs">
              {PLATFORM_ORDER.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-2 md:px-4 py-1 md:py-2 cursor-pointer rounded-md border inline-flex items-center gap-1.5 ${platform === p ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                  style={{ borderColor: colors.border, background: platform === p ? colors.secondary : "transparent", color: platform === p ? "#0b0b0b" : colors.text }}
                >
                  <span className="h-4 w-4 rounded-sm overflow-hidden border inline-flex items-center justify-center" style={{ borderColor: colors.border, background: colors.border }}>
                    <span className="text-[10px] leading-none" style={{ color: colors.muted }}>{PLATFORM_LABEL[p][0]}</span>
                  </span>
                  <span>{PLATFORM_LABEL[p]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Heading (Analytics) */}
        {view === "analytics" && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-semibold">{labels.heading}</h1>
            </div>
          </div>
        )}

        {/* Content routed by view */}
        {view === "brands" ? (
          <>
            {/* FEATURED VIDEOS */}
            <Card className="rounded-2xl shadow-md mt-0" id="brands" style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <div className="text-xs uppercase tracking-widest mb-3 font-bold" style={{ color: colors.text }}>
                  Notable Campaigns
                </div>
                <VideoGallery links={tagVideos.featured} colors={colors} itemTitleBold itemTitleColor={colors.text} />
              </CardContent>
            </Card>

            {/* LIVE MUSIC ACTIVATIONS */}
            <Card className="rounded-2xl shadow-md" style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <div className="text-xs uppercase tracking-widest mb-3 font-bold" style={{ color: colors.text }}>
                  LIVE MUSIC ACTIVATIONS
                </div>
                <VideoGallery links={tagVideos.moreFeatured} colors={colors} itemTitleBold itemTitleColor={colors.text} />
              </CardContent>
            </Card>
          </>
        ) : view === "analytics" ? (
          <>
            <div className="grid gap-4 md:grid-cols-3 ">
              <StatCard colors={colors} label={labels.followers} value={active.stats.followers} />
              <StatCard colors={colors} label={labels.engagement} value={active.stats.engagementRate} suffix={active.stats.engagementRate == null ? "" : "%"} />
              <StatCard colors={colors} label={labels.totalImpressions} value={active.stats.totalImpressions} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard colors={colors} label={labels.shares} value={active.stats.shares} />
              <StatCard colors={colors} label={labels.views} value={active.stats.views} />
              <StatCard colors={colors} label={labels.likes} value={active.stats.likes} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard colors={colors} label={labels.comments} value={active.stats.comments} />

              {/* Gender Pie */}
              <Card className="rounded-2xl shadow-md" style={{ background: colors._cardBg, borderColor: colors.border }}>
                <CardContent>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.muted }}>{labels.gender}</div>
                  <div className="h-52">
                    <ResponsiveContainer>
                      <PieChart>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Pie dataKey="value" data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2}>
                          <Cell fill={colors.primary} />
                          <Cell fill={colors.secondary} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-6 text-sm mt-2">
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors.primary }} /> Male <span className="ml-1" style={{ color: colors.muted }}>{pieData[0].value}%</span></div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors.secondary }} /> Female <span className="ml-1" style={{ color: colors.muted }}>{pieData[1].value}%</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ages */}
            <Card className="rounded-2xl shadow-md" style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <div className="text-xs uppercase tracking-widest mb-4" style={{ color: colors.muted }}>{labels.ageGender}</div>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={barData} layout="vertical" margin={{ left: 50 }}>
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis type="category" dataKey="range" tick={{ fill: colors.muted }} width={60} />
                      {/* <Tooltip contentStyle={tooltipStyle} /> */}
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => `${value}%`}
                      />
                      <Bar dataKey="value" radius={[0, 12, 12, 0]} fill={colors.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Countries */}
            <Card className="rounded-2xl shadow-md" style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <div className="text-xs uppercase tracking-widest mb-4" style={{ color: colors.muted }}>{labels.topCountries}</div>
                <div className="grid gap-3">
                  {(active.countries || []).map((c, i) => (
                    <div key={`${c.name}-${i}`} className="flex items-center gap-3">
                      <div className="w-36 text-sm">{c.name}</div>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: colors.border }}>
                        <div className="h-full" style={{ width: `${clamp(safeNum(c.value, 0), 0, 100)}%`, background: colors.primary }} />
                      </div>
                      <div className="w-16 text-right text-sm" style={{ color: colors.muted }}>
                        {clamp(safeNum(c.value, 0), 0, 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* WHO WE ARE */}
            <Card id="overview" className='shadow-md' style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <h2 className="text-xl font-bold tracking-wide mb-3 border-b pb-2 uppercase" style={{ color: colors.text, borderColor: colors.border }}>
                  Mission:
                </h2>
                <p className="text-base leading-6" style={{ color: colors.text }}>
                  Crash Adams is a Toronto-based pop duo made up of childhood friends Rafaele "Crash"
                  Massarelli and Vince "Adams" Sasso. They've built a dedicated fanbase and launched a
                  successful music career by leveraging their ability to go insanely viral through fun and authentic
                  content.Their music is an infectious blend of pop and pop-rock, defined by catchy hooks and
                  feel-good, cinematic storytelling. <br />
                  <br />
                  In 2025/26, they’ll expand their viral short-form series while taking fans on the road—sharing
                  concert footage, press moments, tour life, and the process of creating music and videos.
                  Rafaele and Vince bring fans closer by showing both the highs of performing and the
                  behind-the-scenes of their journey
                </p>
                <br />
                {/* Partnership Opportunities */}
                <div className="mt-6 border-l-4 border-customYellow pl-4  rounded-md p-4">
                  <h2 className="text-xl font-extrabold text-customYellow mb-3 uppercase tracking-wider">
                    Partnership Opportunities
                  </h2>
                  <ul className="list-disc ml-6 space-y-2 text-base leading-relaxed font-medium">
                    <li>TikTok/IG Reels integrations</li>
                    <li>Facebook/Facebook Reels Integration</li>
                    <li>IG/FB Stories Integration</li>
                    <li>Snapchat integration</li>
                    <li>YouTube shorts/sponsored mentions</li>
                    <li>Tour sponsorships & live activations</li>
                    <li>Merch collaborations</li>
                    <li>Whitelisting/paid media amplification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* HIGHLIGHTS */}
            <Card className='shadow-md' style={{ background: colors._cardBg, borderColor: colors.border }}>
              <CardContent>
                <h2 className="text-xl font-bold tracking-wide mb-4 border-b pb-2 uppercase" style={{ color: colors.text, borderColor: colors.border }}>
                  HIGHLIGHTS:
                </h2>
                <HighlightsGrid items={DEFAULT_CONFIG.highlights} colors={colors} />
              </CardContent>
            </Card>

            {/* BRAND COLLABS */}
            <BrandCollabsSection colors={colors} />

            {/* PRESS */}
            <PressSection colors={colors} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DashboardShell>
      <EditableAnalyticsDashboard />
    </DashboardShell>
  );
}

// =====================
// Smoke Tests (runtime, non-blocking)
// These run in dev to help catch regressions. They don't affect UI.
// =====================
// FIX: guard 'process' existence so this doesn't throw in browser-only sandboxes.
if (
  typeof window !== "undefined" &&
  // eslint-disable-next-line no-undef
  (typeof process === "undefined" || process?.env?.NODE_ENV !== "production")
) {
  (function runSmokeTests() {
    try {
      // fmtShort
      console.assert(fmtShort(1500) === "1.5k", "fmtShort 1500 -> 1.5k failed");
      console.assert(fmtShort(2_000_000) === "2.0M", "fmtShort 2M -> 2.0M failed");

      // toEmbed
      console.assert(
        toEmbed("https://www.youtube.com/shorts/abcdefg") === "https://www.youtube.com/embed/abcdefg",
        "toEmbed shorts failed"
      );
      console.assert(
        toEmbed("https://youtu.be/qwerty1") === "https://www.youtube.com/embed/qwerty1",
        "toEmbed youtu.be failed"
      );

      // ensurePlatformData
      const epd = ensurePlatformData({});
      console.assert(Object.keys(epd).length === 4 && PLATFORM_ORDER.every(k => epd[k]), "ensurePlatformData keys missing");

      // youtube gender split
      const yg = youtubeGender();
      console.assert(Math.abs(yg.male - 61.1) < 0.001 && Math.abs(yg.female - 38.6) < 0.001, "YouTube gender split incorrect");

      // ages bar data shape
      const ages = youtubeAges();
      console.assert(Array.isArray(ages) && ages[0] && typeof ages[0].range === "string", "youtubeAges shape invalid");
    } catch (e) {
      // Don't crash the app on test errors; just report to console
      console.warn("Smoke test error:", e);
    }
  })();
}
