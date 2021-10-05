let productos = [];
let carrito = [];

$(document).ready(() => {
  $(document.body)
    .on('click', '.addToCart', agregarProductoAlCarrito)
    .on('click', '.comprarButtonClicked', comprarCarrito)
    .on('click', '.shoppingCartItem .buttonDelete', eliminarProductoDelCarrito)
    .on('change', '.shoppingCartItem .shoppingCartItemQuantity', cambiarCantidad);

  fetch('../mocks/boxes.json')
    .then((data) => data.json())
    .then((data) => {
      productos = data;
  
      mostrarProductos();
    });
});

function mostrarProductos() {
  const elementos = document.createElement('div');
	let contador = 0;

	elementos.classList.add("items");

	const row = document.createElement('div');

	row.classList.add("row");

	let elemento = "";

	productos.forEach((producto) => {
		elemento += 
      `<div class="col-12 col-md-6">
			  <div class="item shadow mb-4">
				  <h3 class="item-title">${producto.name}</h3>
				  <img class="item-image" src="${producto.img}">
				  <div class="item-details">
					  <h4 class="item-price">$ ${producto.price}</h4>
					  <button class="item-button btn btn-warning addToCart">Agregar al pedido</button>
				  </div>
			  </div>
		  </div>
      `;

		if(contador % 2 == 0 && contador > 0) {
			row.innerHTML = elemento;
			elementos.appendChild(row);
		} else {
			contador += 1;
		}
	});

	document.querySelector("#store").firstElementChild.appendChild(elementos);
}

function agregarProductoAlCarrito(event) {
  const button = event.target;
  const item = button.closest('.item');

  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
  const itemImage = item.querySelector('.item-image').src;

  const isAlreadyInCart = carrito.some(({ title }) => title === itemTitle);

  if (!isAlreadyInCart) {
    carrito = carrito.concat({
      title: itemTitle,
      price: itemPrice,
      image: itemImage,
      quantity: 1
    });
  } else {
    carrito = carrito.map((producto) => {
      return producto.title === itemTitle
        ? { ...producto, quantity: Number(producto.quantity) + 1 }
        : producto;
    });
  }

  mostrarProductoEnCarrito(itemTitle, itemPrice, itemImage);
}

function mostrarProductoEnCarrito(itemTitle, itemPrice, itemImage) {
  const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle');

  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      let elementQuantity = elementsTitle[i]
        .parentElement
        .parentElement
        .parentElement
        .querySelector('.shoppingCartItemQuantity');

      elementQuantity.value++;

      $('.toast').toast('show');

      updateShoppingCartTotal();
      return;
    }
  }

  const shoppingCartRow = document.createElement('div');
  const shoppingCartContent =
    `<div class="row shoppingCartItem">
      <div class="col-6">
        <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
          <img src=${itemImage} class="shopping-cart-image">
          <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
      </div>
      </div>
      <div class="col-2">
        <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
            <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
        </div>
      </div>
      <div class="col-4">
        <div class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
          <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
              value="1">
          <button class="btn btn-danger buttonDelete" type="button">X</button>
        </div>
      </div>
    </div>
    `;

  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);

  updateShoppingCartTotal();
}

function updateShoppingCartTotal() {
  let total = 0;

  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

  carrito.forEach((item) => {
    const { price, quantity } = item;
    const intPrice = Number(price.replace('$', ''));
    
    total = total + (intPrice * quantity);
  });

  const totalFormatted = `${total.toFixed(2)}$`;

  shoppingCartTotal.innerHTML = totalFormatted;
  
  mostrarCarritoFlotante(totalFormatted);
}

function eliminarProductoDelCarrito(event) {
  const button = event.target;

  const item = button.closest('.shoppingCartItem');
  const itemTitle = item.querySelector('.shoppingCartItemTitle').textContent;

  button.closest('.shoppingCartItem').remove();

  carrito = carrito.filter(({ title }) => title !== itemTitle);

  updateShoppingCartTotal();
}

function cambiarCantidad(event) {
  const input = event.target;

  if (input.value <= 0) {
    input.value = 1;
  }

  const item = $(input).closest('.shoppingCartItem');
  const itemTitle = item.find('.shoppingCartItemTitle').text();

  carrito = carrito.map((producto) => {
    return producto.title === itemTitle
      ? { ...producto, quantity: Number(input.value) }
      : producto;
  });

  updateShoppingCartTotal();
}

function comprarCarrito() {
  const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');

  shoppingCartItemsContainer.innerHTML = '';

  updateShoppingCartTotal();
}

function mostrarCarritoFlotante(total) {
  const carritoFlotante = $('.carrito-flotante');

  if (carritoFlotante) carritoFlotante.remove();

  if (carrito.length > 0) {
    let items = '';

    carrito.forEach(({ title, price, quantity }) => {
      items += `<div class="carrito-flotante-item">${title} - ${quantity}x - ${price}</div>`
    });

    $(document.body).append(
      `<div class="carrito-flotante">
        <div class="carrito-flotante-container">
          <div class="carrito-flotante-items">
            ${items}
          </div>
          <div class="carrito-flotante-checkout">
            <div class="carrito-flotante-total">${total}</div>
            <button
              class="btn btn-success ml-auto comprarButton" type="button" data-toggle="modal"
              data-target="#comprarModal"
            >
              Hacer pedido
            </button>
          </div>
        </div>
      </div>`
    );
  }
}