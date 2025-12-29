// Load data from JSON
let data = {};

let crewIntervalId = null; // To store the interval ID for crew auto-change
let currentCrewIndex = 0; // To keep track of the current crew member
async function loadData() {
  try {
    const response = await fetch('./data.json');
    data = await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Navigation
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      updateActivePage(link.dataset.page);
    });
  });
}

// Page navigation
function updateActivePage(page) {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('nav a');

  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  document.getElementById(`${page}-page`).classList.add('active');
  document.querySelector(`nav a[data-page="${page}"]`).classList.add('active');

  // Manage intervals and initial tab display when switching pages
  if (crewIntervalId) {
    clearInterval(crewIntervalId);
    crewIntervalId = null;
    currentCrewIndex = 0; // Reset crew index when leaving the page
  }

  if (page === 'destination') {
    showDestination(0);
  } else if (page === 'crew') {
    showCrew(currentCrewIndex); // Show initial crew member
    // Start automatic cycling for crew
    crewIntervalId = setInterval(() => {
      currentCrewIndex = (currentCrewIndex + 1) % data.crew.length;
      showCrew(currentCrewIndex);
    }, 1000); // Change every 1 second

  } else if (page === 'technology') {
    showTechnology(0);
  }
}

// Destination tabs
function initDestinationTabs() {
  const buttons = document.querySelectorAll('#destination-page .dest-tab');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => showDestination(index));
  });
}

function showDestination(index) {
  if (!data.destinations || !data.destinations[index]) {
    console.error('Destination data not found for index:', index);
    return;
  }

  const buttons = document.querySelectorAll('#destination-page .dest-tab');
  const contents = document.querySelectorAll('#destination-page .tab-content');
  const destImage = document.querySelector('#destination-page .dest-img');
  const destSource = document.querySelector('#destination-page .destination-image picture source');

  const selectedDestination = data.destinations[index];

  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  if (buttons[index]) buttons[index].classList.add('active');
  if (contents[index]) contents[index].classList.add('active');

  // Update image source
  if (destImage && destSource) {
    destImage.src = selectedDestination.images.png;
    destImage.alt = selectedDestination.name;
    destSource.srcset = selectedDestination.images.webp;
  }
}

// Crew tabs
function initCrewTabs() {
  const buttons = document.querySelectorAll('#crew-page .crew-dot');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => showCrew(index));
  });
}

function showCrew(index) {
  if (!data.crew || !data.crew[index]) {
    console.error('Crew data not found for index:', index);
    return;
  }

  const buttons = document.querySelectorAll('#crew-page .crew-dot');
  const contents = document.querySelectorAll('#crew-page .crew-tab-content');
  const crewImage = document.querySelector('#crew-page .crew-img');
  const crewSource = document.querySelector('#crew-page .crew-image picture source');

  const selectedCrew = data.crew[index];

  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  if (buttons[index]) buttons[index].classList.add('active');
  if (contents[index]) contents[index].classList.add('active');
  
  // Update crew name
  const crewNameElement = contents[index].querySelector('h2');
  if (crewNameElement) crewNameElement.textContent = selectedCrew.name;

  // Update image source
  if (crewImage && crewSource) {
    crewImage.src = selectedCrew.images.png;
    crewImage.alt = selectedCrew.name;
    crewSource.srcset = selectedCrew.images.webp;
  }
}

// Technology tabs
function initTechnologyTabs() {
  const buttons = document.querySelectorAll('#technology-page .tech-btn');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => showTechnology(index));
  });
}

function showTechnology(index) {
  const buttons = document.querySelectorAll('#technology-page .tech-btn');
  const contents = document.querySelectorAll('#technology-page .tech-tab-content');

  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  if (buttons[index]) buttons[index].classList.add('active');
  if (contents[index]) contents[index].classList.add('active');
}

// Explore button
function initExploreBtn() {
  const exploreBtn = document.querySelector('.explore-btn');
  exploreBtn.addEventListener('click', () => {
    updateActivePage('destination');
  });
}

// Init on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initNavigation();
  initDestinationTabs();
  initCrewTabs();
  initTechnologyTabs();
  initExploreBtn();
  updateActivePage('home');
});
