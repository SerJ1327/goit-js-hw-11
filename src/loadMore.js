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
  } catch (error) {
    console.error(error);
  }
}
