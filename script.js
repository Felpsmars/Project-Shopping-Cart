const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);
const emptyCart = query('.empty-cart');

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
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salesPrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salesPrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingText() {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  query('.items').appendChild(section);
}

async function loadComputers() {
  loadingText();
  const loadingTag = query('.loading');

  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  );

  const jsonFetch = await response.json();

  loadingTag.remove();

  const add = await jsonFetch.results.forEach((product) =>
    query('.items').appendChild(createProductItemElement(product))
  );

  return add;
}

async function addProduct(item) {
  try {
    const cart = query('.cart__items');
    const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
    const jsonFetch = await response.json();

    cart.appendChild(createCartItemElement(jsonFetch));
  } catch (error) {
    console.log(error);
  }
}

// troquei event pela desestruturação do { target } encurtando meu código

// Na linha 93 em getSkuFromProductItem(), o parametro retornado é ".item"
// ".item" que por sua vez retorna todos os elementos necessarios para o
// createCartItemElement

document.addEventListener('click', function ({ target }) {
  if (target.classList.contains('item__add')) {
    return addProduct(getSkuFromProductItem(target.parentNode));
  }
  if (target.classList.contains('empty-cart')) {
    const cart = query('.cart__items');
    cart.innerHTML = '';
  }
});

window.onload = () => {
  loadComputers();
};
