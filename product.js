const params = new URLSearchParams(location.search);
const queryCategory = params.get("cate");
const queryCollection = params.get("collection");
const categoriesList = document.querySelector(".categories-list");
const productArea = document.querySelector(".product-area");
const collectionList = document.querySelector(".collection-list");

window.addEventListener("DOMContentLoaded", function () {
  filter();
});

function filter() {
  //display categories filters on aside
  displayCategories();
  // display collection filters on aside
  displayCollection();

  // display products according to filter from dropdown menu
  if (queryCategory == "all") {
    displayProduct(products);
    addToCart();
  } else {
    var filtered_products = products.filter(function (product) {
      if (product.category == queryCategory) {
        return product;
      }
    });
    displayProduct(filtered_products);
    addToCart();
    //highlight the category chosen from drop down menu
    highlight(categoriesList, queryCategory);
  }
  //display products according to collection filter from main page
  if (queryCollection) {
    var filtered_products = products.filter(function (product) {
      if (product.collection == queryCollection) {
        return product;
      }
    });
    displayProduct(filtered_products);
    addToCart();
    //highlight the collection chosen from main page
    highlight(categoriesList, queryCategory);
    highlight(collectionList, queryCollection);
  }

  // set filter function from filter aside
  let cateId = queryCategory;
  let collectId = queryCollection;

  categoriesList.addEventListener("click", function (e) {
    cateId = e.target.dataset.id;
    if (cateId) {
      // remove background from all a
      var allCategories = categoriesList.querySelectorAll("a");
      allCategories.forEach(function (category) {
        category.style.background = "transparent";
      });
      // highlight the clicked a
      e.target.style.background = "lightgray";

      //display products according to filter from aside
      // 2 way filtered, filter both on category and collection
      if (collectId == undefined) {
        if (cateId == "all") {
          displayProduct(products);
          addToCart();
        } else {
          var filtered_products = products.filter(function (product) {
            if (product.category == cateId) {
              return product;
            }
          });
          displayProduct(filtered_products);
          addToCart();
        }
      } else {
        if (cateId == "all") {
          var filtered_products = products.filter(function (product) {
            if (product.collection == collectId) {
              return product;
            }
          });
          displayProduct(filtered_products);
          addToCart();
        } else {
          var filtered_products = products.filter(function (product) {
            if (
              (product.category == cateId) &
              (product.collection == collectId)
            ) {
              return product;
            }
          });
          displayProduct(filtered_products);
          addToCart();
        }
      }
    }
  });

  //filter collection
  collectionList.addEventListener("click", function (e) {
    collectId = e.target.dataset.id;
    if (collectId) {
      var collectionLinks = collectionList.querySelectorAll("a");
      collectionLinks.forEach(function (link) {
        link.style.backgroundColor = "transparent";
      });
      e.target.style.background = "lightgray";
      if (cateId == "all") {
        var collection_filtered_products = products.filter(function (product) {
          if (product.collection == collectId) {
            return product;
          }
        });
      } else {
        var collection_filtered_products = products.filter(function (product) {
          if (
            (product.collection == collectId) &
            (product.category == cateId)
          ) {
            return product;
          }
        });
      }

      displayProduct(collection_filtered_products);
      addToCart();
    }
  });
}

function displayCategories() {
  var categories = products.reduce(
    function (catArray, product) {
      if (!catArray.includes(product.category)) {
        catArray.push(product.category);
      }
      return catArray;
    },
    ["all"]
  );

  var catList = categories.map(function (category) {
    return `<li><a data-id=${category}>${category}</a></li>`;
  });
  catList = catList.join("");
  categoriesList.innerHTML = catList;
}

function displayCollection() {
  var collections = products.reduce(function (catArray, product) {
    if (!catArray.includes(product.collection)) {
      catArray.push(product.collection);
    }
    return catArray;
  }, []);
  var collectList = collections.map(function (collection) {
    return `<li><a data-id=${collection}>${collection}</a></li>`;
  });
  collectList = collectList.join("");
  collectionList.innerHTML = collectList;
}

function highlight(list, query) {
  var allItems = list.querySelectorAll("a");
  allItems.forEach(function (item) {
    if (item.dataset.id == query) {
      item.style.background = "lightgray";
    }
  });
}

function displayProduct(product_array) {
  var all_products = product_array.map(function (product) {
    if (product.sale) {
      return `<div class="img-container">
            <img src=${product.url[0]} alt="" class="img-sale" />
            <span>-${product.percent}%</span>
            <h5 class="item-name"><a href="single-product.html?id=${product.id}">${product.name}</a></h5>
            <p>price: ${product.price}$</p>
            <button type="button" class="btn-cart">add to cart</button>
          </div>`;
    } else {
      return `<div class="img-container">
            <img src=${product.url[0]} alt="" class="img-sale" />
            <h5 class="item-name"><a href="single-product.html?id=${product.id}">${product.name}</a></h5>
            <p>price: ${product.price}$</p>
            <button type="button" class="btn-cart">add to cart</button>
          </div>`;
    }
  });
  all_products = all_products.join("");
  if (all_products == "") {
    productArea.innerHTML = `<h5>Sorry, there is no items with this filter</h5>`;
  } else {
    productArea.innerHTML = all_products;
  }
}
