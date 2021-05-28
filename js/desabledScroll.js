window.disableScroll = function () {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dataset.scrollY = window.scrollY;
  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    overflow: hidden;
    height: 110vh;
    width: 100%;
    padding-right: ${widthScroll}px;
  `;
};

window.enableScroll = function () {
  document.body.style.cssText = ``;
  window.scroll({ top: document.body.scrollY });
};
