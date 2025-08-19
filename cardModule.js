import { saveCards, loadCards, persist } from './storage.js';
import { toast } from './toast.js';
import { confetti } from './confetti.js';

let nextId = Date.now();

export function newCard(data){
  const id = data.id ?? (nextId++);
  const card = document.createElement('article');
  card.className = 'card';
  card.draggable = true;
  card.dataset.id = id;

  const badge = document.createElement('span');
  badge.className = `badge ${data.accent ?? 'violet'}`;
  badge.textContent = data.badge ?? 'Card';

  const title = document.createElement('div');
  title.className = 'title';
  title.innerHTML = data.title ?? 'Untitled';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = data.meta ?? new Date().toLocaleString();

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn small danger';
  removeBtn.textContent = 'Delete';
  removeBtn.addEventListener('click', ()=>{
    const id = Number(card.dataset.id);
    card.remove();
    persist('cards', getAllCards());
    toast('Card removed');
  });

  const cloneBtn = document.createElement('button');
  cloneBtn.className = 'btn small';
  cloneBtn.textContent = 'Duplicate';
  cloneBtn.addEventListener('click', ()=>{
    const copy = { ...data, id: undefined, meta: 'Duplicated ' + new Date().toLocaleTimeString() };
    const el = newCard(copy);
    card.parentElement?.insertBefore(el, card.nextSibling);
    persist('cards', getAllCards());
    confetti();
    toast('Card duplicated');
  });

  actions.append(removeBtn, cloneBtn);
  card.append(badge, title, meta, actions);

  // 3D tilt on hover
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -12;
    const ry = ((x / r.width) - 0.5) * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');

  // drag & drop
  card.addEventListener('dragstart', ()=>{
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', ()=>{
    card.classList.remove('dragging');
    persist('cards', getAllCards());
  });

  return card;
}

export function renderCards(container, items){
  container.innerHTML = '';
  items.forEach(item => container.appendChild(newCard(item)));
}

export function getAllCards(){
  return [...document.querySelectorAll('.card')].map(c => ({
    id: Number(c.dataset.id),
    badge: c.querySelector('.badge')?.textContent || 'Card',
    title: c.querySelector('.title')?.innerHTML || 'Untitled',
    meta: c.querySelector('.meta')?.textContent || '',
    accent: [...c.querySelector('.badge')?.classList || []].find(x=>['violet','cyan','amber','rose'].includes(x)) || 'violet'
  }));
}
