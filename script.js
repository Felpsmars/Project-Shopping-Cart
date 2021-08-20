const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);
const emptyCart = query('.empty-cart');

// usando o metodo bind para encurtar os selectors do meu código

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
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// utilizei o unary operator abaxio para transformar a string capturada em numero.
// https://www.digitalocean.com/community/tutorials/javascript-unary-operators-simple-and-useful

const sumPrices = async () => {
  const cartItem = Array.from(document.querySelectorAll('.cart__item'));
  const cartInnerText = cartItem.map(({ innerText }) => innerText);
  const prices = cartInnerText.map((string) => +string.split('PRICE: $')[1]);
  const addUp = prices.reduce((sum, current) => sum + current, 0);

  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = addUp;
};

function cartItemClickListener(event) {
  const cart = query('.cart__items');
  cart.removeChild(event.target);
  sumPrices();
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
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );

  const jsonFetch = await response.json();

  loadingTag.remove();

  const add = await jsonFetch.results.forEach((product) =>
    query('.items')
    .appendChild(createProductItemElement(product)));
  return add;
}

// function sumPrices({ price: salesPrice }) {
// const totalPrice = document.querySelector('.total-prices').innerText;
// return (totalPrice.innerText = `Total: $${salesPrice}`);
// }

async function addProduct(item) {
  try {
    const cart = query('.cart__items');
    const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
    const jsonFetch = await response.json();

    cart.appendChild(createCartItemElement(jsonFetch));
    await sumPrices();
  } catch (error) {
    console.log(error);
  }
}

// troquei event pela desestruturação do { target } encurtando meu código

// No getSkuFromProductItem(), o parametro retornado é ".item"
// ".item" que por sua vez retorna todos os elementos necessarios para o
// createCartItemElement

document.addEventListener('click', function ({ target }) {
  if (target.classList.contains('item__add')) {
    return addProduct(getSkuFromProductItem(target.parentNode));
  }
  if (target.classList.contains('empty-cart')) {
    const cartTag = query('section .cart__items');
    cartTag.innerHTML = '';
  }
});

window.onload = () => {
  loadComputers();
};
