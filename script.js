// SparkClean site behavior
  // ---- mobile nav menu ----
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.querySelector('nav.links');
  function closeMobileNav(){
    navLinks.classList.remove('mobile-open');
    burgerBtn.setAttribute('aria-expanded','false');
  }
  burgerBtn.addEventListener('click', ()=>{
    const isOpen = navLinks.classList.toggle('mobile-open');
    burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', ()=>{ if(window.innerWidth > 980) closeMobileNav(); });

  // ---- scroll reveal observer (re-usable for dynamically rendered cards) ----
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  function observeReveals(){
    document.querySelectorAll('.reveal:not(.in)').forEach(el=> revealObserver.observe(el));
  }

  // ---- tabs: checklist ----
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn[data-tab]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#checklist .tab-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    });
  });
  // ---- tabs: pricing ----
  document.querySelectorAll('.tab-btn[data-tab2]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn[data-tab2]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#pricing .tab-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById('ptab-'+btn.dataset.tab2).classList.add('active');
    });
  });

  // ---- gallery: real client before/after photos ----
  const galleryItems = [
    {label:'Living room refresh', cat:'living', src:'img/gallery-01.jpg'},
    {label:'Bedroom deep clean', cat:'bedroom', src:'img/gallery-02.jpg'},
    {label:'Galley kitchen', cat:'kitchen', src:'img/gallery-03.jpg'},
    {label:'Bathroom vanity & toilet', cat:'bathroom', src:'img/gallery-04.jpg'},
    {label:'Bedroom reset', cat:'bedroom', src:'img/gallery-05.jpg'},
    {label:'Sink drain detail', cat:'bathroom', src:'img/gallery-06.jpg'},
    {label:'Fridge interior', cat:'kitchen', src:'img/gallery-07.jpg'},
    {label:'Living space tidy-up', cat:'living', src:'img/gallery-08.jpg'},
    {label:'Full kitchen clean', cat:'kitchen', src:'img/gallery-09.jpg'},
    {label:'Oven interior', cat:'kitchen', src:'img/gallery-10.jpg'},
    {label:'Tile floor detail', cat:'bathroom', src:'img/gallery-11.jpg'},
    {label:'Toilet bowl sanitizing', cat:'bathroom', src:'img/gallery-12.jpg'},
    {label:'Toilet seat detail', cat:'bathroom', src:'img/gallery-13.jpg'},
  ];
  const catLabels = {kitchen:'Kitchen', bathroom:'Bathroom', bedroom:'Bedroom', living:'Living'};
  function renderGallery(filter){
    const grid = document.getElementById('galleryGrid');
    const items = filter==='all' ? galleryItems
      : filter==='living' ? galleryItems.filter(i=>i.cat==='living'||i.cat==='bedroom')
      : galleryItems.filter(i=>i.cat===filter);
    grid.innerHTML = items.map((i,idx)=>`
      <div class="gallery-card reveal reveal-${(idx%3)+1}">
        <span class="gallery-spark"><svg viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="#fff"/></svg></span>
        <div class="gallery-card-inner">
          <div class="gallery-photo">
            <img src="${i.src}" alt="${i.label} — before and after cleaning" loading="lazy" width="640" height="628">
            <span class="ba-badge before">Before</span>
            <span class="ba-badge after">After</span>
          </div>
          <div class="gallery-meta">
            <strong>${i.label}</strong>
            <span class="gallery-tag">${catLabels[i.cat]}</span>
          </div>
        </div>
      </div>
    `).join('');
    observeReveals();
  }
  renderGallery('all');
  document.querySelectorAll('#galleryTabs .tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#galleryTabs .tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.gfilter);
    });
  });

  // ---- pricing data ----
  const standardPricing = [
    {bed:'1 Bedroom', rows:[['1 bath',150],['2 baths',170]]},
    {bed:'2 Bedrooms', rows:[['1 bath',190],['2 baths',210],['3 baths',230]]},
    {bed:'3 Bedrooms', rows:[['1 bath',250],['2 baths',270],['3 baths',290],['4 baths',310]]},
    {bed:'4 Bedrooms', rows:[['1–2 baths',330],['3 baths',350],['4 baths',370],['5 baths',390]]},
    {bed:'5 Bedrooms', rows:[['1–2 baths',410],['3 baths',430],['4 baths',450],['5 baths',470]]},
    {bed:'6 Bedrooms', rows:[['1–2 baths',490],['3 baths',510],['4 baths',530],['5 baths',550]]},
  ];
  const deepPricing = [
    {bed:'1 Bedroom', rows:[['1 bath',170],['2+ baths',190]]},
    {bed:'2 Bedrooms', rows:[['1 bath',220],['2 baths',240],['3 baths',260]]},
    {bed:'3 Bedrooms', rows:[['1 bath',290],['2 baths',310],['3 baths',330],['4 baths',350]]},
    {bed:'4 Bedrooms', rows:[['1–2 baths',380],['3 baths',400],['4 baths',420],['5 baths',440]]},
    {bed:'5 Bedrooms', rows:[['1–2 baths',470],['3 baths',490],['4 baths',510],['5 baths',530]]},
    {bed:'6 Bedrooms', rows:[['1–2 baths',560],['3 baths',580],['4 baths',600],['5 baths',620]]},
  ];
  function renderPricing(data, elId){
    const el = document.getElementById(elId);
    el.innerHTML = data.map(g=>`
      <div class="price-group">
        <h4>${g.bed}</h4>
        ${g.rows.map(r=>`<div class="price-row"><span class="baths">${r[0]}</span><span class="amt">$${r[1]}</span></div>`).join('')}
      </div>
    `).join('');
  }
  renderPricing(standardPricing,'grid-standard');
  renderPricing(deepPricing,'grid-deep');

  // ---- reviews (in-memory, session only — connect a backend/DB to persist permanently) ----
  const starsSvg = (n)=> Array.from({length:5}).map((_,i)=>`<svg viewBox="0 0 24 24" fill="${i<n?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z"/></svg>`).join('');

  let reviews = [
    {name:'Maria G.', loc:'Miami, FL · Deep Cleaning', rating:5, text:'They cleaned things I forgot even needed cleaning — baseboards, the oven, everything. Non-toxic products and my apartment still smells amazing.'},
    {name:'Jordan P.', loc:'Los Angeles, CA · Regular Cleaning', rating:5, text:'On time, thorough, and I love that everything they use is safe around my dog. Booking through WhatsApp is so easy too.'},
    {name:'Alicia R.', loc:'Miami, FL · Move-Out Cleaning', rating:5, text:'Got our full deposit back thanks to how spotless they left the place. Would book again in a heartbeat.'},
    {name:'Daniel K.', loc:'Los Angeles, CA · Deep Cleaning', rating:5, text:'First deep clean we\u2019ve had and it made a huge difference. Friendly team, fair price, no harsh chemical smell.'},
    {name:'Sophia L.', loc:'Miami, FL · Regular Cleaning', rating:5, text:'We\u2019re on the bi-weekly plan now. Consistent, detail-oriented, and always communicative about timing.'},
    {name:'Grace T.', loc:'Los Angeles, CA · Move-In Cleaning', rating:5, text:'Moved into a place that needed serious help — SparkClean made it feel brand new before we unpacked a single box.'},
    {name:'Emily N.', loc:'Miami, FL · Deep Cleaning', rating:4, text:'Great attention to detail in the kitchen and bathrooms. Would\u2019ve loved a bit more time on the windows, but overall very happy.'},
    {name:'Marcus B.', loc:'Los Angeles, CA · Regular Cleaning', rating:5, text:'Eco-friendly products were the deciding factor for us with two toddlers at home. Exactly as advertised.'},
    {name:'Isabela F.', loc:'Miami, FL · Regular Cleaning', rating:5, text:'Quick to respond, easy to schedule, and the house always looks and smells great after they leave.'},
    {name:'Chris W.', loc:'Los Angeles, CA · Deep Cleaning', rating:5, text:'Booked a one-time deep clean before hosting family and it was worth every dollar. Highly recommend.'},
  ];

  function renderReviews(){
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = reviews.map((r,idx)=>`
      <div class="review-card reveal reveal-${(idx%3)+1}">
        <div class="stars">${starsSvg(r.rating)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-who">
          <strong>${r.name}</strong>
          <span>${r.loc}</span>
        </div>
      </div>
    `).join('');
    observeReveals();
  }
  renderReviews();

  // modal open/close
  const reviewModal = document.getElementById('reviewModal');
  document.getElementById('openReviewModal').addEventListener('click', ()=> reviewModal.classList.add('open'));
  document.getElementById('closeReviewModal').addEventListener('click', ()=> reviewModal.classList.remove('open'));
  reviewModal.addEventListener('click', (e)=>{ if(e.target===reviewModal) reviewModal.classList.remove('open'); });

  // star picker
  let selectedRating = 5;
  const starButtons = document.querySelectorAll('#starPicker button');
  function paintStars(v){
    starButtons.forEach(b=> b.classList.toggle('on', Number(b.dataset.v) <= v));
  }
  starButtons.forEach(b=>{
    b.addEventListener('click', ()=>{ selectedRating = Number(b.dataset.v); paintStars(selectedRating); });
  });
  paintStars(selectedRating);

  // submit review — newest goes on top, oldest beyond 10 is dropped
  document.getElementById('reviewForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('rv-name').value.trim();
    const loc = document.getElementById('rv-loc').value.trim() || 'Verified client';
    const text = document.getElementById('rv-text').value.trim();
    if(!name || !text) return;
    reviews.unshift({name, loc, rating:selectedRating, text});
    if(reviews.length > 10) reviews.pop();
    renderReviews();
    this.reset();
    selectedRating = 5;
    paintStars(5);
    reviewModal.classList.remove('open');
    document.getElementById('reviews').scrollIntoView({behavior:'smooth'});
  });

  // contact form -> opens visitor's email app pre-filled and addressed to SparkClean
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const city = document.getElementById('cf-city').value;
    const service = document.getElementById('cf-service').value;
    const msg = document.getElementById('cf-msg').value.trim();

    const subject = `New quote request from ${name || 'website visitor'}`;
    const body =
      `Name: ${name}\n` +
      `Phone/Email: ${phone}\n` +
      `City: ${city}\n` +
      `Service: ${service}\n` +
      `Details: ${msg || '—'}`;

    const mailtoLink = `mailto:sparkclean.la@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    document.getElementById('cfMsg').classList.add('show');
    this.reset();
  });
