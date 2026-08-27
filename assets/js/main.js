// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll-triggered fade-in for elements with class "reveal"
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Animated stepper — sequential node activation + connector fill on scroll into view
const stepper = document.getElementById('stepper');
if(stepper){
  const stepItems = stepper.querySelectorAll('.step-item');
  const stepConnectors = stepper.querySelectorAll('.step-connector');
  function playStepper(){
    stepItems.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('active');
        const connector = stepConnectors[i];
        if(connector){ setTimeout(() => connector.classList.add('filled'), 220); }
      }, i * 380);
    });
  }
  if('IntersectionObserver' in window){
    const stepperObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){ playStepper(); stepperObserver.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    stepperObserver.observe(stepper);
  } else {
    playStepper();
  }
}

// Orbit carousel — services "circling to front" coverflow
const orbitTrack = document.getElementById('orbitTrack');
if(orbitTrack){
  const orbitCards = Array.from(orbitTrack.querySelectorAll('.orbit-card'));
  const orbitDotsWrap = document.getElementById('orbitDots');
  const orbitPrevBtn = document.getElementById('orbitPrev');
  const orbitNextBtn = document.getElementById('orbitNext');
  const total = orbitCards.length;
  let activeIndex = 0;
  let orbitTimer = null;

  orbitCards.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Show service ' + (i + 1));
    dot.addEventListener('click', () => { activeIndex = i; renderOrbit(); restartAutoplay(); });
    orbitDotsWrap.appendChild(dot);
  });
  const orbitDots = Array.from(orbitDotsWrap.children);

  function isMobile(){ return window.innerWidth <= 820; }

  function renderOrbit(){
    const spacing = isMobile() ? 0 : 300;
    const maxVisible = isMobile() ? 0 : 2;

    orbitCards.forEach((card, i) => {
      let offset = i - activeIndex;
      if(offset > total / 2) offset -= total;
      if(offset < -total / 2) offset += total;

      const abs = Math.abs(offset);
      card.classList.toggle('active', offset === 0);

      if(isMobile()){
        // Mobile: only the active card is shown, centered
        if(offset === 0){
          card.style.transform = 'translate(-50%, -50%) scale(1)';
          card.style.opacity = '1';
          card.style.zIndex = '5';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.transform = 'translate(-50%, -50%) scale(0.85)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
        }
        return;
      }

      if(abs > maxVisible){
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.zIndex = '0';
        card.style.transform = `translate(-50%, -50%) translateX(${offset > 0 ? 140 : -140}%) scale(0.6)`;
        return;
      }

      const scale = 1 - abs * 0.16;
      const rotateY = offset * -18;
      const translateX = offset * spacing;
      const opacity = 1 - abs * 0.38;

      card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(10 - abs);
      card.style.filter = abs === 0 ? 'none' : `blur(${abs * 0.6}px)`;
      card.style.pointerEvents = 'auto';
    });

    orbitDots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  }

  function next(){ activeIndex = (activeIndex + 1) % total; renderOrbit(); }
  function prev(){ activeIndex = (activeIndex - 1 + total) % total; renderOrbit(); }

  orbitNextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
  orbitPrevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

  orbitCards.forEach((card, i) => {
    card.addEventListener('click', () => { activeIndex = i; renderOrbit(); restartAutoplay(); });
  });

  function startAutoplay(){ orbitTimer = setInterval(next, 4200); }
  function restartAutoplay(){ if(orbitTimer) clearInterval(orbitTimer); startAutoplay(); }

  const orbitWrap = document.getElementById('orbitWrap');
  orbitWrap.addEventListener('mouseenter', () => { if(orbitTimer) clearInterval(orbitTimer); });
  orbitWrap.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', renderOrbit);

  renderOrbit();
  startAutoplay();
}

// Testimonial carousel — edit this array to change reviews
const testimonials = [
  { stars: 5, quote: "Gibby at Texas Click Digital is professional, straightforward, and delivers on time. Updating and changing out sections is extremely easy — he makes the whole process smooth from start to finish.", name: "Jack K.", org: "Business Owner" },
  { stars: 5, quote: "Gibby is the best. Super easy to work with and extremely helpful. Highly recommend.", name: "Gary R.", org: "Client" },
  { stars: 5, quote: "Gibby is so patient when making sure I get exactly what I need on the page. He doesn't stop until it's right — and the results speak for themselves.", name: "Holly N.", org: "Infectious Disease of Southern Nevada" },
  { stars: 5, quote: "Texas Click Digital makes everything functional and professional. Exactly what you want from a digital partner.", name: "Jeff L.", org: "Business Owner" }
];
let testiIndex = 0;
const testiStars = document.getElementById('testiStars');
const testiQuote = document.getElementById('testiQuote');
const testiWho = document.getElementById('testiWho');
const testiDots = document.getElementById('testiDots');

function renderDots(){
  testiDots.innerHTML = '';
  testimonials.forEach((_, i) => {
    const b = document.createElement('button');
    if(i === testiIndex) b.classList.add('active');
    b.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
    b.addEventListener('click', () => { testiIndex = i; renderTesti(); });
    testiDots.appendChild(b);
  });
}
function renderTesti(){
  const t = testimonials[testiIndex];
  testiStars.textContent = '★'.repeat(t.stars);
  testiQuote.textContent = '"' + t.quote + '"';
  testiWho.innerHTML = '<strong>' + t.name + '</strong> <span>— ' + t.org + '</span>';
  renderDots();
}
document.getElementById('prevBtn').addEventListener('click', () => {
  testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
  renderTesti();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  testiIndex = (testiIndex + 1) % testimonials.length;
  renderTesti();
});
renderTesti();

// Contact form — posts to Formspree
const quoteForm = document.getElementById('quoteForm');
quoteForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;

  if(quoteForm.action.includes('YOUR_FORM_ID')){
    alert('Form not connected yet — replace YOUR_FORM_ID in _includes/contact.html with your real Formspree endpoint.');
    return;
  }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  try {
    const res = await fetch(quoteForm.action, {
      method: 'POST',
      body: new FormData(quoteForm),
      headers: { 'Accept': 'application/json' }
    });
    if(res.ok){
      quoteForm.reset();
      submitBtn.textContent = 'Sent — we\'ll be in touch!';
    } else {
      submitBtn.textContent = 'Something went wrong — try again';
      submitBtn.disabled = false;
    }
  } catch (err) {
    submitBtn.textContent = 'Something went wrong — try again';
    submitBtn.disabled = false;
  }
  setTimeout(() => { submitBtn.textContent = originalLabel; submitBtn.disabled = false; }, 4000);
});
