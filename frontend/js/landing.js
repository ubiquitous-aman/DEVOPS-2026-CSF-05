/**
 * landing.js — powers all the interactivity on the marketing/landing page:
 * scroll-aware navbar, smooth-scrolling nav links, scroll-reveal animations,
 * animated stat counters, and the click-to-switch role feature tabs.
 */

const ROLE_CONTENT = {
  student: {
    icon: 'bi-person-badge',
    title: 'For Students',
    subtitle: 'Never miss an eligible drive again',
    points: [
      'Build your profile once — academics, resume, skills — and reuse it for every drive.',
      'See instantly whether you\'re eligible for a drive, and why, before you apply.',
      'Track your live status through Aptitude, Technical and HR rounds in one timeline.',
      'Get notified the moment a drive matching your profile is published.',
    ],
  },
  tpo: {
    icon: 'bi-person-workspace',
    title: 'For TPO / Placement Officers',
    subtitle: 'Run the whole placement season from one screen',
    points: [
      'Approve companies and review submitted placement requirements.',
      'Set eligibility criteria once — CGPA, backlogs, branch, batch — and publish.',
      'Move candidates through recruitment rounds and record the final decision.',
      'See live branch-wise placement %, average package and outcome stats.',
    ],
  },
  company: {
    icon: 'bi-building',
    title: 'For Companies',
    subtitle: 'Recruit without the email back-and-forth',
    points: [
      'Submit a placement requirement with your own round timetable.',
      'Track requirement approval status without chasing the TPO Cell.',
      'View applicants and shortlisted candidates for every approved drive.',
      'Leave interview feedback per round and see your final selected list.',
    ],
  },
  admin: {
    icon: 'bi-gear-fill',
    title: 'For Admins',
    subtitle: 'Keep the whole system accountable',
    points: [
      'Create and manage TPO and Admin accounts.',
      'Activate or deactivate any account instantly.',
      'Change a user\'s role if their responsibilities change.',
      'Review a full audit trail of every significant action in the system.',
    ],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initRoleTabs();
  initPlacementCharts();
  initPlacementTableFilter();
});

function initNavbarScroll() {
  const nav = document.getElementById('landingNav');
  if (!nav) return;
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  toggle();
  window.addEventListener('scroll', toggle);
}

function initSmoothScroll() {
  document.querySelectorAll('.scroll-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const collapse = document.getElementById('navMenu');
      if (collapse?.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

function initRoleTabs() {
  const buttons = document.querySelectorAll('.role-tab-btn');
  const body = document.getElementById('roleDetailBody');
  if (!buttons.length || !body) return;

  const render = (role) => {
    const data = ROLE_CONTENT[role];
    body.innerHTML = `
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="feature-icon bg-primary-soft"><i class="bi ${data.icon}"></i></div>
        <div>
          <h5 class="fw-bold mb-0">${data.title}</h5>
          <div class="text-muted small">${data.subtitle}</div>
        </div>
      </div>
      <ul class="list-unstyled mb-0">
        ${data.points.map((p) => `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>${p}</li>`).join('')}
      </ul>`;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.role);
    });
  });

  render('student'); // default tab
}

/* ===========================================================
   SKIT Placement Statistics Dashboard & Charts
   =========================================================== */

function initPlacementCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Year-Wise Total Placement Offers Histogram
  const histogramEl = document.getElementById('offersHistogramChart');
  if (histogramEl) {
    new Chart(histogramEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026 (Ongoing)'],
        datasets: [{
          label: 'Total Placement Offers',
          data: [812, 907, 718, 819, 887, 444, 555, 856],
          backgroundColor: [
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.75)',
            'rgba(139, 21, 21, 0.85)',
            'rgba(220, 38, 38, 1.0)', // 2026 highlight
          ],
          borderColor: [
            '#8B1515',
            '#8B1515',
            '#8B1515',
            '#8B1515',
            '#8B1515',
            '#8B1515',
            '#8B1515',
            '#991B1B',
          ],
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Total Offers: ${context.raw} Placement Offers`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Total Placement Offers' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }

  // 2. Branch-Wise Distribution Doughnut Chart
  const branchEl = document.getElementById('branchDistributionChart');
  if (branchEl) {
    new Chart(branchEl.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['CSE (Computer Science)', 'IT (Information Tech)', 'ECE (Electronics)', 'EE (Electrical)', 'ME (Mechanical)', 'CE (Civil)'],
        datasets: [{
          data: [42, 26, 15, 8, 5, 4],
          backgroundColor: [
            '#8B1515', // Maroon
            '#DC2626', // Red
            '#1B365D', // Navy
            '#D97706', // Gold
            '#059669', // Emerald
            '#64748B', // Slate
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 10 } },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}% of total placements`,
            },
          },
        },
      },
    });
  }

  // 3. Highest vs Average Package Growth Line Chart
  const salaryEl = document.getElementById('salaryTrendChart');
  if (salaryEl) {
    new Chart(salaryEl.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'Highest Package Offered (LPA)',
            data: [18.0, 28.0, 30.0, 41.0, 43.0, 37.5, 41.2, 47.0],
            borderColor: '#DC2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3,
          },
          {
            label: 'Average / Median Package (LPA)',
            data: [4.20, 4.50, 4.75, 5.00, 5.25, 5.10, 5.16, 5.50],
            borderColor: '#D97706',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { weight: 'bold' } },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${context.raw} LPA`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Compensation (₹ in Lakhs Per Annum - LPA)' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }
}

function initPlacementTableFilter() {
  const searchInput = document.getElementById('tableSearchInput');
  const table = document.getElementById('placementStatsTable');
  if (!searchInput || !table) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

