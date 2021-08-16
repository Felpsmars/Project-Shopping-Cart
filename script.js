const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);

//usando o metodo bind para encurtar os selectors do meu código

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// mudei os parametros da função abaixo para id, name, image.

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  //
}

function createCartItemElement({ id: sku, title: name, price: salesPrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salesPrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function loadComputers() {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  );

  const jsonFetch = await response.json();

  const add = await jsonFetch.results.forEach((product) =>
    query('.items').appendChild(createProductItemElement(product))
  );

  return add;
}

async function addProduct(item) {
  try {
    const cart = document.querySelector('.cart__items');
    const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
    const jsonFetch = await response.json();

    cart.appendChild(createCartItemElement(jsonFetch));
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('item__add')) {
    return addProduct(getSkuFromProductItem(event.target.parentElement));
  }
});

window.onload = () => {
  loadComputers();
};
