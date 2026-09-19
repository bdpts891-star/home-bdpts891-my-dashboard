const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const sidebar = document.getElementById('sidebar');
const mobileMenu = document.getElementById('mobileMenu');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

mobileMenu.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
    item.classList.add('active');
    showToast(item.textContent.trim() + ' module selected');
    if (window.innerWidth <= 1100) sidebar.classList.remove('open');
  });
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☾' : '☼';
  showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
});

document.querySelectorAll('.control-group button').forEach((button) => {
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    showToast(button.textContent.trim() + ' selected');
  });
});

document.querySelectorAll('.btn, .link-btn, .more-btn').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.textContent.includes('Export')) showToast('Report export started');
    if (button.textContent.includes('New event')) showToast('Create event wizard opened');
    if (button.textContent.includes('View')) showToast('Expanded view opened');
    if (button.textContent.includes('•••')) showToast('More actions available');
  });
});

window.addEventListener('click', (event) => {
  if (window.innerWidth <= 1100 && sidebar.classList.contains('open') && !event.target.closest('.sidebar') && !event.target.closest('#mobileMenu')) {
    sidebar.classList.remove('open');
  }
});
