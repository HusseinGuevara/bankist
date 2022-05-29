'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const logo = document.querySelector('.nav__logo');
const link = document.querySelector('.nav__link--btn');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelectorAll('.nav__link');
const navBar = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const imgTargets = document.querySelectorAll('img[data-src]');
const dotContainer = document.querySelector('.dots');



//////////////////////////////////////

// Model Close and Open
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling and Navigation
btnScrollTo.addEventListener('click', function() {
  const s1coord = section1.getBoundingClientRect();   // getBoundingClientRect() is a method that returns
  section1.scrollIntoView({behavior: 'smooth'}) // New way odf smooth scrolling into view
});

// Nav Bar Smooth Scrolling
navBar.addEventListener('click', function(e) { 
  e.preventDefault();
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})

// Tabbed Component
tabsContainer.addEventListener('click', function(e) { // Use Event Deligation to avoid attaching each callback function to each tab
  const clicked = e.target.closest('.operations__tab');
  
  // Guard Clause
  if(!clicked) return;

  // Activate Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // This will remove the active class from all tabs
  clicked.classList.add('operations__tab--active'); //This will add the active class to the clicked tab

  // Activate Tab Content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));  // Remove active class from siblings
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');  // Add active class to target
});

// Menu fade animation
const handleHover = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    
    // Target each sibling and lower the opacity
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    })

    logo.style.opacity = this;
  }
}

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5))
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky Navigation: Intersection Observer API
const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver
(stickyNav, {
  root: null, 
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Reaveling Sections: Intersection Observer API
const revealSection  = function(entries, observer) {
  const [entry] = entries;

  // If it is not intersection yet, do not relveal section
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // Once it has been revealed, unobserve
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver
(revealSection, {
  root: null,
  threshold: 0.15 // Once %15 of the section is Intersected, reveal the secton
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// Lazy Loading Images
const loadImg = function(entries, observer) {
  const [entry] = entries;

  // Guard Clause
  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // To ensure that img is fully loaded before removing blur, attach event handler and wait for load
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img')
  });

  // Unobserve
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0, 
  rootMargin: "200px"
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slides 

const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft= document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  let currSlide = 0;
  const maxSlides = slides.length;

  // slider.style.transform = 'scale(.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  const goToSlide = function(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Create Dots
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `
        <button class="dots__dot" data-slide="${i}"></button>
      `)
    })
  }

  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }


  // Next Slide
  const nextSlide = function() {
    if(currSlide === maxSlides - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    };
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  // Previous Slide
  const prevSlide = function() {
    if(currSlide === 0) {
      currSlide = maxSlides - 1;
    } else {
      currSlide--
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  }

  // Initiate Slider and Dots
  const init = function() {
    createDots();
    goToSlide(0);
    activateDot(0);

  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Event Listener for key inputs for slider
  document.addEventListener('keydown', function(e) {
    console.log(e)
    if(e.key === 'ArrowLeft') prevSlide();
    if(e.key === 'ArrowRight') nextSlide();
  });

  // Event Listiner for Dots
  dotContainer.addEventListener('click', function(e) {
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  })
};
slider();





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Events
const h1 = document.querySelector('h1');

// const alertH1 = function(e) {
//   alert('This the Mouse Enter Event!!');
//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1)

// Attributes
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));

// console.log(link);
// console.log(link.href);
// console.log(link.getAttribute('href'));

// Selecting elements



// console.log(allSections);

// document.getElementById('section--1')

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// // Creating and Inserting Elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = 
//   'We use cookies for improved functionaliy! <button class="btn btn--close-cookie">Got It!</button>'

// header.prepend(message);
// // header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete ELements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function() {
//     message.remove();
//   })

// // Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "100%";

// console.log(message.style.color);
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 80 + "px";

// DOM Traversing

// Going downwards: child
// console.log(h1.childNodes);
// console.log(h1.children);

// Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.add('sticky');
// })

// Scrolling 
  // window.scrollTo(s1coord.left + window.pageXOffset, s1coord.top + window.pageYOffset);
  
  // window.scrollTo({                          // Old way of scrolling into view, object notation add behaivior for smooth scroll
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: "smooth"
  // })