// ===== Advanced JavaScript: events, DOM, arrays, loops, functions =====
(function(){
  // Welcome alert on page load (once per session)
  if(!sessionStorage.getItem('welcomed')){
    alert('Welcome to Campus Lost & Found');
    sessionStorage.setItem('welcomed', '1');
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));
  }

  // Change background (toggle theme) button
  const changeBgBtn = document.getElementById('changeBg');
  if(changeBgBtn){
    changeBgBtn.addEventListener('click', ()=>{
      document.body.classList.toggle('theme-alt');
    });
  }

  // Add helpful tip dynamically
  const addTipBtn = document.getElementById('addTip');
  if(addTipBtn){
    addTipBtn.addEventListener('click', ()=>{
      const tips = [
        'Tip: Add a unique sticker to your laptop for easy ID.',
        'Tip: Label notebooks with name & department.',
        'Tip: Meet in public spaces for item exchange.'
      ];
      // pick next tip in sequence using a simple counter stored on the button
      let idx = Number(addTipBtn.dataset.idx || 0);
      const tip = tips[idx % tips.length];
      addTipBtn.dataset.idx = (idx + 1).toString();

      const tipCard = document.createElement('article');
      tipCard.className = 'card fade-in';
      tipCard.innerHTML = `<h3>Helpful Tip</h3><p>${tip}</p>`;
      document.querySelector('.cards')?.appendChild(tipCard);
    });
  }

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const qs = (id)=> document.getElementById(id);
    const fields = {
      name: { el: qs('name'), err: qs('nameErr'), validate: v=> v.trim() ? '' : 'Name is required.' },
      email:{ el: qs('email'), err: qs('emailErr'), validate: v=> /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(v) ? '' : 'Enter a valid email.' },
      topic:{ el: qs('topic'), err: qs('topicErr'), validate: v=> v ? '' : 'Please select a topic.' },
      date: { el: qs('date'), err: qs('dateErr'), validate: v=> {
        if(!v) return '';
        const d = new Date(v);
        const today = new Date(); today.setHours(0,0,0,0);
        return d > today ? 'Date cannot be in the future.' : '';
      }},
      message:{ el: qs('message'), err: qs('messageErr'), validate: v=> v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' }
    };

    // multiple listeners + real-time feedback
    Object.values(fields).forEach(({el, err, validate})=>{
      el.addEventListener('input', ()=> err.textContent = validate(el.value));
      el.addEventListener('blur',  ()=> err.textContent = validate(el.value));
    });

    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      let bad = false;
      Object.values(fields).forEach(({el, err, validate})=>{
        const msg = validate(el.value);
        err.textContent = msg;
        if(msg) bad = true;
      });
      if(!bad){
        // thank-you message without leaving the page
        const thanks = document.getElementById('thanks');
        thanks.textContent = 'Thanks! Your message has been sent.';
        thanks.style.color = 'var(--success)';
        contactForm.reset();
        // auto clear after a short delay
        setTimeout(()=> thanks.textContent = '', 2500);
      }
    });
  }
})();