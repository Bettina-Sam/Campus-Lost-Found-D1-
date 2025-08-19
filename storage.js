export function load(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch{ return fallback; }
}

export function persist(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadCards(){
  return load('cards', []);
}

export function saveCards(arr){
  persist('cards', arr);
}
