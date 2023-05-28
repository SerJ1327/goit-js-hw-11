import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import onLoadMore from './loadMore.js';
const axios = require('axios').default;

const formRef = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const galleryRef = document.querySelector('.gallery');
const apiKey = '36802849-b7af5cd62cfcc85474a5247b9';

let currentPage = 1;
let currentQuery = '';
let lightbox;

btnLoadMore.addEventListener('click', onLoadMore);
formRef.addEventListener('submit', onSearch);

const refs = {
  currentPage,
  fetchImages,
  currentQuery,
  renderImages,
  lightbox,
  initializeLightbox,
  hideLoadMoreButton,
  showEndOfResultsMessage,
};

export default refs;

async function onSearch(event) {
  event.preventDefault();
  clearGallery();

  const searchQuery = event.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim()
    .replace(/ /g, '+');

  if (searchQuery === '') {
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;

  try {
    const { images, totalHits } = await fetchImages(searchQuery, currentPage);
    if (images.length === 0) {
      showNoResultsMessage();
      return;
    }

    renderImages(images);
    showLoadMoreButton();
    showSearchResults(totalHits);
    initializeLightbox();
  } catch (error) {
    console.error(error);
  }
}

function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  return axios
    .get(url)
    .then(response => {
      const { hits, totalHits } = response.data;
      return { images: hits, totalHits };
    })
    .catch(error => {
      throw new Error(`Failed to fetch images: ${error.message}`);
    });
}

function renderImages(images) {
  const cardsMarkup = images
    .map(image => createImageCardMarkup(image))
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', cardsMarkup);
}

function createImageCardMarkup(image) {
  return `
    <li class="photo-card">
      <a class="photo-card-link" href="${image.largeImageURL}">
        <img class="galery-card-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /> 
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </a>
    </li>
  `;
}

function clearGallery() {
  galleryRef.innerHTML = '';
}

function showLoadMoreButton() {
  btnLoadMore.classList.remove('is-hidden');
}

function hideLoadMoreButton() {
  btnLoadMore.classList.add('is-hidden');
}

function showNoResultsMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function showSearchResults(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function initializeLightbox() {
  lightbox = new SimpleLightbox('.photo-card .photo-card-link', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}
