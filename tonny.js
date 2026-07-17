// tonny.js - enkel og robust
async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

function createElement(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text) el.textContent = text;
  return el;
}

async function loadObjectives() {
  try {
    const data = await fetchJson('./objectives.json');
    const container = document.getElementById('objectives');
    container.innerHTML = '';

    if (!data.sets || data.sets.length === 0) {
      container.appendChild(createElement('p', 'empty', 'Ingen objectives funnet'));
      return;
    }

    data.sets.forEach(set => {
      const group = createElement('div', 'objective-group');
      const title = createElement('div', 'objective-title', set.name || 'Ukjent sett');
      group.appendChild(title);

      const list = createElement('div', 'objective-list');
      (set.tasks || []).forEach(task => {
        const item = createElement('div', 'objective-item');
        const left = createElement('div', 'objective-left', `${task.group}`);
        const right = createElement('div', 'objective-right', `${task.label}`);
        item.appendChild(left);
        item.appendChild(right);
        list.appendChild(item);
      });

      group.appendChild(list);
      container.appendChild(group);
    });
  } catch (err) {
    const container = document.getElementById('objectives');
    container.innerHTML = '';
    container.appendChild(createElement('p', 'error', 'Feil ved lasting av objectives'));
    console.error(err);
  }
}

async function loadPlayerCard() {
  try {
    const data = await fetchJson('./database.json');
    const player = (data.players && data.players[0]) || null;
    const card = document.getElementById('player-card');

    if (!player) {
      card.style.backgroundImage = '';
      card.textContent = 'Ingen spiller funnet';
      return;
    }

    const cardFile = player.card || 'tots-frame.png';
    card.style.backgroundImage = `url('./cards/${cardFile}')`;
    card.setAttribute('title', `${player.name} • ${player.rating}`);
    card.innerHTML = `
      <div class="card-overlay">
        <div class="card-name">${player.name}</div>
        <div class="card-rating">${player.rating}</div>
      </div>
    `;
  } catch (err) {
    console.error('Failed to load player card', err);
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}

document.addEventListener('DOMContentLoaded', () => {
  loadObjectives();
  loadPlayerCard();
});

