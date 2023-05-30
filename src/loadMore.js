import refs from './index.js';
import { currentPage } from './index.js';
import { currentQuery } from './index.js';
export default async function onLoadMore() {
  try {
    const { images } = await refs.fetchImages(currentQuery, currentPage);

    refs.renderImages(images);
    refs.lightbox.refresh();

    if (images.length < refs.PER_PAGE) {
      refs.hideLoadMoreButton();
      refs.showEndOfResultsMessage();
      return;
    }
  } catch (error) {
    console.error(error);
  }
}
