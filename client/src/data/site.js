// ------------------------------------------------------------------
//  All website content lives here. Edit this file to change the
//  brand name, contact details, numbers, curriculum, fees and FAQs.
//  Values marked "placeholder" should be replaced with your real data.
// ------------------------------------------------------------------

export const brand = {
  name: "AD Graphic's 2.0",
  short: "AD Graphic's",
  version: '2.0',
  logo: '/logo.png', // upload a new logo from Admin → Website content
  tagline: 'Creative Graphics Designing | Video Editing',
  about: 'Professional marketing agency specializing in digital strategies, video editing, and graphic design.',
  city: 'Jodhpur',
  batch: 'Batch 01',
  seats: 20,
  durationMonths: 5,
  email: '', // add your email here to show it in the footer
  phone: '+91 63677 29751',
  phoneHref: 'tel:+916367729751',
  whatsapp: 'https://wa.me/916367729751',
  instagram: 'https://www.instagram.com/ad_graphics_2.0/',
  instagramHandle: '@ad_graphics_2.0',
  address: '6-A-55, Front of ICICI Bank, Near Central Academy School, Kudi Bhagtasni Housing Board, Sector 6, Jodhpur, Rajasthan 342005',
  addressShort: 'Kudi Bhagtasni, Jodhpur',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('6-A-55 Kudi Bhagtasni Housing Board Sector 6 Jodhpur Rajasthan 342005'),
};

export const nav = [
  { label: 'Results', href: '#results' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Compare', href: '#compare' },
  { label: 'Fees', href: '#fees' },
  { label: 'FAQs', href: '#faqs' },
];

export const heroPoints = [
  `Only ${brand.seats} seats per batch`,
  `${brand.durationMonths} months, fully offline & hands-on`,
  'Graphic design + video editing in one program',
  'Placement support until you land paid work',
];

// placeholder numbers
export const stats = [
  { value: 92, suffix: '%', label: 'Students earning from design or editing within 90 days' },
  { value: 18, suffix: ' LPA', prefix: '₹', label: 'Highest package offered to a graduate' },
  { value: 40, suffix: '+', label: 'Brands & agencies in our hiring network' },
  { value: 600, suffix: '+', label: 'Hours of hands-on practice per student' },
];

export const outcomes = [
  { title: 'Full-time roles', text: 'Designers and editors placed at agencies, studios and brand teams.' },
  { title: 'Paid internships', text: 'Stipend-backed internships that convert into full-time offers.' },
  { title: 'Freelance clients', text: 'Retainer clients secured before graduation day.' },
];

// placeholder testimonials – replace with your own students
export const testimonials = [
  { name: 'Aarav Mehta', role: 'Video Editor, Digital Agency', quote: 'I came in only knowing phone apps. Five months later I was cutting brand films and designing their thumbnails too.', color: '#FFC800' },
  { name: 'Simran Kaur', role: 'Graphic Designer', quote: 'Learning design and editing together made me twice as valuable. Clients love that I can do both.', color: '#E8175D' },
  { name: 'Rohan Verma', role: 'Freelance Editor', quote: 'The client-communication sessions paid for themselves. I closed my first retainer during the course.', color: '#ffffff' },
  { name: 'Ishita Sharma', role: 'Social Media Designer', quote: 'Every week we worked on real briefs. My portfolio was full of live work, not practice files.', color: '#FFC800' },
  { name: 'Kabir Singh', role: 'Motion Designer', quote: 'The mentors treat you like a junior on their team. That mindset changed how I work.', color: '#E8175D' },
  { name: 'Neha Gupta', role: 'Brand Designer', quote: 'Typography, colour, layout, motion — it finally clicked because we practised on real projects.', color: '#ffffff' },
];

export const pillars = [
  { icon: 'Briefcase', title: 'Taught by working pros', text: 'Every mentor designs and edits for real clients. You learn what works today.' },
  { icon: 'Sparkles', title: 'Zero experience needed', text: 'We start from the basics and build you up to agency-grade output, step by step.' },
  { icon: 'Layers', title: 'Design + video, together', text: 'Two in-demand skills in one program — the combination every brand is hiring for.' },
  { icon: 'TrendingUp', title: 'Built for ROI', text: 'Everything in the program points at one goal: getting you paid for your skills.' },
];

export const advantages = [
  { title: 'Train inside a working studio', text: 'Sit next to live projects, deadlines and client calls — not a lecture hall.' },
  { title: 'Direct access to the founder', text: 'Weekly sessions on taste, pricing, and building a creative career.' },
  { title: 'Mentors who create daily', text: 'Small groups with mentors who review your designs and timelines line by line.' },
  { title: 'Real client projects', text: 'Graduate with a portfolio of shipped work, not practice exercises.' },
  { title: 'Placement support', text: 'Interviews, referrals and freelance leads until you land paid work.' },
];

export const curriculum = [
  { phase: '01', image: '/phases/p1.jpg', weeks: 'Weeks 1–3', title: 'Design Foundations', points: ['Colour, typography & layout', 'Photoshop essentials', 'Composition & visual hierarchy'] },
  { phase: '02', image: '/phases/p2.jpg', weeks: 'Weeks 4–6', title: 'Branding & Illustration', points: ['Logo & identity design in Illustrator', 'Brand guidelines', 'Posters, packaging & print'] },
  { phase: '03', image: '/phases/p3.jpg', weeks: 'Weeks 7–9', title: 'Social Media Creatives', points: ['Ad creatives & carousels', 'Thumbnails that get clicks', 'Designing for every platform'] },
  { phase: '04', image: '/phases/p4.jpg', weeks: 'Weeks 10–12', title: 'Video Editing', points: ['Premiere Pro workflow', 'Storytelling, pacing & hooks', 'Reels, shorts & long-form'] },
  { phase: '05', image: '/phases/p5.jpg', weeks: 'Weeks 13–15', title: 'Motion Graphics', points: ['After Effects animation', 'Kinetic typography', 'Logo animations & templates'] },
  { phase: '06', image: '/phases/p6.jpg', weeks: 'Weeks 16–18', title: 'Colour, Sound & Business', points: ['Colour grading in DaVinci Resolve', 'Sound design & mixing', 'Pricing, proposals & clients'] },
  { phase: '07', image: '/phases/p7.jpg', weeks: 'Weeks 19–21', title: 'Portfolio & Placements', points: ['Portfolio & showreel', 'Mock interviews & reviews', 'Placement drives & referrals'] },
];

export const sessionFormat = [
  { hours: '2 hrs', title: 'Expert session', text: 'Concept-heavy class led by a senior designer or editor.' },
  { hours: '2 hrs', title: 'Mentor lab', text: 'Guided practice with a mentor reviewing your work.' },
  { hours: '4 hrs', title: 'Open studio', text: 'Daily weekday access to the studio for practice.' },
];

export const tools = [
  { name: 'Photoshop', abbr: 'Ps', color: '#31a8ff', bg: '#0c1e33' },
  { name: 'Illustrator', abbr: 'Ai', color: '#ff9a00', bg: '#331c00' },
  { name: 'Premiere Pro', abbr: 'Pr', color: '#9999ff', bg: '#1d1d3d' },
  { name: 'After Effects', abbr: 'Ae', color: '#c8a2ff', bg: '#24133d' },
  { name: 'DaVinci Resolve', abbr: 'Dv', color: '#ffcf5c', bg: '#2b2410' },
  { name: 'Figma', abbr: 'Fg', color: '#ff7262', bg: '#331512' },
  { name: 'Canva', abbr: 'Cv', color: '#22d3ee', bg: '#082a30' },
  { name: 'AI Tools', abbr: 'AI', color: '#ff6b9d', bg: '#331624' },
];

export const skills = [
  'Typography', 'Colour Theory', 'Logo Design', 'Brand Identity', 'Social Media Design',
  'Storytelling', 'Motion Graphics', 'Sound Design', 'Colour Grading', 'Thumbnail Design',
  'Client Communication', 'Freelancing', 'Pricing & Proposals', 'Personal Branding',
];

// placeholder partner names – replace with your real hiring partners
export const partners = [
  'Northwind Media', 'Pixel & Co.', 'Frameworks', 'Studio Nine', 'Bright Reels', 'Bluefin Films',
  'Kite Creative', 'Orbit Labs', 'Hello Social', 'Monsoon Studio', 'Loop House', 'Cobalt Digital',
];

export const comparison = {
  columns: ['Online courses', 'Traditional institutes', brand.short],
  rows: [
    { label: 'Learning style', values: ['Pre-recorded videos', 'Theory-first classrooms', 'Hands-on, inside a studio'] },
    { label: 'Skills covered', values: ['One tool at a time', 'Design or video, not both', 'Graphic design + video editing'] },
    { label: 'Mentorship', values: ['Little to none', 'Large batches', 'Small groups, daily reviews'] },
    { label: 'Curriculum', values: ['Generic, often outdated', 'Slow to update', 'Built around current client work'] },
    { label: 'Industry access', values: ['None', 'Occasional guest talks', 'Live projects & hiring network'] },
    { label: 'Career support', values: ['Certificate only', 'Basic placement cell', 'Support until you land paid work'] },
    { label: 'End goal', values: ['Course completion', 'A diploma', 'A paid creative career'] },
  ],
};

export const fit = {
  yes: [
    'You want a full-time career in design, video editing, or both',
    'You can commit to 5 months of offline, full-day training',
    'You learn best by doing, with feedback from professionals',
    'You are ready to take criticism and iterate fast',
  ],
  no: [
    'You want a quick weekend certificate',
    'You can’t attend classes in person',
    'You are looking for a purely theoretical course',
    'You aren’t ready to put in daily practice hours',
  ],
};

export const fees = {
  applicationFee: '₹1,000',
  programFee: '₹1,18,000',
  applicationFeeAmount: 1000,
  programFeeAmount: 118000, // the big counting number in the Fees section
  emiText: 'EMI Available',
  includes: [
    `${brand.durationMonths} months of offline training`,
    'Graphic design + video editing curriculum',
    'Studio workstation & pro software access',
    'Real client projects for your portfolio',
    'Portfolio & showreel support',
    'Placement & freelance support',
  ],
  scholarship: {
    title: 'Merit scholarship',
    text: 'Selected applicants who show exceptional drive in their interview can receive up to 50% off the program fee.',
  },
};

export const faqs = [
  { q: 'Do I need prior design or editing experience?', a: 'No. The program starts from the fundamentals. What we look for is commitment, curiosity and the willingness to practise every day.' },
  { q: 'Will I learn both graphic design and video editing?', a: 'Yes. The first half focuses on design (Photoshop, Illustrator, branding, social creatives) and the second half on video editing, motion graphics, colour and sound.' },
  { q: 'Is the program online or offline?', a: 'It is fully offline at our studio. Being in the room with mentors and live projects is the core of how we teach.' },
  { q: 'Is job placement guaranteed?', a: 'We provide placement support — interviews, referrals and freelance leads — until you land paid work, provided you complete the program and its assignments.' },
  { q: 'Do I need my own laptop?', a: 'No. You will train on our studio workstations. A personal laptop is helpful for practice at home but not mandatory.' },
  { q: 'Is there an age limit?', a: 'Applicants should be 16 or older. We welcome everyone from school leavers to working professionals switching careers.' },
  { q: 'Who are the instructors?', a: 'Working designers, editors and motion artists from our studio team, plus guest sessions from industry professionals.' },
  { q: 'Can I do this alongside college or a job?', a: 'The program is full-day on weekdays, so it is hard to pair with a full-time job or daytime college. Weekend batches may open in the future.' },
  { q: 'Is the application fee refundable?', a: 'The ₹1,000 application fee is adjusted against your program fee if you are selected, and refunded if you are not.' },
];

// ------------------------------------------------------------------
//  Results section — proof points + student story cards
//  Photos live in client/public/students/ (real AD Graphic's students).
//  Names show as "Student 01" etc. — replace them with real names.
// ------------------------------------------------------------------
export const proof = {
  heading: ['Proof From', 'Our First Batch'],
  points: [
    '92% of graduates* landed paid design or editing work.',
    'Top placement package ₹18 LPA.',
    '₹45 LPA combined CTC across the batch.',
  ],
  footnote: `*Out of students who completed the program and actively pursued paid opportunities. Placeholder figures — replace with your real results.`,
};

export const studentStories = [
  { type: 'quote', quote: 'Every week brings a new brief and honest feedback from mentors.', name: 'Batch 01 student' },
  { photo: '/students/st01.jpg', name: 'Student 01', company: "AD Graphic's 2.0", role: 'Graphic Design Student' },
  { photo: '/students/st02.jpg', name: 'Student 02', company: "AD Graphic's 2.0", role: 'Video Editing Student' },
  { photo: '/students/st03.jpg', name: 'Student 03', company: "AD Graphic's 2.0", role: 'Design + Video Student' },
  { type: 'quote', quote: 'The studio feels like a workplace, not a classroom.', name: 'Batch 01 student' },
  { photo: '/students/st04.jpg', name: 'Student 04', company: "AD Graphic's 2.0", role: 'Motion Graphics Student' },
  { photo: '/students/st05.jpg', name: 'Student 05', company: "AD Graphic's 2.0", role: 'Graphic Design Student' },
  { photo: '/students/st10.jpg', name: 'Student 10', company: "AD Graphic's 2.0", role: 'Design + Video Student' },
];

export const showcase = {
  heading: ['Inside the Studio Where We Build', 'the Next Top Creators'],
  video: '/studio.mp4', // replace with your own studio video (mp4)
  poster: '/video-poster.jpg',
};

// ------------------------------------------------------------------
//  Editable from Admin → Website content
//  Text fields may use {batch} {seats} {months} {city} {name} placeholders.
// ------------------------------------------------------------------

// How the sign-up buttons and form behave.
//  'pre-register' → "Pre-Register for Batch 01"
//  'register'     → "Register for Batch 01"
//  'closed'       → "Join the Waitlist" (form still works, saved as waitlist)
export const admissions = {
  mode: 'pre-register',
  customCta: '', // optional: overrides every button label when filled
  successMessage: 'Our team will call or WhatsApp you within 48 hours with the next steps.',
  showAnnouncement: true,
  announcement: '{batch} admissions are open — only {seats} seats',
};

export const hero = {
  line1: 'Learn Design & Editing',
  line2Before: 'Inside a',
  highlight: 'Real Studio',
  image: '/hero.jpg',
  badges: ['Limited: Only {seats} Seats', 'Offline: {months} Months in {city}', 'Placement Support'],
  secondaryCta: 'View Student Results',
  note: '{batch} {modeNoun} now open · Graphic Design + Video Editing',
};

export const sections = {
  testimonials: { pill: 'Real Students · Real Results', title: 'What Our', highlight: '{batch}', after: 'Students Say' },
  pillars: { title: 'Not Just Another', highlight: '‘Course’', sub: 'Built for people who want careers, not certificates.' },
  advantages: { eyebrow: 'The {name} advantage', title: 'Learn where the', highlight: 'real work', after: 'happens.', sub: 'You will not be practising on stock clips in a classroom. You will be inside a live creative studio, working on briefs that actually go out to clients.' },
  curriculum: { title: 'Your Road to', highlight: 'Creative Mastery', sub: 'Seven focused phases that take you from your first design to your first paycheque.' },
  toolkit: { eyebrow: 'Tools & skills', title: 'Master the', highlight: 'industry toolkit.', sub: 'The software studios use, plus the soft skills that get you rehired.' },
  partners: { eyebrow: 'Hiring network', title: 'Get in front of', highlight: 'the people hiring.' },
  compare: { title: 'Compare Your', highlight: 'Options', sub: 'See why students choose a studio over a screen or a classroom.' },
  fit: { eyebrow: 'Is this for you?', title: 'Be honest with', highlight: 'yourself.' },
  fees: { title: 'Fees &', highlight: 'Admission', sub: 'Only {seats} seats in {batch} — secure yours before they’re gone.' },
  faq: { eyebrow: 'FAQs', title: 'Questions?', highlight: 'Answered.', sub: 'Still unsure? Message us on WhatsApp and talk to a real person from the team.' },
  footer: { ctaTitle: 'Seats Are Filling Fast', ctaText: 'Start your creative career today.' },
};

/* ------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */
const MODE_TEXT = {
  'pre-register': { verb: 'Pre-Register', noun: 'pre-registrations', done: 'You are pre-registered! 🎉', submit: 'Pre-Register Now' },
  register: { verb: 'Register', noun: 'registrations', done: 'Registration received! 🎉', submit: 'Register Now' },
  closed: { verb: 'Join the Waitlist', noun: 'waitlist sign-ups', done: 'You are on the waitlist! 🎉', submit: 'Join Waitlist' },
};

/** Labels for every sign-up button and the form, based on admissions.mode. */
export function labels() {
  const m = MODE_TEXT[admissions.mode] || MODE_TEXT['pre-register'];
  const base = admissions.mode === 'closed' ? m.verb : `${m.verb} for ${brand.batch}`;
  const cta = admissions.customCta?.trim() || base;
  return { cta, short: admissions.customCta?.trim() || m.verb, title: cta, submit: m.submit, done: m.done, noun: m.noun, mode: admissions.mode };
}

/** Fill {batch} {seats} {months} {city} {name} {modeNoun} placeholders. */
export function fill(text) {
  return String(text ?? '').replace(/\{(\w+)\}/g, (all, key) => ({
    batch: brand.batch, seats: brand.seats, months: brand.durationMonths, city: brand.city,
    name: brand.short, modeNoun: labels().noun,
  })[key] ?? all);
}

/* ------------------------------------------------------------------
   Content overrides from the server (Admin → Website content)
   ------------------------------------------------------------------ */
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

function mergeInto(target, src) {
  for (const [k, v] of Object.entries(src)) {
    if (Array.isArray(v)) target[k] = structuredClone(v);
    else if (isObj(v) && isObj(target[k])) mergeInto(target[k], v);
    else target[k] = v;
  }
}

// Every editable export, by the key used in the admin and the API.
export const EDITABLE = {
  brand, admissions, hero, sections, stats, proof, studentStories, pillars, advantages,
  curriculum, sessionFormat, skills, partners, comparison, fit, fees, faqs, showcase,
};

// Untouched copy of the defaults (used by the admin "reset" and the editor).
export const DEFAULTS = structuredClone(EDITABLE);

/** Apply saved overrides in place so every component sees them. */
export function applyContent(overrides = {}) {
  for (const [key, value] of Object.entries(overrides || {})) {
    const target = EDITABLE[key];
    if (target === undefined || value == null) continue;
    if (Array.isArray(target)) {
      if (Array.isArray(value)) target.splice(0, target.length, ...structuredClone(value));
    } else if (isObj(value)) {
      mergeInto(target, value);
    }
  }
  // keep derived contact fields in sync
  const digits = String(brand.phone || '').replace(/\D/g, '');
  if (digits) {
    brand.phoneHref = `tel:+${digits.length === 10 ? '91' + digits : digits}`;
    if (!overrides?.brand?.whatsapp) brand.whatsapp = `https://wa.me/${digits.length === 10 ? '91' + digits : digits}`;
  }
  if (brand.address && !overrides?.brand?.mapsUrl) {
    brand.mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(brand.address);
  }
}
