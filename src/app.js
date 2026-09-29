import courses from '../data/courses.json' assert { type: 'json' };

const grid = document.querySelector('#course-grid');
const money = new Intl.NumberFormat('en-GB',{style:'currency',currency:courses.currency,maximumFractionDigits:0});

grid.innerHTML = courses.courses.map(c => `
  <article class="course" data-course-id="${c.id}">
    <div><div class="meta">${c.type} · ${c.hours} HOURS · ${c.units} UNITS</div><h3>${c.name}</h3></div>
    <div class="price">${money.format(c.price)}<small>per learner</small></div>
  </article>`).join('');

document.querySelectorAll('[data-route="login"]').forEach(btn=>btn.addEventListener('click',()=>{
  alert('Portal routing is ready for the authentication layer. Connect Appwrite Auth here when the backend is enabled.');
}));

window.SSTraining = { version:'0.1.0', courses, apiBase:null, configure({apiBase}={}){this.apiBase=apiBase;}, featureFlags:{appwrite:false,ai:false,payments:false} };
