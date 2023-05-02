const list = document.querySelector(".shopping-list");
const bill = document.querySelector(".bill");
const shippingFee = document.querySelector(".ship-fee");
const cart = document.querySelector(".cart-logo");
const closeBtn = document.querySelector(".close-btn");
const cartNumber = document.querySelector(".cart-number");
const navLogo = document.querySelector(".nav-logo");
const body = document.querySelector("body");
const aside = document.querySelector(".cart-aside");

window.addEventListener("DOMContentLoaded", function () {
  displayLocalStorage();
});
cart.addEventListener("click", function () {
  cart.classList.add("show-aside");
  navLogo.classList.add("dark-layer");
});

// closebtn is inside cart-logo, so need to stop event bubling
closeBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  cart.classList.remove("show-aside");
  navLogo.classList.remove("dark-layer");
});

body.addEventListener("click", function (e) {
  if (e.target != cart.querySelector("i")) {
    cart.classList.remove("show-aside");
    navLogo.classList.remove("dark-layer");
  }
});

aside.addEventListener("click", function (e) {
  e.stopPropagation();
});

function addToCart() {
  const cartBtns = document.querySelectorAll(".btn-cart");
  cartBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var chosenProduct = e.currentTarget.parentElement;
      var product = products.find(function (product) {
        if (product.name == chosenProduct.querySelector("h5").textContent) {
          return product;
        }
      });

      let itemNumber = 1;
      const id = new Date().getTime().toString();
      const item = document.createElement("article");
      item.classList.add("shopping-item");
      const attribute = document.createAttribute("data-id");
      attribute.value = id;
      item.setAttributeNode(attribute);
      item.innerHTML = `
                    <div class="item-img">
                      <img src=${product.url} alt="" />
                    </div>
                    <div class="item-info">
                      <h6 class="title">${product.name}</h6>
                      <p class="item-price" data-originalprice=${product.price}>${product.price}$</p>
                      <div class="item-quantity">
                      <button type="button" class="minus-btn">
                        <i class="fas fa-minus"></i>
                      </button>
                      <span class="quantity">${itemNumber}</span>
                      <button type="button" class="plus-btn">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    </div>
                    <div class="trash-btn-container">
                      <button type="button" class="trash-btn">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  `;

      addToLocalStorage(
        id,
        product.url,
        product.name,
        product.price,
        product.price,
        itemNumber
      );

      const trashBtn = item.querySelector(".trash-btn");
      const minusBtn = item.querySelector(".minus-btn");
      const plusBtn = item.querySelector(".plus-btn");
      trashBtn.addEventListener("click", deleteFromCart);

      const quantity = item.querySelector(".quantity");
      const price = item.querySelector(".item-price");
      const originalPrice = price.dataset.originalprice;

      list.appendChild(item);

      list.classList.add("hide-empty");

      minusBtn.addEventListener("click", function () {
        itemNumber = Number(quantity.textContent);
        if (itemNumber > 1) {
          itemNumber -= 1;
          quantity.textContent = itemNumber;
          price.textContent = `${originalPrice * itemNumber}$`;
        }
        calculateBill();
        calculateCartNumber();
        editLocalStorage(id, itemNumber, originalPrice * itemNumber);
      });
      plusBtn.addEventListener("click", function () {
        itemNumber = Number(quantity.textContent);
        itemNumber += 1;
        quantity.textContent = itemNumber;
        price.textContent = `${originalPrice * itemNumber}$`;
        calculateBill();
        calculateCartNumber();
        editLocalStorage(id, itemNumber, originalPrice * itemNumber);
      });
      checkDuplicate(item);
      calculateBill();
      calculateCartNumber();
    });
  });
}

function deleteFromCart(e) {
  const itemToDelete = e.currentTarget.parentElement.parentElement;
  const itemToDeleteID = itemToDelete.dataset.id;
  list.removeChild(itemToDelete);
  calculateBill();
  calculateCartNumber();
  removeFromLocalStorage(itemToDeleteID);
  if (list.children.length === 1) {
    list.classList.remove("hide-empty");
  }
}

function calculateBill() {
  let allItems = list.querySelectorAll(".shopping-item");
  allItems = Array.from(allItems);
  let allPrices = allItems.map(function (item) {
    return Number(item.querySelector(".item-price").textContent.split("$")[0]);
  });

  var totalBill = allPrices.reduce(function (sum, price) {
    return (sum += price);
  }, 0);
  bill.textContent = `${totalBill}$`;
  if (totalBill >= 30) {
    shippingFee.textContent = "0$";
  } else if (totalBill == 0) {
    shippingFee.textContent = "0$";
  } else {
    shippingFee.textContent = "5$";
  }
}

function calculateCartNumber() {
  let allItems = list.querySelectorAll(".shopping-item");
  allItems = Array.from(allItems);
  let allValues = allItems.map(function (item) {
    return Number(item.querySelector(".quantity").textContent);
  });

  var totalCart = allValues.reduce(function (sum, value) {
    return (sum += value);
  }, 0);
  cartNumber.textContent = `${totalCart}`;
}

function checkDuplicate(duplicateItem) {
  let allItems = list.querySelectorAll(".shopping-item");
  allItems = Array.from(allItems);
  allItems = allItems.slice(0, allItems.length - 1);
  if (allItems.length > 0) {
    allItems.forEach(function (originalItem) {
      if (
        originalItem.querySelector(".title").textContent ==
        duplicateItem.querySelector(".title").textContent
      ) {
        const id = originalItem.dataset.id;
        const quantity = originalItem.querySelector(".quantity");
        const price = originalItem.querySelector(".item-price");
        const originalPrice = price.dataset.originalprice;
        let itemNumber = Number(quantity.textContent);
        itemNumber += 1;
        quantity.textContent = itemNumber;
        price.textContent = `${originalPrice * itemNumber}$`;
        calculateBill();
        calculateCartNumber();
        editLocalStorage(id, itemNumber, originalPrice * itemNumber);
        list.removeChild(duplicateItem);
        removeFromLocalStorage(duplicateItem.dataset.id);
      }
    });
  }
}

// ****** LOCAL STORAGE **********

//add to local storage
function addToLocalStorage(id, url, name, singleprice, price, quantity) {
  const cartItem = {
    id: id,
    url: url,
    name: name,
    singleprice: singleprice,
    price: price,
    quantity: quantity,
  };
  let items = getLocalStorage();
  items.push(cartItem);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id != id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function editLocalStorage(id, count, editprice) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id == id) {
      item.quantity = count;
      item.price = editprice;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function displayLocalStorage() {
  let items = getLocalStorage();
  if (items.length > 0) {
    list.classList.add("hide-empty");
    items.forEach(function (item) {
      addItem(
        item.id,
        item.url,
        item.name,
        item.singleprice,
        item.price,
        item.quantity
      );
    });
  }
}

function addItem(id, url, name, singleprice, price, count) {
  const item = document.createElement("article");
  item.classList.add("shopping-item");
  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  item.setAttributeNode(attribute);
  item.innerHTML = `
                    <div class="item-img">
                      <img src=${url} alt="" />
                    </div>
                    <div class="item-info">
                      <h6 class="title">${name}</h6>
                      <p class="item-price" data-originalprice=${singleprice}>${price}$</p>
                      <div class="item-quantity">
                      <button type="button" class="minus-btn">
                        <i class="fas fa-minus"></i>
                      </button>
                      <span class="quantity">${count}</span>
                      <button type="button" class="plus-btn">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    </div>
                    <div class="trash-btn-container">
                      <button type="button" class="trash-btn">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  `;

  list.appendChild(item);
  const trashBtn = item.querySelector(".trash-btn");
  const minusBtn = item.querySelector(".minus-btn");
  const plusBtn = item.querySelector(".plus-btn");
  trashBtn.addEventListener("click", deleteFromCart);

  const quantity = item.querySelector(".quantity");
  const itemPrice = item.querySelector(".item-price");
  const originalPrice = itemPrice.dataset.originalprice;
  let itemNumber;
  minusBtn.addEventListener("click", function () {
    itemNumber = Number(quantity.textContent);
    if (itemNumber > 1) {
      itemNumber -= 1;
      quantity.textContent = itemNumber;
      itemPrice.textContent = `${originalPrice * itemNumber}$`;
    }
    editLocalStorage(id, itemNumber, originalPrice * itemNumber);
    calculateBill();
    calculateCartNumber();
  });
  plusBtn.addEventListener("click", function () {
    itemNumber = Number(quantity.textContent);
    itemNumber += 1;
    quantity.textContent = itemNumber;
    itemPrice.textContent = `${originalPrice * itemNumber}$`;
    editLocalStorage(id, itemNumber, originalPrice * itemNumber);
    calculateBill();
    calculateCartNumber();
  });

  calculateBill();
  calculateCartNumber();
}
