const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

slides.forEach(function (slide, index) {
  slide.style.left = `${index * 100}%`;
});

let count = 0;

next.addEventListener("click", function () {
  clearInterval(auto);
  count++;
  carousal();
  auto = setInterval(autoCarousal, 3000);
});

prev.addEventListener("click", function () {
  clearInterval(auto);
  count--;
  carousal();
  auto = setInterval(autoCarousal, 3000);
});

function carousal() {
  if (count == slides.length) {
    count = 0;
  }
  if (count < 0) {
    count = slides.length - 1;
  }
  slides.forEach(function (slide) {
    slide.style.transform = `translateX(-${count * 100}%)`;
  });
}

function autoCarousal() {
  count++;
  if (count == slides.length) {
    count = 0;
  }
  slides.forEach(function (slide) {
    slide.style.transform = `translateX(-${count * 100}%)`;
  });
}

var auto = setInterval(autoCarousal, 3000);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const sale = document.querySelector(".sale");
const items = document.querySelectorAll(".deadline-format h4");

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

const futureDate = new Date(todayYear, todayMonth, todayDate + 2, 23, 0, 0);

const year = futureDate.getFullYear();
const month = months[futureDate.getMonth()];
const dayofweek = weekdays[futureDate.getDay()];
const date = futureDate.getDate();
const hour = futureDate.getHours();
const min = futureDate.getMinutes();

sale.innerHTML = `Our sales ends on ${dayofweek}, ${date} ${month} ${year} ${hour}:0${min}`;

function remainTime() {
  let futureTime = futureDate.getTime();
  let now = new Date().getTime();
  let t = futureTime - now;

  const onesec = 1000;
  const onemin = 60 * 1000;
  const onehour = 60 * 60 * 1000;
  const oneday = 60 * 60 * 24 * 1000;

  // cal the remaining time
  let days = Math.floor(t / oneday);
  let hours = Math.floor((t % oneday) / onehour);
  let mins = Math.floor((t % onehour) / onemin);
  let secs = Math.floor((t % onemin) / onesec);

  let values = [days, hours, mins, secs];
  // format
  function format(num) {
    if (num < 10) {
      num = `0${num}`;
    }
    return num;
  }

  //pass value
  items.forEach(function (item, index) {
    item.innerHTML = format(values[index]);
  });
}

setInterval(remainTime, 1000);

const saleSlides = document.querySelectorAll(".sale-slide");
const nextSale = document.querySelector(".next-sale");
const prevSale = document.querySelector(".prev-sale");

window.addEventListener("DOMContentLoaded", function () {
  displaySale();
});

function displaySale() {
  saleProducts = products.filter(function (product) {
    if (product.sale == true) {
      return product;
    }
  });
  var saleItems = saleProducts.map(function (product) {
    return `<div class="img-container">
            <img src=${product.url[0]} alt="" class="img-sale" />
            <span>-${product.percent}%</span>
            <h5 class="item-name"><a href="single-product.html?id=${product.id}">${product.name}</a></h5>
            <p>price: ${product.price}$</p>
            <button type="button" class="btn-cart">add to cart</button>
          </div>`;
  });
  var saleList = [
    saleItems.slice(0, 4).join(""),
    saleItems.slice(4, saleItems.length).join(""),
  ];

  saleSlides.forEach(function (slide, index) {
    slide.innerHTML = saleList[index];
  });
  saleSlider();
  addToCart();
}

function saleSlider() {
  saleSlides.forEach(function (slide, index) {
    slide.style.left = `${index * 100}%`;
  });

  let countSale = 0;

  nextSale.addEventListener("click", function () {
    countSale++;
    carousalSale();
  });

  prevSale.addEventListener("click", function () {
    countSale--;
    carousalSale();
  });

  function carousalSale() {
    if (countSale == saleSlides.length) {
      countSale = 0;
    }
    if (countSale < 0) {
      countSale = saleSlides.length - 1;
    }
    saleSlides.forEach(function (slide) {
      slide.style.transform = `translateX(-${countSale * 100}%)`;
    });
  }
}

// const collections = document.querySelectorAll(
//   ".collection-container .collection"
// );

// collections.forEach(function (collection) {
//   collection.addEventListener("click", function () {
//     window.location.href = `product.html?cate=all&collection=${collection.textContent.toLowerCase()}`;
//   });
// });

// open video when click on each collection

function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `please check again ${element} selector, no such element exists`
  );
}

class Collection {
  constructor(element) {
    this.collection = element;
    this.source = element.dataset.video;
    this.modal = document.querySelector(".modal");
    this.modalCloseBtn = document.querySelector(".modal-close-btn");
    this.video = document.querySelector("iframe");
    //bind
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    //event
    this.collection.addEventListener("click", this.openModal);
  }
  openModal = function () {
    this.displayVideo();
    this.modal.classList.add("open");
    this.modalCloseBtn.addEventListener("click", this.closeModal);
  };
  closeModal = function () {
    this.modal.classList.remove("open");
    this.video.src = "";
    this.modalCloseBtn.removeEventListener("click", this.closeModal);
  };
  displayVideo = function () {
    this.video.src = this.source;
  };
}

const spring = new Collection(getElement(".spring"));
const office = new Collection(getElement(".office"));
const urban = new Collection(getElement(".urban"));
const summer = new Collection(getElement(".summer"));
