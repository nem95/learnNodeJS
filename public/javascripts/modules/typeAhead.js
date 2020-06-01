import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/stores/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    const val = this.value;

    if (!val) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';

    axios.get(`/api/search?q=${val}`)
    .then(res => {
      if (res.data.length) {
        searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
        return;
      }
      searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${val} found!</div>`);
    })
    .catch(err => {
      console.error(err);
    });
  });

  searchInput.on('keyup', (e) => {
    if (![38, 40, 13].includes(e.keyCode)) return;

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    // if keycode === 38 go up
    if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 13 && current && current.href) {
      // eslint-disable-next-line no-undef
      return window.location = current.href;
    }

    if (current) {
      current.classList.remove(activeClass);
    }
    if (next) {
      next.classList.add(activeClass);
    }
  });
}

export default typeAhead;
