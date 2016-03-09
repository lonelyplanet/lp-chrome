function placeFetched(place) {
  const masthead = LP.utils.shuffle(place.mastheads).pop();

  const $wrapper = document.querySelector(".js-wrapper");

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
      return 2400;
    } else if (winWidth > 1024 && winWidth < 1920) {
      return 1920;
    } else {
      return 1024;
    }
  }());

  image.src = `https://lonelyplanetimages.imgix.net/${masthead.path}?w=${width}&auto=enhance&q=50&fit=crop`;

  contentFragment.textContent = masthead.attribution;
  $attribution.appendChild(contentFragment);

  const $image = document.querySelector(".js-masthead");

  image.onload = () => {
    $image.src = image.src;
    $image.className += " is-active";
  };

  const url = `https://www.lonelyplanet.com/${place.slug}`;
  document.querySelector(".js-twitter").addEventListener("click", (e) => {
    socialShare({ 
      network: "twitter", 
      text: `${place.name} ${strapline} ${url} via @lonelyplanet` 
    });
  });
  document.querySelector(".js-facebook").addEventListener("click", (e) => {
    socialShare({ 
      network: "facebook", 
      text:`${place.name} ${strapline} ${place.slug} via @lonelyplanet`, 
      url
    });
  });
}

function socialShare({ network, width=550, height=420, url, text }) {
  let winHeight = window.innerHeight,
      winWidth = window.innerWidth,
      left,
      top;

  left = Math.round((winWidth / 2) - (width / 2));
  top = winHeight > height ? Math.round((winHeight / 2) - (height / 2)) : 0;

  if (winHeight > height) {
    top = Math.round((winHeight / 2) - (height / 2));
  }

  let windowOptions = "toolbar=no,menubar=no,location=yes,resizable=no,scrollbars=yes",
      windowSize = `width=${width},height=${height},left=${left},top=${top}`;

  if (network === "twitter") {
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "share", `${windowOptions},${windowSize}`);
  }

  if (network === "facebook") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "share", `${windowOptions},${windowSize}`);
  }
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
