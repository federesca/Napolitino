// Variables
const ingredientes = [
    {
        id:1,
        name : "Masa",
        img: '../Assests/ingredientes/MASA.png'
    },
    {
        id:2,
        name : "Salsa",
        img : '../Assests/ingredientes/salsa.png'
    },
    {
        id:3,
        name : "Cebolla Caramelizada",
        img : '../Assests/ingredientes/cebolla.png'
    },
    {
        id:4,
        name : "Boconccinos",
        img : '../Assests/ingredientes/bocconcinos.png'
    },
    {
        id:5,
        name : "Muzzarela",
        img : '../Assests/ingredientes/muzza.png'
    },
    {
        id:6,
        name : "Tomates Secos",
        img : '../Assests/ingredientes/tomates-secos.png'
    },
    {
        id:7,
        name : "Panceta",
        img : '../Assests/ingredientes/panceta.png'
    },
    {
        id:8,
        name : "Queso Azul",
        img : '../Assests/ingredientes/roque.png'
    },
    {
        id:9,
        name : "Huevo",
        img : '../Assests/ingredientes/huevo.png'
    },
    {
        id:10,
        name : "Provolone",
        img : '../Assests/ingredientes/provolone.png'
    },
]

let ingredientesFavoritos = [];

const contenedorIngredientes = document.querySelector(".contenedor-ingredientes");
const contenedorFavoritos = document.querySelector(".listado-favoritos");

obtenerDatosDeLocalStorage();

document.addEventListener('DOMContentLoaded', () => {

    mostrarIngredientes();
})

function mostrarIngredientes(){
    ingredientes.forEach((ingredientes) => {
        
        /* Mostras ingredientes en el html */
        
        const div = document.createElement('div');
        div.classList.add('card-dark');

        const imagen = document.createElement('img');
        imagen.src = ingredientes.img
        imagen.classList.add('imagen-ingrediente');

        const titulo = document.createElement('h2');
        titulo.classList.add('titulo-ingrediente');
        titulo.textContent = ingredientes.name;

        const btnAgregar = document.createElement('button');
        btnAgregar.classList.add('btn-favorito');
        btnAgregar.textContent = "Elegir ingrediente";
        btnAgregar.onclick = () => {
            agregarAFavorito(ingredientes.id);
        };

        div.appendChild(imagen);
        div.appendChild(titulo);
        div.appendChild(btnAgregar);

        contenedorIngredientes.appendChild(div);
    })
}

function agregarAFavorito(id) {
    const ingredienteFavorito = ingredientes.find( ingrediente => {
        return ingrediente.id === id;
    })

    ingredientesFavoritos.push(ingredienteFavorito);

    localStorage.setItem("ingredientesFavoritos", JSON.stringify(ingredientesFavoritos));

    console.log(ingredientesFavoritos);
    mostrarIngredientesFavoritos(ingredientesFavoritos);
}

function mostrarIngredientesFavoritos(arreglo){

    limpiarHTML();
    arreglo.forEach( ingrediente => {

        /* InnerHtml */
        contenedorFavoritos.innerHTML += `
            <div class = "card-dark">
                <img src = "${ingrediente.img}" class = "imagen-comida"/>
                <h2> ${ingrediente.name} </h2>
            </div>
        `
    })
}

function limpiarHTML() {
    contenedorFavoritos.innerHTML = "";
}

function obtenerDatosDeLocalStorage() {
    const localIngredientesFavoritos = localStorage.getItem('ingredientesFavoritos');

    if (localIngredientesFavoritos) {
        const array = JSON.parse(localIngredientesFavoritos);

        ingredientesFavoritos = array;

        mostrarIngredientesFavoritos(array);
    }
}

let count = 0;
//Boton agregar clickeado
$('.cart-btn').on('click', function (){
  let cart = $('.cart-nav');
  // Encontrar imagen clickeada
  let imgtodrag = $(this).parent('.buttons').parent('.content').parent('.card').find("img").eq(0);
  if (imgtodrag) {
    // Duplicar imagen
    const imgclone = imgtodrag.clone().offset({
      top: imgtodrag.offset().top,
      left: imgtodrag.offset().left
    }).css({
      'opacity': '0.8',
      'position': 'absolute',
      'height': '150px',
      'width': '150px',
      'z-index': '100'
    }).appendTo($('body')).animate({
      'top': cart.offset().top + 20,
      'left': cart.offset().left + 30,
      'width': 75,
      'height': 75
    }, 1000, 'easeInOutExpo');
    setTimeout(function(){
      count++;
      $(".cart-nav .item-count").text(count);
    }, 1500);
    imgclone.animate({
      'width': 0,
      'height': 0
    }, function(){
      $(this).detach()
    });
  }
});
