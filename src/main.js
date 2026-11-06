import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { OCCASIONS, PRODUCTS, VERSES, FONTS, won, discRate, esc, productSVG } from './products.js'

gsap.registerPlugin(ScrollTrigger, Flip, SplitText)
const $ = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

/* ───── 부드러운 스크롤 (Lenis + ScrollTrigger 동기화) ───── */
let lenis = null
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
const scrollTo = target => (lenis ? lenis.scrollTo(target, { offset: -70, duration: 1.4 }) : document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }))
const lock = on => { on ? lenis?.stop() : lenis?.start(); document.body.classList.toggle('locked', on) }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollTo(a.getAttribute('href')) }))
$('#modal').setAttribute('data-lenis-prevent', '')
$('#cartItems').setAttribute('data-lenis-prevent', '')

/* ───── 마크업 채우기 ───── */
const heroProduct = PRODUCTS[0]
$('#heroProduct').innerHTML = productSVG(heroProduct, { name: '사랑하는 은혜에게', color: '#f1e4d0' })
$('#marquee').innerHTML = Array(2).fill(VERSES.filter(v => !v.custom).map(v => `<span>${v.t} · ${v.r}</span>`).join('')).join('')
$('#occTrack').innerHTML = OCCASIONS.map((o, i) => {
  const p = PRODUCTS.find(p => p.occ.includes(o.k))
  return `<button class="occ-card" data-occ="${o.k}" style="background:${o.c}">
    <span class="num">0${i + 1}</span>
    <div class="art">${productSVG(p, { name: '' })}</div>
    <div><h3>${o.k}</h3><p>${o.d}</p><span class="go">어울리는 선물 보기 <i>→</i></span></div>
  </button>`
}).join('')

const CHIP_LIST = ['전체', ...OCCASIONS.map(o => o.k)]
$('#chips').innerHTML = CHIP_LIST.map((k, i) => `<button class="chip ${i ? '' : 'on'}" data-o="${k}">${i ? '' : '<span class="chip-bg"></span>'}${k}</button>`).join('')
$('#grid').innerHTML = PRODUCTS.map(p => `
  <article class="card" data-id="${p.id}" data-occ="${p.occ.join('|')}">
    <div class="thumb">${productSVG(p, { name: '은혜에게' })}</div>
    <div class="body">
      <div class="tags">${p.occ.join(' · ')}</div>
      <h3>${p.name}</h3><p>${p.desc}</p>
      <div class="row"><span class="price">${won(p.price)}</span><button class="btn btn-primary open-editor" data-id="${p.id}"><span>맞춤 제작</span></button></div>
    </div>
  </article>`).join('')

/* ───── 인트로 ───── */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  const path = $('.loader-cross path')
  const len = path.getTotalLength()
  const title = SplitText.create('#heroTitle', { type: 'words,chars', charsClass: 'char' })
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
  tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
    .to('.loader-name', { opacity: 1, letterSpacing: '.5em', duration: 0.8 }, '-=.4')
    .to('#loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=.15')
    .from(title.chars, { yPercent: 110, rotate: 8, opacity: 0, duration: 1.1, stagger: 0.025 }, '-=.45')
    .from('.reveal-up', { y: 28, opacity: 0, duration: 1, stagger: 0.1 }, '-=.9')
    .from('.hero-art', { clipPath: 'inset(12% 12% 12% 12% round 32px)', scale: 0.92, duration: 1.4 }, '-=1.2')
    .from('#heroProduct', { y: 80, rotate: -6, opacity: 0, duration: 1.4 }, '<.1')
    .from('.site-header', { yPercent: -100, duration: 0.9 }, '<')
    .set('#loader', { display: 'none' })
  return tl
}

/* ───── 히어로: 떠다니는 상품, 마우스 패럴랙스, 이름 타이핑 ───── */
function hero() {
  gsap.to('#heroProduct', { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  gsap.to('.halo', { scale: 1.12, opacity: 0.8, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  gsap.to('#heroProduct', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.hero-copy', { yPercent: -12, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

  if (finePointer) {
    const art = $('#heroArt')
    gsap.set('#heroProduct', { transformPerspective: 900 })
    const rx = gsap.quickTo('#heroProduct', 'rotationX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo('#heroProduct', 'rotationY', { duration: 0.8, ease: 'power3' })
    const hx = gsap.quickTo('.halo', 'x', { duration: 1.2, ease: 'power3' })
    const hy = gsap.quickTo('.halo', 'y', { duration: 1.2, ease: 'power3' })
    art.addEventListener('pointermove', e => {
      const r = art.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5
      ry(px * 18); rx(-py * 14); hx(px * 60); hy(py * 60)
    })
    art.addEventListener('pointerleave', () => { rx(0); ry(0); hx(0); hy(0) })
  }

  // 받는 사람 이름이 바뀌며 머그컵 인쇄도 함께 바뀜
  const names = ['사랑하는 은혜에게', '김믿음 집사님께', '주일학교 친구들에게', '존경하는 목사님께']
  const typeEl = $('#heroType')
  const draw = text => { typeEl.textContent = text; $('#heroProduct').innerHTML = productSVG(heroProduct, { name: text, color: '#f1e4d0' }) }
  const tl = gsap.timeline({ repeat: -1, delay: 2.8 })
  names.forEach(n => {
    const o = { i: n.length }
    tl.to(o, { i: n.length, duration: 2.2 })
      .to(o, { i: 0, duration: 0.5, ease: 'none', onUpdate: () => draw(n.slice(0, Math.round(o.i))) })
    const next = names[(names.indexOf(n) + 1) % names.length]
    const p = { i: 0 }
    tl.to(p, { i: next.length, duration: next.length * 0.08, ease: 'none', onUpdate: () => draw(next.slice(0, Math.round(p.i))) })
  })
}

/* ───── 빛 먼지 파티클 ───── */
function lightDust() {
  const cv = $('#lightDust'), ctx = cv.getContext('2d')
  let w, h, dots
  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2)
    w = cv.clientWidth; h = cv.clientHeight
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    dots = Array.from({ length: 46 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.2 + 0.6, s: Math.random() * 0.35 + 0.1, o: Math.random() * Math.PI * 2 }))
  }
  resize(); addEventListener('resize', resize)
  let running = true
  ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: s => (running = s.isActive) })
  gsap.ticker.add(time => {
    if (!running) return
    ctx.clearRect(0, 0, w, h)
    for (const d of dots) {
      d.y -= d.s; d.x += Math.sin(time + d.o) * 0.15
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w }
      const a = 0.35 + Math.sin(time * 1.5 + d.o) * 0.3
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(214,170,96,${a})`; ctx.fill()
    }
  })
}

/* ───── 스크롤 연출 ───── */
function scrollScenes() {
  // 헤더: 내려가면 숨고 올라가면 나타남
  const header = $('#header')
  ScrollTrigger.create({
    start: 40, end: 'max',
    onUpdate: s => { header.classList.toggle('scrolled', s.scroll() > 40); gsap.to(header, { yPercent: s.direction === 1 && s.scroll() > 400 ? -100 : 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }) },
  })

  // 섹션 제목: 줄 단위 마스크 리빌
  $$('.sec-title').forEach(el => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines' })
    gsap.from(split.lines, { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%' } })
  })
  gsap.from('.step', { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.steps', start: 'top 80%' } })

  // 말씀 띠: 스크롤 속도·방향에 반응
  const marquee = gsap.to('#marquee', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: s => {
      const v = gsap.utils.clamp(-6, 6, s.getVelocity() / 300)
      gsap.timeline().to(marquee, { timeScale: (s.direction || 1) * (1 + Math.abs(v)), duration: 0.2 }).to(marquee, { timeScale: s.direction || 1, duration: 1.2, ease: 'power2.out' })
    },
  })

  // 상황별 선물: 데스크톱은 가로 스크롤 고정
  const mm = gsap.matchMedia()
  mm.add('(min-width: 721px)', () => {
    const track = $('#occTrack')
    const dist = () => track.scrollWidth - innerWidth
    const h = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.occ-pin', pin: true, scrub: 1, end: () => '+=' + dist(), invalidateOnRefresh: true } })
    $$('.occ-card').forEach(card => {
      gsap.from(card.querySelector('.art'), { rotate: 14, scale: 0.8, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: h, start: 'left right', end: 'center center', scrub: true } })
    })
  })
  mm.add('(max-width: 720px)', () => {
    gsap.from('.occ-card', { y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#occTrack', start: 'top 85%' } })
  })

  // 상품 카드 순차 등장
  gsap.set('.card', { y: 60, opacity: 0 })
  ScrollTrigger.batch('.card', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08 }) })

  // 할인율 카운트업 + 배너 확장
  gsap.from('.banner', { clipPath: 'inset(8% 6% 8% 6% round 32px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.banner', start: 'top 85%' } })
  $$('[data-count]').forEach(el => {
    gsap.to(el, { textContent: +el.dataset.count, duration: 1.6, ease: 'power2.out', snap: { textContent: 1 }, scrollTrigger: { trigger: '.banner', start: 'top 75%' } })
  })
}

/* ───── 마이크로 인터랙션: 카드 기울기, 자석 버튼 ───── */
function micro() {
  if (!finePointer) return
  $$('.card').forEach(card => {
    gsap.set(card, { transformPerspective: 900 })
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' })
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
    })
    card.addEventListener('pointerleave', () => { rx(0); ry(0) })
  })
  $$('.magnetic').forEach(el => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.3) })
    el.addEventListener('pointerleave', () => { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)' }) })
  })
}

/* ───── 필터 (Flip으로 자연스럽게 재배치) ───── */
let currentOcc = '전체'
function filter(occ) {
  if (occ === currentOcc) return
  currentOcc = occ
  const bg = $('.chip-bg')
  const chipState = Flip.getState(bg)
  $$('.chip').forEach(c => c.classList.toggle('on', c.dataset.o === occ))
  $(`.chip[data-o="${occ}"]`).prepend(bg)
  Flip.from(chipState, { duration: 0.6, ease: 'power3.inOut' })

  const cards = $$('.card')
  const state = Flip.getState(cards, { props: 'opacity' })
  cards.forEach(c => { c.style.display = occ === '전체' || c.dataset.occ.split('|').includes(occ) ? '' : 'none' })
  gsap.set(cards, { opacity: 1, y: 0 })
  Flip.from(state, {
    duration: 0.7, ease: 'power3.inOut', stagger: 0.03, absolute: true, scale: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.2 }),
    onLeave: els => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
    onComplete: () => ScrollTrigger.refresh(),
  })
}
$('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) filter(b.dataset.o) })
$('#occTrack').addEventListener('click', e => { const c = e.target.closest('.occ-card'); if (!c) return; scrollTo('#products'); setTimeout(() => filter(c.dataset.occ), 700) })

/* ───── 맞춤 편집기 ───── */
let cur = null, st = {}
const priceObj = { v: 0 }
$('#fVerse').innerHTML = VERSES.map((v, i) => `<option value="${i}">${v.custom ? '✎ 직접 입력하기' : v.r + ' — ' + v.t.slice(0, 14) + '…'}</option>`).join('')
const verseOf = s => (VERSES[s.verse].custom ? { t: s.custom, r: s.ref } : VERSES[s.verse])

function renderStage(pulse) {
  $('#stage').innerHTML = productSVG(cur, { name: st.name, verse: verseOf(st), font: FONTS[st.font].css, color: cur.colors[st.color] })
  if (pulse) gsap.from('#stage .print', { opacity: 0, y: 6, duration: 0.5, ease: 'power2.out' })
}
function updateEditor(pulse = false) {
  renderStage(pulse)
  $$('#fFont button').forEach((b, i) => b.classList.toggle('on', i === st.font))
  $$('#fColor .sw').forEach((b, i) => b.classList.toggle('on', i === st.color))
  const d = discRate(st.qty), sum = Math.round(cur.price * st.qty * (1 - d))
  $('#mUnit').textContent = `${won(cur.price)} × ${st.qty}개`
  $('#mDisc').textContent = d ? `단체 할인 ${d * 100}% 적용` : st.qty < 10 ? '10개 이상 주문 시 5% 할인' : ''
  gsap.to(priceObj, { v: sum, duration: 0.5, ease: 'power2.out', onUpdate: () => ($('#mTotal').textContent = won(Math.round(priceObj.v))) })
}
function openEditor(id, fromEl) {
  cur = PRODUCTS.find(p => p.id === id)
  st = { name: '', verse: 0, font: 0, color: 0, qty: 1, custom: '', ref: '' }
  $('#fName').value = ''; $('#fVerse').value = 0; $('#fCustom').value = ''; $('#fRef').value = ''; $('#fQty').value = 1; $('#customWrap').hidden = true
  $('#mTags').textContent = cur.occ.join(' · '); $('#mName').textContent = cur.name; $('#mDesc').textContent = cur.desc
  $('#fFont').innerHTML = FONTS.map((f, i) => `<button data-i="${i}" style="font-family:${f.css}">${f.k}</button>`).join('')
  $('#fColor').innerHTML = cur.colors.map((c, i) => `<button class="sw" data-i="${i}" style="background:${c}" aria-label="색상 ${i + 1}"></button>`).join('')
  priceObj.v = cur.price
  updateEditor()
  lock(true)
  const r = fromEl?.getBoundingClientRect()
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.to('#overlay', { autoAlpha: 1, duration: 0.4 })
    .fromTo('#modal', { autoAlpha: 0, scale: 0.92, y: 40, transformOrigin: r ? `${r.left + r.width / 2}px ${r.top}px` : '50% 50%' }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 }, '<')
    .from('#stage svg', { scale: 0.7, rotate: -8, opacity: 0, duration: 1 }, '<.1')
    .from('.form > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.035 }, '<.05')
}
function closeModal() {
  gsap.timeline({ defaults: { ease: 'power3.in' }, onComplete: () => lock(false) })
    .to('#modal', { autoAlpha: 0, scale: 0.96, y: 20, duration: 0.35 })
    .to('#overlay', { autoAlpha: 0, duration: 0.3 }, '<.05')
}
$('#grid').addEventListener('click', e => { const b = e.target.closest('.open-editor'); if (b) openEditor(b.dataset.id, b.closest('.card')) })
$('#fName').oninput = e => { st.name = e.target.value; updateEditor() }
$('#fVerse').onchange = e => {
  st.verse = +e.target.value
  const show = !!VERSES[st.verse].custom
  if (show && $('#customWrap').hidden) { $('#customWrap').hidden = false; gsap.from('#customWrap', { height: 0, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'height' }) }
  else if (!show) $('#customWrap').hidden = true
  updateEditor(true)
}
$('#fCustom').oninput = e => { st.custom = e.target.value; updateEditor() }
$('#fRef').oninput = e => { st.ref = e.target.value; updateEditor() }
$('#fFont').onclick = e => { const i = e.target.dataset.i; if (i != null) { st.font = +i; updateEditor(true) } }
$('#fColor').onclick = e => {
  const i = e.target.dataset.i; if (i == null) return
  st.color = +i; updateEditor()
  gsap.fromTo('#stage svg', { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .5)' })
}
const setQty = q => { st.qty = Math.max(1, Math.min(999, q || 1)); $('#fQty').value = st.qty; updateEditor() }
$('#qMinus').onclick = () => setQty(st.qty - 1)
$('#qPlus').onclick = () => setQty(st.qty + 1)
$('#fQty').oninput = e => setQty(+e.target.value)

/* ───── 장바구니 ───── */
let cart = []
try { cart = JSON.parse(localStorage.getItem('graceCart') || '[]') } catch {}
const save = () => { try { localStorage.setItem('graceCart', JSON.stringify(cart)) } catch {} }

function flyToCart() {
  const from = $('#stage svg').getBoundingClientRect(), to = $('#openCart').getBoundingClientRect()
  const fly = document.createElement('div')
  fly.className = 'fly'; fly.innerHTML = $('#stage').innerHTML
  document.body.appendChild(fly)
  const sx = from.left + from.width / 2 - 60, sy = from.top + from.height / 2 - 60
  const ex = to.left + to.width / 2 - 60, ey = to.top + to.height / 2 - 60
  gsap.set('#header', { yPercent: 0 })
  const tl = gsap.timeline({ onComplete: () => fly.remove() })
  tl.set(fly, { x: sx, y: sy, scale: 1.4 })
    .to(fly, { x: ex, duration: 0.9, ease: 'power1.inOut' })
    .to(fly, { y: ey, duration: 0.9, ease: 'back.in(1.6)' }, '<')
    .to(fly, { scale: 0.15, opacity: 0.6, duration: 0.9, ease: 'power2.in' }, '<')
    .fromTo('#openCart', { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' })
    .fromTo('#cartCount', { scale: 0.4 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .4)' }, '<')
}
$('#addCart').onclick = () => {
  if (VERSES[st.verse].custom && !st.custom.trim()) {
    toast('말씀 본문을 입력해 주세요')
    gsap.fromTo('#fCustom', { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, .3)' })
    return
  }
  cart.push({ id: cur.id, ...st, color: cur.colors[st.color] })
  save(); flyToCart(); closeModal()
  setTimeout(() => { renderCart(); toast('장바구니에 담았습니다') }, 900)
}
function renderCart() {
  $('#cartCount').textContent = cart.length
  if (!cart.length) { $('#cartItems').innerHTML = '<div class="empty">장바구니가 비어 있습니다</div>'; $('#cartTotal').textContent = '0원'; return }
  let total = 0
  $('#cartItems').innerHTML = cart.map((it, i) => {
    const p = PRODUCTS.find(x => x.id === it.id), v = verseOf(it)
    const sum = Math.round(p.price * it.qty * (1 - discRate(it.qty))); total += sum
    return `<div class="ci"><div class="mini">${productSVG(p, { name: it.name, verse: v, font: FONTS[it.font].css, color: it.color })}</div>
      <div><b>${p.name}</b><small>${esc(it.name || '이름 없음')} · ${esc(v.r || '말씀 없음')}</small><small>${FONTS[it.font].k} · ${it.qty}개</small></div>
      <div style="text-align:right">${won(sum)}<br><button class="rm" data-i="${i}">삭제</button></div></div>`
  }).join('')
  $('#cartTotal').textContent = won(total)
}
$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('.rm'); if (!b) return
  const row = b.closest('.ci')
  gsap.timeline({ onComplete: () => { cart.splice(+b.dataset.i, 1); save(); renderCart() } })
    .to(row, { x: 60, opacity: 0, duration: 0.35, ease: 'power2.in' })
    .to(row, { height: 0, paddingBlock: 0, duration: 0.3, ease: 'power2.inOut' })
})
function openCart() {
  lock(true)
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('#overlay', { autoAlpha: 1, duration: 0.4 })
    .to('#drawer', { xPercent: 0, autoAlpha: 1, duration: 0.8 }, '<')
    .from('.ci, .empty', { x: 40, opacity: 0, stagger: 0.06, duration: 0.6 }, '<.15')
}
function closeCart() {
  gsap.timeline({ onComplete: () => lock(false) })
    .to('#drawer', { xPercent: 100, duration: 0.5, ease: 'power3.in' })
    .set('#drawer', { autoAlpha: 0 })
    .to('#overlay', { autoAlpha: 0, duration: 0.3 }, '<.1')
}
$('#openCart').onclick = openCart
$('#closeCart').onclick = closeCart
$('#closeModal').onclick = closeModal
gsap.set('#drawer', { xPercent: 100 })
$('#overlay').onclick = () => (gsap.getProperty('#drawer', 'xPercent') < 50 ? closeCart() : closeModal())
addEventListener('keydown', e => { if (e.key === 'Escape') $('#overlay').onclick() })
$('#checkout').onclick = () => toast(cart.length ? '결제 기능은 다음 단계에서 연결됩니다' : '담긴 상품이 없습니다')

function toast(msg) {
  const t = $('#toast'); t.textContent = msg
  gsap.killTweensOf(t)
  gsap.timeline().fromTo(t, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }).to(t, { y: 24, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=1.6')
}

/* ───── 시작 ───── */
gsap.to('.flame', { scaleY: 1.12, scaleX: 0.92, transformOrigin: '50% 100%', duration: 0.25, yoyo: true, repeat: -1, ease: 'sine.inOut' })
renderCart()
document.fonts.ready.then(() => {
  if (reduce) { $('#loader').style.display = 'none'; return }
  intro(); hero(); lightDust(); scrollScenes(); micro()
  ScrollTrigger.refresh()
})
