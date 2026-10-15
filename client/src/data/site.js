// ------------------------------------------------------------------
//  All website content lives here. Edit this file to change the
//  brand name, contact details, numbers, curriculum, fees and FAQs.
//  Values marked "placeholder" should be replaced with your real data.
// ------------------------------------------------------------------

export const brand = {
  name: "AD Graphic's 2.0",
  short: "AD Graphic's",
  version: '2.0',
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
  { phase: '01', weeks: 'Weeks 1–3', title: 'Design Foundations', points: ['Colour, typography & layout', 'Photoshop essentials', 'Composition & visual hierarchy'] },
  { phase: '02', weeks: 'Weeks 4–6', title: 'Branding & Illustration', points: ['Logo & identity design in Illustrator', 'Brand guidelines', 'Posters, packaging & print'] },
  { phase: '03', weeks: 'Weeks 7–9', title: 'Social Media Creatives', points: ['Ad creatives & carousels', 'Thumbnails that get clicks', 'Designing for every platform'] },
  { phase: '04', weeks: 'Weeks 10–12', title: 'Video Editing', points: ['Premiere Pro workflow', 'Storytelling, pacing & hooks', 'Reels, shorts & long-form'] },
  { phase: '05', weeks: 'Weeks 13–15', title: 'Motion Graphics', points: ['After Effects animation', 'Kinetic typography', 'Logo animations & templates'] },
  { phase: '06', weeks: 'Weeks 16–18', title: 'Colour, Sound & Business', points: ['Colour grading in DaVinci Resolve', 'Sound design & mixing', 'Pricing, proposals & clients'] },
  { phase: '07', weeks: 'Weeks 19–21', title: 'Portfolio & Placements', points: ['Portfolio & showreel', 'Mock interviews & reviews', 'Placement drives & referrals'] },
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
//  Photos live in client/public/students/ (free stock placeholders —
//  replace with real photos of your students).
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
  { type: 'quote', quote: 'I used to freelance without any real process. The mentors here gave me structure, taste and the confidence to pitch bigger clients.', name: 'Aarav Mehta' },
  { photo: '/students/s1.jpg', name: 'Aarav Mehta', company: 'Northwind Media', role: 'Video Editor' },
  { photo: '/students/s2.jpg', name: 'Simran Kaur', company: 'Pixel & Co.', role: 'Graphic Designer' },
  { photo: '/students/s3.jpg', name: 'Rohan Verma', company: 'Freelance', role: 'Motion Designer' },
  { type: 'quote', quote: 'Designing in the morning and editing in the afternoon — on real briefs — is the fastest I have ever learned anything.', name: 'Ishita Sharma' },
  { photo: '/students/s4.jpg', name: 'Ishita Sharma', company: 'Hello Social', role: 'Social Media Designer' },
  { photo: '/students/s5.jpg', name: 'Kabir Singh', company: 'Studio Nine', role: 'Content Lead' },
  { photo: '/students/s6.jpg', name: 'Neha Gupta', company: 'Kite Creative', role: 'Brand Designer' },
];

export const showcase = {
  heading: ['Inside the Studio Where We Build', 'the Next Top Creators'],
  video: '/studio.mp4', // replace with your own studio video (mp4)
  poster: '/video-poster.jpg',
};
