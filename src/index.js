import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './js/pixabayapi';
import { createGalleryCards } from './js/gallery-cards.js';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const searchBtnEl = document.querySelector('.search-btn');
const perPage = 40;

const pixabayAPI = new PixabayAPI();

let gallery = new SimpleLightbox('.gallery a');

const onSearchFormSubmit = async event => {
  event.preventDefault();

  searchBtnEl.disabled = true;
  searchBtnEl.classList.add('disabled');

  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;

  if (pixabayAPI.query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
     return;
  }

  try {
    const { hits, total, totalHits } = await pixabayAPI.fetchPhotosByQuery();

    if (hits.length > 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (totalHits === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      galleryListEl.innerHTML = '';

      return;
    }

    if (totalHits > perPage) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    galleryListEl.innerHTML = createGalleryCards(hits);

    gallery.refresh();
  } catch (err) {
    console.log(err);
  }

  searchBtnEl.disabled = false;
  searchBtnEl.classList.remove('disabled');
};

const onLoadMoreBtnClick = async event => {
  event.target.disabled = true;
  event.target.classList.add('disabled');

  pixabayAPI.page += 1;

  try {
    const { hits } = await pixabayAPI.fetchPhotosByQuery();
    if (hits.length === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    

    const { height: cardHeight } =
      galleryListEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    gallery.refresh();
  } catch (err) {
    console.log(err);
  }

  event.target.disabled = false;
  event.target.classList.remove('disabled');
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(hits));