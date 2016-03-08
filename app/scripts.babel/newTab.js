function placeFetched(place) {
  const masthead = LP.utils.shuffle(place.mastheads).pop();

  const image = new Image();
  const $attribution = document.querySelector(".attribution");
  const contentFragment = document.createDocumentFragment();

  const $inspire = document.querySelector(".js-inspire");
  const placeFragment = document.createDocumentFragment();

  const strapline = masthead.strapline ? masthead.strapline : "";
  placeFragment.textContent = `${place.name}`;
  $inspire.appendChild(placeFragment);

  const $inspireLink = document.querySelector(".js-inspire-link");
  $inspireLink.href = `https://www.lonelyplanet.com/${place.slug}?utm_source=chrome-ext`;

  const $strapline = document.querySelector(".js-strapline");
  $strapline.textContent = strapline;

  const width = (function() {
    const winWidth = document.body.offsetWidth;
    if (winWidth >= 1920) {
      return 1920;
    } else if (winWidth > 1024 && winWidth < 1920) {
      return 1366;
    } else {
      return 1024;
    }
  }());

  image.src = `https://lonelyplanetimages.imgix.net/${masthead.path}?w=${width}&auto=enhance&q=50&fit=crop`;

  contentFragment.textContent = masthead.attribution;

  image.onload = function() {
    document.body.style.backgroundImage = `url(${image.src})`;
    document.body.className = "";

    $attribution.appendChild(contentFragment);
  };
}


(function() { 
  const place = localStorage.getItem("place"), date = localStorage.getItem("last-updated");
  
  if (place && (date && (new Date() - new Date(date)) < 3600000)) {
    placeFetched(JSON.parse(place));
  } else {
    LP.core.fetch("https://0hhmjq0t6i.execute-api.us-east-1.amazonaws.com/prod/placeFetch").then(function(place) {
      localStorage.setItem("place", JSON.stringify(place));
      localStorage.setItem("last-updated", new Date());
      placeFetched(place);
    });
  }
}());
