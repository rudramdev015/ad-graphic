// Describes every editable part of the website for Admin → Website content.
// Field types: text, textarea, number, bool, select, image, video, list (strings),
//              object (nested fields), objects (list of objects).

const t = (k, label, extra = {}) => ({ k, label, type: 'text', ...extra });
const ta = (k, label, extra = {}) => ({ k, label, type: 'textarea', ...extra });
const num = (k, label, extra = {}) => ({ k, label, type: 'number', ...extra });
const img = (k, label, extra = {}) => ({ k, label, type: 'image', ...extra });
const vid = (k, label, extra = {}) => ({ k, label, type: 'video', ...extra });
const list = (k, label, extra = {}) => ({ k, label, type: 'list', ...extra });
const objs = (k, label, fields, extra = {}) => ({ k, label, type: 'objects', fields, ...extra });
const obj = (k, label, fields, extra = {}) => ({ k, label, type: 'object', fields, ...extra });

const head = (extra = []) => [t('eyebrow', 'Small label above'), t('title', 'Title'), t('highlight', 'Highlighted words'), t('after', 'Words after highlight'), ta('sub', 'Sub-text'), ...extra];

export const PLACEHOLDER_HINT = 'You can use {batch} {seats} {months} {city} {name} — they update automatically.';

export const TABS = [
  {
    id: 'admissions', label: 'Admissions', icon: 'Megaphone',
    blocks: [{
      key: 'admissions', title: 'Admission mode & buttons',
      desc: 'Switch every sign-up button and the form between Pre-Register, Register and Waitlist.',
      fields: [
        { k: 'mode', label: 'Mode', type: 'mode' },
        t('customCta', 'Custom button text (optional)', { hint: 'Leave empty to use the automatic text for the mode.' }),
        ta('successMessage', 'Message after someone signs up'),
        { k: 'showAnnouncement', label: 'Show announcement bar', type: 'bool' },
        t('announcement', 'Announcement text', { hint: PLACEHOLDER_HINT }),
      ],
    }],
  },
  {
    id: 'brand', label: 'Brand & contact', icon: 'Building2',
    blocks: [{
      key: 'brand', title: 'Brand, batch & contact details',
      fields: [
        img('logo', 'Logo image', { hint: 'Square PNG/SVG works best.' }),
        t('name', 'Full name'), t('short', 'Short name'), t('tagline', 'Tagline'), ta('about', 'About (footer)'),
        t('batch', 'Current batch name', { hint: 'e.g. Batch 02 — used across the whole site.' }),
        num('seats', 'Seats in batch'), num('durationMonths', 'Program length (months)'),
        t('city', 'City'), t('phone', 'Phone / WhatsApp number'), t('email', 'Email (optional)'),
        t('instagram', 'Instagram link'), t('instagramHandle', 'Instagram handle'),
        ta('address', 'Full address'), t('addressShort', 'Short address (footer pill)'),
      ],
    }],
  },
  {
    id: 'hero', label: 'Hero (top)', icon: 'Image',
    blocks: [{
      key: 'hero', title: 'Top of the homepage',
      fields: [
        img('image', 'Background photo', { hint: 'Wide photo, at least 1600px wide.' }),
        t('line1', 'Headline line 1'), t('line2Before', 'Headline line 2 (before highlight)'), t('highlight', 'Highlighted words'),
        list('badges', 'Badges under the headline', { hint: PLACEHOLDER_HINT, max: 4 }),
        t('secondaryCta', 'Second button text'), t('note', 'Small note under buttons', { hint: PLACEHOLDER_HINT }),
      ],
    }],
  },
  {
    id: 'results', label: 'Results & students', icon: 'Trophy',
    blocks: [
      {
        key: 'proof', title: 'Results — headline & points',
        fields: [list('heading', 'Heading (line 1, line 2)', { max: 2 }), list('points', 'Result points'), ta('footnote', 'Footnote')],
      },
      {
        key: 'stats', title: 'Counting numbers', type: 'objects',
        fields: [num('value', 'Number'), t('prefix', 'Before number (e.g. ₹)'), t('suffix', 'After number (e.g. %)'), t('label', 'Label')],
        itemTitle: (s) => `${s.prefix || ''}${s.value ?? ''}${s.suffix || ''} — ${s.label || ''}`,
      },
      {
        key: 'studentStories', title: 'Student cards (scrolling columns)', type: 'objects',
        desc: 'Photo cards and quote cards. Set "Card type" to quote for a text-only card.',
        fields: [
          { k: 'type', label: 'Card type', type: 'select', options: [['', 'Photo card'], ['quote', 'Quote card']] },
          img('photo', 'Photo'), t('name', 'Name'), t('company', 'Company / academy'), t('role', 'Role'), ta('quote', 'Quote (quote cards only)'),
        ],
        itemTitle: (s) => `${s.type === 'quote' ? '❝ Quote' : '📷'} ${s.name || ''}`,
      },
    ],
  },
  {
    id: 'why', label: 'Why us', icon: 'Sparkles',
    blocks: [
      { key: 'pillars', title: 'Tilted cards', type: 'objects', fields: [t('title', 'Title'), ta('text', 'Text')], itemTitle: (s) => s.title },
      { key: 'advantages', title: 'Numbered advantages', type: 'objects', fields: [t('title', 'Title'), ta('text', 'Text')], itemTitle: (s) => s.title },
    ],
  },
  {
    id: 'curriculum', label: 'Curriculum', icon: 'Layers',
    blocks: [
      {
        key: 'curriculum', title: 'Phases (stacking cards)', type: 'objects',
        fields: [t('phase', 'Number (01, 02…)'), t('weeks', 'Weeks'), t('title', 'Title'), img('image', 'Photo'), list('points', 'Points')],
        itemTitle: (s) => `Phase ${s.phase || ''} — ${s.title || ''}`,
      },
      { key: 'sessionFormat', title: 'Typical day', type: 'objects', fields: [t('hours', 'Hours'), t('title', 'Title'), ta('text', 'Text')], itemTitle: (s) => `${s.hours} · ${s.title}` },
    ],
  },
  {
    id: 'video', label: 'Studio video', icon: 'Film',
    blocks: [{ key: 'showcase', title: 'Studio video section', fields: [list('heading', 'Heading (line 1, line 2)', { max: 2 }), vid('video', 'Video (MP4 or Instagram reel link)'), img('poster', 'Cover image')] }],
  },
  {
    id: 'fees', label: 'Fees', icon: 'IndianRupee',
    blocks: [{
      key: 'fees', title: 'Fees & admission cards',
      fields: [
        num('applicationFeeAmount', 'Application fee (₹, number)'), t('applicationFee', 'Application fee (text)'),
        num('programFeeAmount', 'Program fee (₹, number)'), t('programFee', 'Program fee (text)'),
        t('emiText', 'EMI text'), list('includes', 'What’s included'),
        obj('scholarship', 'Scholarship', [t('title', 'Title'), ta('text', 'Text')]),
      ],
    }],
  },
  {
    id: 'faqs', label: 'FAQs', icon: 'HelpCircle',
    blocks: [{ key: 'faqs', title: 'Questions & answers', type: 'objects', fields: [t('q', 'Question'), ta('a', 'Answer')], itemTitle: (s) => s.q }],
  },
  {
    id: 'compare', label: 'Compare & fit', icon: 'Columns3',
    blocks: [
      {
        key: 'comparison', title: 'Comparison table',
        fields: [
          list('columns', 'Options (online, institutes, you)', { max: 3 }),
          objs('rows', 'Rows', [t('label', 'Criteria'), list('values', 'Values (online, institutes, you)', { max: 3 })], { itemTitle: (s) => s.label }),
        ],
      },
      { key: 'fit', title: '“Is this for you?” lists', fields: [list('yes', 'Claim a seat if…'), list('no', 'Skip this if…')] },
    ],
  },
  {
    id: 'more', label: 'Skills & partners', icon: 'Wrench',
    blocks: [
      { key: 'skills', title: 'Skill chips', type: 'list' },
      { key: 'partners', title: 'Hiring partner names', type: 'list' },
    ],
  },
  {
    id: 'headings', label: 'Section headings', icon: 'Heading',
    blocks: [{
      key: 'sections', title: 'Headings for every section',
      desc: PLACEHOLDER_HINT,
      fields: [
        obj('testimonials', 'Video testimonials', [t('pill', 'Small pill'), t('title', 'Title'), t('highlight', 'Highlighted words'), t('after', 'Words after highlight')]),
        obj('pillars', 'Tilted cards', head()),
        obj('advantages', 'Advantages', head()),
        obj('curriculum', 'Curriculum', head()),
        obj('toolkit', 'Tools & skills', head()),
        obj('partners', 'Hiring network', head()),
        obj('compare', 'Compare', head()),
        obj('fit', 'Is this for you?', head()),
        obj('fees', 'Fees', head()),
        obj('faq', 'FAQs', head()),
        obj('footer', 'Footer banner', [t('ctaTitle', 'Banner title'), t('ctaText', 'Banner text')]),
      ],
    }],
  },
];

/** Empty value for a field type (used when adding list items). */
export function emptyFor(field) {
  switch (field.type) {
    case 'number': return 0;
    case 'bool': return false;
    case 'list': return [];
    case 'objects': return [];
    case 'object': return Object.fromEntries(field.fields.map((f) => [f.k, emptyFor(f)]));
    case 'select': return field.options?.[0]?.[0] ?? '';
    default: return '';
  }
}
