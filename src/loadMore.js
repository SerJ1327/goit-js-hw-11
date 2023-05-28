import refs from './index.js';

export default async function onLoadMore() {
  refs.currentPage += 1;
  try {
    const { images } = await refs.fetchImages(
      refs.currentQuery,
      refs.currentPage
    );
    if (images.length === 0) {
      refs.hideLoadMoreButton();
      refs.showEndOfResultsMessage();
      return;
    }

    refs.renderImages(images);
    refs.initializeLightbox();

    const { images: nextImages } = await refs.fetchImages(
      refs.currentQuery,
      refs.currentPage + 1
    );

    if (nextImages.length === 0) {
      refs.hideLoadMoreButton();
    }

    refs.lightbox.refs.refresh();
  } catch (error) {
    console.error(error);
  }
}
