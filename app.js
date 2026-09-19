const toast = document.getElementById('toast');
const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); };

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  item.classList.add('active');
  const label = item.textContent.replace(/[0-9]/g, '').replace('NEW','').trim();
  document.getElementById('pageTitle').textContent = label;
  document.getElementById('sidebar').classList.remove('open');
  if (item.dataset.view !== 'overview') showToast(`${label} module is ready for configuration`);
}));

document.getElementById('mobileMenu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('exportBtn').addEventListener('click', () => showToast('Report export prepared — your download will begin shortly.'));
document.getElementById('createBtn').addEventListener('click', () => showToast('Event creator opened. Configure your next community event.'));
document.querySelectorAll('.segmented button').forEach(button => button.addEventListener('click', () => {
  button.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  showToast(`${button.textContent} activity loaded`);
}));
document.querySelectorAll('.row-more,.more').forEach(button => button.addEventListener('click', () => showToast('More actions are available in the full room manager.')));

document.querySelector('.chart-legend select').addEventListener('change', (event) => showToast(`${event.target.value} analytics loaded`));
