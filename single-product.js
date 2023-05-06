const productLink = new URLSearchParams(location.search);
const queryProduct = Number(productLink.get("id"));

const mainImg = document.querySelector(".main-img img");
const otherImgs = document.querySelector(".other-img");

const detailContent = document.querySelector(".detail-content");

let tabBtns = document.querySelectorAll(".tab-btn");
let tabContent = document.querySelectorAll(".tab-content");
const desText = document.querySelector("#description p");

tabBtns = [...tabBtns];
tabContent = [...tabContent];

window.addEventListener("DOMContentLoaded", displaySingleProduct);

function displaySingleProduct() {
  const singleProduct = products.find(function (product) {
    if (product.id === queryProduct) {
      return product;
    }
  });

  var productToDisplay = `
    <h2 class="item-name">${singleProduct.name}</h2>
            <h3>${singleProduct.price}$</h3>
            <button type="button" class="btn-cart large-btn">
              add to cart
            </button>`;
  detailContent.innerHTML = productToDisplay;
  addToCart();

  mainImg.src = singleProduct.url[0];
  var imgList = singleProduct.url.map(function (url) {
    return `<img class="mini-img" src="${url}" />`;
  });
  imgList = imgList.join("");
  otherImgs.innerHTML = imgList;
  otherImgs.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("mini-img")) {
      mainImg.src = e.target.src;
    }
  });

  desText.textContent = singleProduct.des;
}

function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `please check again ${element} selector, no such element exists`
  );
}

function getTabBtn(id) {
  var tabBtn = tabBtns.find(function (tab) {
    if (tab.dataset.id == id) {
      return tab;
    }
  });
  return tabBtn;
}

class Tab {
  constructor(content, btn) {
    this.content = content;
    this.btn = btn;

    this.btn.addEventListener(
      "click",
      function () {
        this.activeBtn();
        this.activeTab();
      }.bind(this)
    );
  }
  activeBtn = function () {
    tabBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });
    this.btn.classList.add("active");
  };
  activeTab = function () {
    tabContent.forEach(function (content) {
      content.classList.remove("active");
    });
    this.content.classList.add("active");
  };
}

const description = new Tab(
  getElement("#description"),
  getTabBtn("description")
);
const reviews = new Tab(getElement("#reviews"), getTabBtn("reviews"));
const returnShipping = new Tab(
  getElement("#return-shipping"),
  getTabBtn("return-shipping")
);
