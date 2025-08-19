// ===== JS Validation for Campus Lost & Found =====
(function(){
  const form = document.getElementById('reportForm');
  const banner = document.getElementById('successBanner');

  const getEl = (id) => document.getElementById(id);

  const fields = {
    name:   { el: getEl('name'),   err: getEl('nameError'),        validate: v => v.trim() ? '' : 'Name is required.' },
    email:  { el: getEl('email'),  err: getEl('emailError'),       validate: v => /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(v) ? '' : 'Enter a valid email.' },
    status: { el: getEl('status'), err: getEl('statusError'),      validate: v => v ? '' : 'Select Lost or Found.' },
    category:{el: getEl('category'),err: getEl('categoryError'),   validate: v => v ? '' : 'Select a category.' },
    description:{el:getEl('description'),err:getEl('descriptionError'), validate: v => v.trim().length >= 8 ? '' : 'Add at least 8 characters.'},
    date:   { el: getEl('date'),   err: getEl('dateError'),        validate: v => {
      if(!v) return 'Select a date.';
      const today = new Date(); today.setHours(0,0,0,0);
      const d = new Date(v);
      return d > today ? 'Date cannot be in the future.' : '';
    }},
    location:{el:getEl('location'),err:getEl('locationError'),     validate: v => v.trim() ? '' : 'Location is required.'},
    phone:  { el: getEl('phone'),  err: getEl('phoneError'),       validate: v => v.trim() && !/^\+?\d[\d\s-]{7,}$/.test(v) ? 'Enter a valid phone number or leave blank.' : '' },
    photo:  { el: getEl('photo'),  err: getEl('photoError'),       validate: v => v.trim() && !/^https?:\/\/.+/i.test(v) ? 'Enter a valid URL or leave blank.' : '' }
  };

  Object.values(fields).forEach(({el, err, validate})=>{
    el.addEventListener('input', ()=> err.textContent = validate(el.value));
    el.addEventListener('blur',  ()=> err.textContent = validate(el.value));
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let bad = false;
    Object.values(fields).forEach(({el, err, validate})=>{
      const msg = validate(el.value);
      err.textContent = msg;
      if(msg) bad = true;
    });

    if(!bad){
      banner.style.display = 'block';
      alert('Report Submitted Successfully');
      form.reset();
      setTimeout(()=> banner.style.display='none', 2200);
    }
  });
})();
