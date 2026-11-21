// Without JavaScript the full bibliography stays visible.
const filters = document.querySelector('#pub-filters');
const buttons = filters.querySelectorAll('button');
const publications = document.querySelectorAll('#pub-list .pub');
const count = document.querySelector('#pub-count');

function showPublications(filter) {
  let visible = 0;
  for (const paper of publications) {
    const matches = filter === 'all' || paper.dataset.topic === filter ||
      (filter === 'selected' && paper.hasAttribute('data-selected'));
    paper.hidden = !matches;
    if (matches) visible++;
  }
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  }
  count.textContent = visible + ' of ' + publications.length + ' entries shown';
}

for (const button of buttons) {
  button.addEventListener('click', () => showPublications(button.dataset.filter));
}
showPublications('selected');
filters.hidden = false;
