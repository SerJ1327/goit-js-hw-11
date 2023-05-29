import refs from './index.js';
import { currentPage } from './index.js';
import { currentQuery } from './index.js';
export default async function onLoadMore() {
  try {
    const { images } = await refs.fetchImages(currentQuery, currentPage);
    if (images.length === 0) {
      refs.hideLoadMoreButton();
      refs.showEndOfResultsMessage();
      refs.lightbox.refs.refresh();
      return;
    }

    refs.renderImages(images);
    refs.initializeLightbox();

    const { images: nextImages } = await refs.fetchImages(
      refs.currentQuery,
      refs.currentPage + 1
    );

    if (nextImages.length < 0) {
      refs.hideLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
  }
}
