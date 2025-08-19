import greet, { add, multiply } from './mathUtils.js';
import { newCard, renderCards, getAllCards } from './cardModule.js';
import { loadCards, persist } from './storage.js';
import { toast } from './toast.js';
import { confetti } from './confetti.js';

// Welcome
console.log(greet('Creator'));
const container = document.getElementById('cardContainer');
const search = document.getElementById('search');
const themeToggle = document.getElementById('themeToggle');
const newCardBtn = document.getElementById('newCard');
const addProfileBtn = document.getElementById('addProfile');
const shuffleBtn = document.getElementById('shuffle');
const clearAllBtn = document.getElementById('clearAll');

// Load from localStorage
const initial = loadCards();
if(initial && initial.length){
  renderCards(container, initial);
}else{
  // starter cards
  const starter = [
    { badge:'Lost', title:'Black Umbrella ☔', meta:'Near Library • Today', accent:'cyan' },
    { badge:'Found', title:'Water Bottle 💧', meta:'C-Block 2F • 10:30 AM', accent:'violet' },
    { badge:'Tip', title:'Label your notebooks 📝', meta:'Safety & Privacy', accent:'amber' },
  ];
  renderCards(container, starter);
  persist('cards', starter);
}

// Grid drag sort
container.addEventListener('dragover', (e)=>{
  e.preventDefault();
  const dragging = document.querySelector('.card.dragging');
  const after = [...container.querySelectorAll('.card:not(.dragging)')]
    .find(el => e.clientY <= el.getBoundingClientRect().top + el.offsetHeight/2);
  if(!dragging) return;
  if(after) container.insertBefore(dragging, after);
  else container.appendChild(dragging);
});

// Search filter
search.addEventListener('input', ()=>{
  const q = search.value.toLowerCase();
  [...container.children].forEach(card => {
    const txt = card.textContent.toLowerCase();
    card.style.display = txt.includes(q) ? '' : 'none';
  });
});

// Theme toggle
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('theme-light');
  toast('Theme toggled');
});

// Create generic card
newCardBtn.addEventListener('click', ()=>{
  const data = {
    badge:'Note',
    title:`New Card #${Math.floor(Math.random()*1000)}`,
    meta: new Date().toLocaleTimeString(),
    accent: ['violet','cyan','amber','rose'][Math.floor(Math.random()*4)]
  };
  const el = newCard(data);
  container.prepend(el);
  persist('cards', getAllCards());
  confetti();
  toast('Card created');
});

// Modal for profile
const modal = document.getElementById('modal');
const cancelModal = document.getElementById('cancelModal');
const profileForm = document.getElementById('profileForm');
const pName = document.getElementById('pName');
const pRole = document.getElementById('pRole');
const pAccent = document.getElementById('pAccent');
const pEmoji = document.getElementById('pEmoji');

addProfileBtn.addEventListener('click', ()=>{
  modal.classList.remove('hidden'); pName.focus();
});
cancelModal.addEventListener('click', ()=> modal.classList.add('hidden'));
profileForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!pName.value.trim() || !pRole.value.trim()) return;
  const data = {
    badge:'Profile',
    title:`${pEmoji.value || '👤'} <strong>${pName.value}</strong><br>${pRole.value}`,
    meta: 'Created ' + new Date().toLocaleTimeString(),
    accent: pAccent.value || 'violet',
  };
  const el = newCard(data);
  container.prepend(el);
  modal.classList.add('hidden');
  profileForm.reset();
  persist('cards', getAllCards());
  confetti();
  toast('Profile added');
});

// Shuffle
shuffleBtn.addEventListener('click', ()=>{
  const arr = getAllCards();
  for(let i=arr.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  renderCards(container, arr);
  persist('cards', arr);
  toast('Shuffled');
});

// Clear all
clearAllBtn.addEventListener('click', ()=>{
  container.innerHTML = ''; persist('cards', []); toast('Cleared');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.key === 'N' || e.key === 'n'){ newCardBtn.click(); }
  if(e.key === '/'){ e.preventDefault(); search.focus(); }
});

// Math utils demo (modules)
console.log('5+7=', add(5,7), ' 3*4=', multiply(3,4));
