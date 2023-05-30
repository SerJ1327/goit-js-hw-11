import refs from './index.js';
import { currentPage } from './index.js';
import { currentQuery } from './index.js';
export default async function onLoadMore() {
  try {
    const { images } = await refs.fetchImages(currentQuery, currentPage);

    console.log(images.length);

    if (images.length < refs.PER_PAGE) {
      refs.hideLoadMoreButton();
      refs.showEndOfResultsMessage();
      return;
    }

    refs.renderImages(images);
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}
