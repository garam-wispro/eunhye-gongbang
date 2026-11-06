export const OCCASIONS = [
  { k: '세례·입교', d: '새 생명의 시작을 축복하는 기념 선물', c: '#e9dcc6' },
  { k: '생일', d: '말씀 한 구절로 전하는 축복의 인사', c: '#f1d9cf' },
  { k: '새가족 환영', d: '교회에 처음 온 분을 따뜻하게 맞이하는 마음', c: '#dde6d8' },
  { k: '교회 행사', d: '수련회·체육대회·선교 여행 단체 기념품', c: '#d9e2ea' },
  { k: '성탄·부활절', d: '기쁜 소식을 나누는 절기 선물', c: '#ecd6d6' },
  { k: '감사 선물', d: '목회자·교사·봉사자에게 드리는 감사', c: '#ece3cf' },
]

export const PRODUCTS = [
  { id: 'mug', name: '말씀 머그컵', shape: 'mug', price: 12900, occ: ['생일', '감사 선물', '새가족 환영'], desc: '매일 아침 말씀과 함께. 11oz 세라믹, 식기세척기 사용 가능.', colors: ['#ffffff', '#f1e4d0', '#2b2622', '#8fa89a'] },
  { id: 'tumbler', name: '이름 각인 텀블러', shape: 'tumbler', price: 21900, occ: ['감사 선물', '생일', '교회 행사'], desc: '스테인리스 이중 진공 500ml. 교사·목회자 감사 선물로 인기.', colors: ['#f5f2ec', '#2b2622', '#5b7a8c', '#b9876a'] },
  { id: 'bag', name: '캔버스 에코백', shape: 'bag', price: 14900, occ: ['교회 행사', '새가족 환영', '성탄·부활절'], desc: '성경책이 쏙 들어가는 넉넉한 사이즈. 수련회 단체 기념품.', colors: ['#efe6d6', '#2b2622', '#7d8f6a'] },
  { id: 'tee', name: '수련회 단체 티셔츠', shape: 'tee', price: 16900, occ: ['교회 행사'], desc: '면 100% 라운드 티. 앞면 표어, 뒷면 교회 이름 인쇄.', colors: ['#ffffff', '#2b2622', '#3d5a80', '#c9a46b'] },
  { id: 'bible', name: '가죽 성경 커버', shape: 'bible', price: 32900, occ: ['세례·입교', '생일', '감사 선물'], desc: '인조 가죽 지퍼형 커버. 이름 금박 각인으로 오래 간직.', colors: ['#6b4430', '#2b2622', '#7a2e2e', '#3f5546'] },
  { id: 'frame', name: '말씀 캘리 액자', shape: 'frame', price: 24900, occ: ['세례·입교', '새가족 환영', '감사 선물'], desc: 'A4 원목 액자. 세례 날짜와 이름을 함께 새겨 드립니다.', colors: ['#c9a46b', '#2b2622', '#ffffff'] },
  { id: 'key', name: '십자가 아크릴 키링', shape: 'key', price: 5900, occ: ['교회 행사', '새가족 환영', '성탄·부활절'], desc: '가볍게 나누기 좋은 소량 선물. 주일학교 달란트 상품.', colors: ['#f8f4ee', '#e9d7b5', '#cfe0e8'] },
  { id: 'candle', name: '성탄 캔들 홀더', shape: 'candle', price: 18900, occ: ['성탄·부활절', '감사 선물'], desc: '유리 캔들 홀더와 소이 캔들. 대림절 선물 세트.', colors: ['#f6efe3', '#b23a3a', '#2e5e4e'] },
]

export const VERSES = [
  { t: '여호와는 나의 목자시니 내게 부족함이 없으리로다', r: '시편 23:1' },
  { t: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라', r: '빌립보서 4:13' },
  { t: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라', r: '데살로니가전서 5:16-18' },
  { t: '너는 마음을 다하여 여호와를 신뢰하고', r: '잠언 3:5' },
  { t: '사랑은 오래 참고 사랑은 온유하며', r: '고린도전서 13:4' },
  { t: '두려워하지 말라 내가 너와 함께 함이라', r: '이사야 41:10' },
  { t: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다', r: '시편 119:105' },
  { t: '오늘 다윗의 동네에 너희를 위하여 구주가 나셨으니', r: '누가복음 2:11' },
  { t: '', r: '', custom: true },
]

export const FONTS = [
  { k: '명조', css: "'Nanum Myeongjo', serif" },
  { k: '고딕', css: "'Noto Sans KR', sans-serif" },
  { k: '손글씨', css: "'Nanum Pen Script', cursive" },
]

export const won = n => n.toLocaleString('ko-KR') + '원'
export const discRate = q => (q >= 100 ? 0.15 : q >= 30 ? 0.1 : q >= 10 ? 0.05 : 0)
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const isDark = hex => {
  const n = parseInt(hex.slice(1), 16)
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 120
}

function wrap(text, max) {
  const lines = []
  let cur = ''
  for (const w of text.split(' ')) {
    if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w }
    else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 4)
}

const SHAPES = {
  mug: c => ({ px: 195, py: 200, max: 11, fs: 15, body: `<path d="M290 160 h30 a40 40 0 0 1 0 80 h-30" fill="none" stroke="#cbbfb0" stroke-width="14"/><path d="M290 160 h30 a40 40 0 0 1 0 80 h-30" fill="none" stroke="${c}" stroke-width="8"/><rect x="90" y="110" width="210" height="200" rx="16" fill="${c}" stroke="#cbbfb0" stroke-width="2"/><ellipse cx="195" cy="112" rx="105" ry="12" fill="${c}" stroke="#cbbfb0" stroke-width="2"/>` }),
  tumbler: c => ({ px: 200, py: 210, max: 7, fs: 13, body: `<rect x="140" y="60" width="120" height="30" rx="8" fill="#a39686"/><path d="M135 90 h130 l-12 250 a14 14 0 0 1 -14 12 h-78 a14 14 0 0 1 -14 -12 z" fill="${c}" stroke="#cbbfb0" stroke-width="2"/>` }),
  bag: c => ({ px: 200, py: 225, max: 11, fs: 15, body: `<path d="M150 120 v-40 a50 50 0 0 1 100 0 v40" fill="none" stroke="#cbbfb0" stroke-width="12"/><rect x="100" y="115" width="200" height="230" rx="6" fill="${c}" stroke="#cbbfb0" stroke-width="2"/>` }),
  tee: c => ({ px: 200, py: 190, max: 9, fs: 14, body: `<path d="M150 70 l-70 35 l25 60 l30 -12 v190 h130 v-190 l30 12 l25 -60 l-70 -35 a50 30 0 0 1 -100 0z" fill="${c}" stroke="#cbbfb0" stroke-width="2"/>` }),
  bible: c => ({ px: 205, py: 230, max: 10, fs: 14, body: `<rect x="110" y="70" width="190" height="260" rx="12" fill="${c}" stroke="#cbbfb0" stroke-width="2"/><rect x="292" y="80" width="14" height="240" rx="4" fill="#b8a48a"/><path d="M205 110 v50 M188 126 h34" stroke="#d8b46a" stroke-width="5" stroke-linecap="round"/>` }),
  frame: c => ({ px: 200, py: 205, max: 12, fs: 15, fixedInk: '#3a2e26', body: `<rect x="80" y="70" width="240" height="270" fill="${c}" stroke="#cbbfb0" stroke-width="2"/><rect x="100" y="90" width="200" height="230" fill="#fffdf8"/>` }),
  key: c => ({ px: 200, py: 180, max: 4, fs: 12, body: `<circle cx="200" cy="70" r="16" fill="none" stroke="#a39686" stroke-width="5"/><path d="M175 95 h50 v50 h50 v60 h-50 v130 h-50 v-130 h-50 v-60 h50z" fill="${c}" stroke="#cbbfb0" stroke-width="2"/>` }),
  candle: c => ({ px: 200, py: 235, max: 10, fs: 14, body: `<path class="flame" d="M200 70 q-14 22 0 40 q14 -18 0 -40z" fill="#e8a33c"/><rect x="186" y="108" width="28" height="30" fill="#fff8ea"/><path d="M110 140 h180 l-14 200 h-152z" fill="${c}" stroke="#cbbfb0" stroke-width="2" opacity=".9"/>` }),
}

/** 상품 SVG에 받는 분 이름과 말씀을 얹어 그린다 */
export function productSVG(p, o = {}) {
  const color = o.color || p.colors[0]
  const s = SHAPES[p.shape](color)
  const ink = s.fixedInk || (isDark(color) ? '#f5efe6' : '#3a2e26')
  const font = (o.font || FONTS[0].css).replace(/"/g, "'")
  const verse = o.verse || VERSES[0]
  const name = o.name ?? ''
  const lines = wrap(verse.t || '', s.max)
  const lh = s.fs * 1.45
  const total = (name ? 1.4 : 0) + lines.length + (verse.r ? 1 : 0)
  let y = s.py - (total * lh) / 2 + lh * 0.7
  let txt = ''
  if (name) { txt += `<text x="${s.px}" y="${y}" font-size="${s.fs * 1.25}" font-weight="700">${esc(name)}</text>`; y += lh * 1.4 }
  for (const l of lines) { txt += `<text x="${s.px}" y="${y}" font-size="${s.fs}">${esc(l)}</text>`; y += lh }
  if (verse.r) txt += `<text x="${s.px}" y="${y}" font-size="${s.fs * 0.8}" opacity=".75">${esc(verse.r)}</text>`
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s.body}<g class="print" fill="${ink}" text-anchor="middle" font-family="${font}">${txt}</g></svg>`
}
