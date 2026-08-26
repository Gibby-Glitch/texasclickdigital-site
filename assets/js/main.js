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

// Testimonial carousel — edit this array to change reviews
const testimonials = [
  { stars: 5, quote: "Gibby is so patient when making sure I get exactly what I need on the page. He doesn't stop until it's right — and the results speak for themselves.", name: "Holly N.", org: "Infectious Disease of Southern Nevada" },
  { stars: 5, quote: "They handled our website, our ads, and our social in one place. First time we haven't had to manage three different vendors.", name: "Marcus D.", org: "DFW Auto Detailing" },
  { stars: 5, quote: "Turnaround was fast and they actually explained what they were doing instead of hiding behind jargon.", name: "Priya S.", org: "Lewisville Family Dental" },
  { stars: 5, quote: "Our new site paid for itself in the first month just from the leads it started bringing in.", name: "Tom R.", org: "North Texas Roofing Co." }
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
