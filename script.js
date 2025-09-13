const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('primary-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

const animatedEls = document.querySelectorAll('[data-animate]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach((el) => obs.observe(el));
} else {
  animatedEls.forEach((el) => el.classList.add('is-visible'));
}
//BMI calculator
function calcBMI({ heightValue, heightUnit, weightKg }) {
  let hMeters = heightUnit === 'cm' ? heightValue / 100 : heightValue; 
  const bmi = weightKg / (hMeters * hMeters);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi: Number(bmi.toFixed(1)), category };
}


(function bindBMIForm(){
  const form = document.getElementById('bmiForm');
  if (!form) return;
  const height = document.getElementById('height');
  const heightUnit = document.getElementById('heightUnit');
  const weight = document.getElementById('weight');
  const out = document.getElementById('bmiOutput');


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = parseFloat(height.value);
    const w = parseFloat(weight.value);
    const unit = heightUnit.value;
    if (!h || !w || h <= 0 || w <= 0) {
      out.textContent = 'Please enter valid height and weight.';
      out.setAttribute('data-status', 'error');
      return;
    }
    const { bmi, category } = calcBMI({ heightValue: h, heightUnit: unit, weightKg: w });
    out.textContent = `Your BMI is ${bmi} — ${category}`;
    out.removeAttribute('data-status');
  });
})();

//Appointment and contact us form.. 
(function bindAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const out = document.getElementById('appointmentOutput');
  const btn = form.querySelector('button[type="submit"]');
  const dateEl = document.getElementById('date');
  const emailTo = 'contact@wellspringclinic.com'; 

  if (dateEl) {
    const today = new Date().toISOString().split('T')[0];
    dateEl.min = today;
  }

  const phoneOk = (v) => /^[0-9+() \-]{7,}$/.test((v || '').trim());

  function showMessage(text, status = 'success', clearMs = 10000) {
    clearTimeout(out._timer);
    out.classList.remove('fade');
    out.innerHTML = ''; 
    out.setAttribute('data-status', status);
    out.textContent = text;

    const bar = document.createElement('div');
    bar.className = 'countdown';
    out.appendChild(bar);
    requestAnimationFrame(() => { bar.style.width = '0%'; });

    out._timer = setTimeout(() => {
      out.classList.add('fade');
      setTimeout(() => {
        out.textContent = '';
        out.classList.remove('fade');
        out.removeAttribute('data-status');
      }, 400); 
    }, clearMs);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const date  = (document.getElementById('date')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !email || !date) {
      showMessage('Please fill in your name, email, and preferred date.', 'error', 8000);
      return;
    }
    if (!phoneOk(phone)) {
      showMessage('Please enter a valid phone number.', 'error', 8000);
      return;
    }

    const subject = `Appointment Request: ${name} on ${date}`;
    const body =
`Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Date: ${date}

Message: ${message || '(none)'}
`;

    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      const a = document.createElement('a');
      a.href = mailto;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 0);
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          window.location.href = mailto;
        }
      }, 150);
    } catch (_) {
    }

    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 1200);

    form.reset();

    showMessage('Opening your email app to send the request… If nothing opens, email us at ' + emailTo , 'success', 10000);
  });
})();
(function bindContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const out = document.getElementById('contactOutput');
  const btn = form.querySelector('button[type="submit"]');
  const emailTo = 'contact@wellspringclinic.com';

  const phoneOk = (v) => /^[0-9+() \-]{7,}$/.test((v || '').trim());

  function showMessage(text, status = 'success', clearMs = 10000) {
    clearTimeout(out._timer);
    out.classList.remove('fade');
    out.innerHTML = '';
    out.setAttribute('data-status', status);
    out.textContent = text;

    const bar = document.createElement('div');
    bar.className = 'countdown';
    out.appendChild(bar);
    requestAnimationFrame(() => { bar.style.width = '0%'; });

    out._timer = setTimeout(() => {
      out.classList.add('fade');
      setTimeout(() => {
        out.textContent = '';
        out.classList.remove('fade');
        out.removeAttribute('data-status');
      }, 400);
    }, clearMs);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('cname')?.value || '').trim();
    const email = (document.getElementById('cemail')?.value || '').trim();
    const phone = (document.getElementById('cphone')?.value || '').trim();
    const message = (document.getElementById('cmessage')?.value || '').trim();

    if (!name || !email || !message) {
      showMessage('Please fill in your name, email, and message.', 'error', 8000);
      return;
    }
    if (!phoneOk(phone)) {
      showMessage('Please enter a valid phone number.', 'error', 8000);
      return;
    }

    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 1000);

    form.reset();
    showMessage('Thanks! Your message has been received. We will contact you soon.', 'success', 10000);
  });
})();

