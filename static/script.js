//funcion para que al loguearse cargue en el centro el html con ajax
$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
        
        // Obtén los datos del formulario
        var formData = $(this).serialize();
        
        // Enviar solicitud AJAX al servidor
        $.ajax({
            type: 'POST',
            url: '/login',
            data: formData,
            success: function(response) {
                // Actualizar el contenido del div centro con el contenido devuelto por el servidor
                $('.centro').html(response);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});

//funcion para actualizar el contador con cada click
document.addEventListener("DOMContentLoaded", function() {
    var clickImage = document.getElementById("clickImage");
    var clickCount = document.getElementById("clickCount");
    var roturaBloqueTierra = parseInt(clickImage.getAttribute('data-rotura'));
    var prices = document.querySelectorAll(".price");
    var pricesUpgrade = document.querySelectorAll(".store-item");

    clickImage.addEventListener("click", function() {
        // Incrementar el contador en el botón clickImage
        var count = parseInt(parsePrice(clickCount.textContent)) + 1;
        clickCount.textContent = formatPrice(count);

        // Actualizar el contador en el botón clickImage
        actualizarContadorEnClickImage(count);

        // Cambiar el color del texto de los precios según el contador
        actualizarColorPrecios(prices, count,pricesUpgrade);
    });
});

function cambioFondo(bloque){
    // Crear una nueva regla de estilo CSS para el pseudoelemento ::before
    const newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(`
        #sidebar::before {
            content: ""; 
            position: absolute; 
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-color: rgba(240, 240, 240, 0.8); 
            filter: blur(5px); 
            opacity: 0.8; 
            z-index: -1; 
            background-image: var(--background-image);
        }
    `));
    document.head.appendChild(newStyle);

    // Cambiar el fondo del sidebar según el tipo de bloque
    const sidebar = document.getElementById("sidebar");

    switch (bloque) {
        case "bosque":
            sidebar.style.setProperty('--background-image', 'url("/static/bosque.png")');
            break;
        case "desierto":
            sidebar.style.setProperty('--background-image', 'url("/static/desierto.png")');
            break;
        case "mina":
            sidebar.style.setProperty('--background-image', 'url("/static/mina.png")');
            break;
        case "caverna":
            sidebar.style.setProperty('--background-image', 'url("/static/caverna.png")');
            break;
        default:
            sidebar.style.setProperty('--background-image', 'none');
    }
}

//funcion para actualizar la imagen que se muestra en el contador
function actualizarContadorEnClickImage(count) {
    const clickImage = document.getElementById("clickImage");
    const roturasBloqueString = clickImage.getAttribute('data-rotura');
    const roturasBloque = JSON.parse(roturasBloqueString);

    const bloques = [
        { nombre: "tierra", rotura: 23542, siguiente: "madera", fondo: "bosque" },
        { nombre: "madera", rotura: 134000, siguiente: "grava", fondo: "bosque" },
        { nombre: "grava", rotura: 752050, siguiente: "arcilla", fondo: "desierto" },
        { nombre: "arcilla", rotura: 1432532, siguiente: "piedra", fondo: "desierto" },
        { nombre: "piedra", rotura: 230005000, siguiente: "carbon", fondo: "mina" },
        { nombre: "carbon", rotura: 832030000, siguiente: "hierro", fondo: "mina" },
        { nombre: "hierro", rotura: 153004300000, siguiente: "redstone", fondo: "mina" },
        { nombre: "redstone", rotura: 767003020000, siguiente: "oro", fondo: "mina" },
        { nombre: "oro", rotura: 256025000000000, siguiente: "lapislazuli", fondo: "mina" },
        { nombre: "lapislazuli", rotura: 843000400000000, siguiente: "diamante", fondo: "mina" },
        { nombre: "diamante", rotura: 5010020000000000, siguiente: "piedrabase", fondo: "caverna" },
        { nombre: "piedrabase", rotura: 40000000000000000, siguiente: "none", fondo: "caverna" },
    ];

    let bloqueActual;
    let siguienteBloque;

    // Encontrar el bloque actual según el contador
    for (let i = 0; i < bloques.length; i++) {
        const bloque = bloques[i];
        if (count < bloque.rotura) {
            bloqueActual = bloque;
            siguienteBloque = bloques[i + 1];
            break;
        }
    }

    if (!bloqueActual) {
        console.log("Se ha roto el ultimo bloque");
        document.body.style.animation = "desintegracion 1s ease-in-out forwards";

        // Cambiar el fondo del body después de que termine la animación de desintegración
        // Fin del juego
        document.body.addEventListener('animationend', function() {
            document.body.classList.add('fin');
        });
        return;
    }
    
    if (count < bloqueActual.rotura / 2) {
        // Cargar la imagen correspondiente al bloque actual
        clickImage.src = `/static/${bloqueActual.nombre}.png`;
        cambioFondo(bloqueActual.fondo)
        document.getElementById("container").querySelector("h1").textContent = bloqueActual.nombre.charAt(0).toUpperCase() + bloqueActual.nombre.substring(1);
    } else if (count < bloqueActual.rotura / 1.5) {
        // Cargar la imagen rota correspondiente al bloque actual
        clickImage.src = `/static/${bloqueActual.nombre}Rota.png`;
        cambioFondo(bloqueActual.fondo)
        document.getElementById("container").querySelector("h1").textContent = bloqueActual.nombre.charAt(0).toUpperCase() + bloqueActual.nombre.substring(1);
    } else if (count < bloqueActual.rotura / 1.2) {
        // Cargar la imagen rota 2 correspondiente al bloque actual
        clickImage.src = `/static/${bloqueActual.nombre}Rota2.png`;
        cambioFondo(bloqueActual.fondo)
        document.getElementById("container").querySelector("h1").textContent = bloqueActual.nombre.charAt(0).toUpperCase() + bloqueActual.nombre.substring(1);
    } else {
        // Aplicar animación CSS
        clickImage.style.animation = "roturaAnimacion 1s ease-in-out";
        
        if (siguienteBloque) {
            cambioFondo(siguienteBloque.fondo)
        }
        
        // Esperar un tiempo antes de cargar la siguiente imagen
        setTimeout(() => {
            clickImage.style.animation = ""; // Restablecer la animación
            console.log(`Cargando ${siguienteBloque.nombre}.png`);
            clickImage.src = `/static/${siguienteBloque.nombre}.png`;
            document.getElementById("container").querySelector("h1").textContent = siguienteBloque.nombre.charAt(0).toUpperCase() + siguienteBloque.nombre.substring(1);
        }, 1000); 
    }
}
    


//funcion para cambiar el color de los precios 
function actualizarColorPrecios(prices, count,pricesUpgrades) {
    prices.forEach(function(price) {
        var priceValue = parseInt(parsePrice(price.textContent));
        if (priceValue <= count) {
            price.style.color = 'green'; 
        } else {
            price.style.color = 'red'; 
        }
    });

    pricesUpgrades.forEach(function(priceUpgrade) {
        var priceValueUpgrade = parseInt(priceUpgrade.getAttribute("data-price"));

        if (priceValueUpgrade <= count) {
            priceUpgrade.setAttribute("data-color", "green");
        } else {
            priceUpgrade.setAttribute("data-color", "red"); 
        }
    });
}

//funcion para comprar items
function comprar(producto) {
    // Obtener el contador y los elementos específicos del producto clickeado
    var contador = document.getElementById("clickCount");
    var precioElemento = producto.querySelector(".price");
    var enPropiedadElemento = producto.querySelector(".enPropiedad");

    // Obtener el precio y la cantidad actual del producto clickeado
    var precio = parseInt(parsePrice(precioElemento.textContent));
    var count = parseInt(parsePrice(contador.textContent)); // Obtener el valor actual del contador aquí

    // Verificar si el precio es menor o igual que la cantidad actual
    if (precio <= count) {
        // Restar el precio de la cantidad actual
        contador.textContent = formatPrice(count - precio);
        // Sumar 1 al enPropiedad
        enPropiedadElemento.textContent = parseInt(enPropiedadElemento.textContent) + 1;
        // Subir el precio un 10%
        var nuevoPrecio = formatPrice(Math.ceil(precio * 1.132)); // Redondear hacia arriba al número entero más cercano

        precioElemento.textContent = nuevoPrecio;
        
        // Actualizar el contador en el botón del clickImage
        actualizarContadorEnClickImage(parseInt(parsePrice(contador.textContent)));
        var pricesUpgrade = document.querySelectorAll(".store-item");
        
        // Actualizar el color del texto de los precios
        actualizarColorPrecios(document.querySelectorAll(".price"), parseInt(contador.textContent),pricesUpgrade);
        checkHoverStatus();
    }
}

//poner en el titulo el contador
document.addEventListener("DOMContentLoaded", function() {
    // Función para actualizar el título
    function updateTitle() {
        // Obtener el elemento con el ID "clickCount"
        var clickCountElement = document.getElementById("clickCount");
        
        // Obtener el contenido del elemento clickCount
        var clickCountValue = clickCountElement.textContent;
        
        // Actualizar el título con el contenido de clickCount
        document.title = clickCountValue;
    }

    // Actualizar el título cada 3 segundos
    setInterval(updateTitle, 3000);
});

// Función para cargar el archivo de configuración JSON
function cargarConfiguracion(callback) {
    // Realizar una solicitud AJAX para cargar el archivo de configuración
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "/configuracion", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Parsear el JSON y pasar los datos a la función de callback
            var configuracion = JSON.parse(xhr.responseText);
            callback(configuracion);
        }
    };
    xhr.send(null);
}

// Función para actualizar el contador cada segundo para la producción
function actualizarContadorPorSegundo(configuracion) {
    // Verificar si hay al menos un "Steve" o un "Zombie" en propiedad
    var steveEnPropiedad = false;
    var zombieEnPropiedad = false;

    // Iterar sobre los elementos productName para buscar "Steve" o "Zombie" en propiedad
    document.querySelectorAll(".productName").forEach(function(elemento) {
        var productName = elemento.textContent.trim();
        var enPropiedadElemento = elemento.parentNode.querySelector('.enPropiedad');
        
        if (enPropiedadElemento) {
            var enPropiedad = parseInt(enPropiedadElemento.textContent);
            if (!isNaN(enPropiedad) && enPropiedad > 0) {
                if (productName === "Steve") {
                    steveEnPropiedad = true;
                } else if (productName === "Zombie") {
                    zombieEnPropiedad = true;
                }
            }
        }
    });
    
    // Si al menos uno de ellos está en propiedad, actualizar el contador
    if (steveEnPropiedad || zombieEnPropiedad) {
        var produccionPorSegundo = 0;
        // Obtener todos los elementos con la clase "enPropiedad"
        var enPropiedadElementos = document.querySelectorAll(".enPropiedad");

        // Obtener el contador actual
        var contadorActual = parseInt(parsePrice(document.getElementById("clickCount").textContent));
        
        // Iterar sobre cada elemento y actualizar su valor
        enPropiedadElementos.forEach(function(elemento) {
            // Obtener el tipo de entidad (nombre del producto)
            var tipoEntidad = elemento.parentNode.parentNode.querySelector('.productName').textContent.trim();
            
            // Obtener el valor de producción por segundo para este tipo de entidad desde la configuración
            var produccion = configuracion.produccion[tipoEntidad];
            var usuarioSesion = document.querySelector('.menu').getAttribute('data-sesion')
            var multiplicador = 1;
            var multiplicadorBloques = 1;
    
            // Buscar el objeto del usuario en sesión en la lista de usuarios
            var usuarioEnSesion = configuracion.usuarios.find(function(usuario) {
                return usuario.username === usuarioSesion;
            });

            // Verificar si se encontró el usuario en sesión y obtener el valor del multiplicador según el tipo de entidad
            if (usuarioEnSesion) {
                multiplicador = usuarioEnSesion["mtp" + tipoEntidad];
                multiplicadorBloques = usuarioEnSesion['produccionPorSegundo'];
            }
            // Obtener la cantidad de esta entidad en propiedad
            var cantidad = parseInt(elemento.textContent);
            // Calcular el incremento en el contador para esta entidad
            var incremento = produccion * cantidad * multiplicador * multiplicadorBloques;
            
            // Incrementar el contador con el valor calculado
            if(cantidad > 0){
                contadorActual += incremento;
                produccionPorSegundo += produccion * cantidad * multiplicador * multiplicadorBloques;
            }

            desbloquear(elemento);
            mostrarSolo2Bloqueados();
            mostrarUpgrades();
            actualizarContadorEnClickImage(contadorActual)
        });

        // Actualizar el elemento <p> con la producción por segundo
        document.getElementById("porSegundo").textContent = "Por segundo: " + formatPrice(produccionPorSegundo);
        
        // Actualizar el contador en la interfaz
        document.getElementById("clickCount").textContent = formatPrice(contadorActual);
        var pricesUpgrade = document.querySelectorAll(".store-item");
        actualizarColorPrecios(document.querySelectorAll(".price"), contadorActual,pricesUpgrade);
    }
}


setInterval(function() {
    cargarConfiguracion(function(configuracion) {
        actualizarContadorPorSegundo(configuracion);
    });
}, 1000); 


function desbloquear(element){
    var productName = element.parentNode.parentNode.querySelector('.productName').textContent;
    
    var price = parseInt(parsePrice(element.parentNode.querySelector('.price').textContent));
    var count = parseInt(parsePrice(document.getElementById("clickCount").textContent));
    var requiredClicks = Math.ceil(price * 0.7);

    if (count >= requiredClicks && productName != "Steve") {
        var contenedorProducto = element.closest('.product-container');
        var productImage = contenedorProducto.querySelector('.productImage');

        element.classList.remove('blocked');
        productImage.src = "/static/"+contenedorProducto.getAttribute("data-tittle")+".png";
        element.parentNode.parentNode.querySelector('.productName').textContent = contenedorProducto.getAttribute("data-tittle");
    }
}

function mostrarSolo2Bloqueados(){
    var contador = 0;
    // Obtener todos los elementos con la clase 'productName'
    var productContainers = document.querySelectorAll('.product-container');
    
    // Iterar sobre los dos primeros elementos y mostrar su contenido
    for (var i = 0; i < productContainers.length; i++) {
        
        var productName = productContainers[i].querySelector('.productName').textContent;
        if (productName == "???"){
            productContainers[i].style.display = 'flex';
            contador++;
            if (contador > 2){
                productContainers[i].style.display = 'none'; 
            }
        }
 
    }
}

var prices = document.querySelectorAll('.price');

prices.forEach(function(priceElement) {
    var price = parseInt(priceElement.textContent);
    var formattedPrice = formatPrice(price);
    priceElement.textContent = formattedPrice;
});

function formatPrice(num) {
    if (num >= 1000000000000000) {
        return (num / 1000000000000000).toFixed(3).replace(/\.?0+$/, '') + ' C';
    } else if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(3).replace(/\.?0+$/, '') + ' T';
    } else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(3).replace(/\.?0+$/, '') + ' B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(3).replace(/\.?0+$/, '') + ' M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(3).replace(/\.?0+$/, '') + ' K';
    } else {
        return num.toString();
    }
}

function parsePrice(str) {
    const lastChar = str.slice(-1);
    let multiplier = 1;
    switch (lastChar) {
        case 'C':
            multiplier = 1000000000000000;
            break;
        case 'T':
            multiplier = 1000000000000;
            break;
        case 'B':
            multiplier = 1000000000;
            break;
        case 'M':
            multiplier = 1000000;
            break;
        case 'K':
            multiplier = 1000;
            break;
        default:
            return parseFloat(str);
    }
    return parseFloat(str.slice(0, -1)) * multiplier;
}

function mostrarPopup(container) {
    return function(event) {
        fetch('/configuracion')
            .then(response => response.json())
            .then(data => {
                // Obtener el número asignado a cada producto
                const producciones = data.produccion;
                const titulo = container.querySelector('.title').textContent;
                // Obtener el valor de producción específico para "Steve"
                const produccion = producciones[titulo];

                // Obtener las coordenadas del contenedor del producto
                const rect = container.getBoundingClientRect(); 

                // Obtener el elemento del "popup"
                const popup = document.querySelector('.popup');
                popup.querySelector('.title').textContent = titulo;

                var usuarioSesion = document.querySelector('.menu').getAttribute('data-sesion')
                var multiplicador = 1;
        
                // Buscar el objeto del usuario en sesión en la lista de usuarios
                var usuarioEnSesion = data.usuarios.find(function(usuario) {
                    return usuario.username === usuarioSesion;
                });

                // Verificar si se encontró el usuario en sesión y obtener el valor del multiplicador según el tipo de entidad
                if (usuarioEnSesion) {
                    multiplicador = usuarioEnSesion["mtp" + titulo];
                }
                
                if (titulo != "???") {
                    popup.querySelector('.producing-info').style.display = "block";
                    popup.querySelector('.produce-info').style.display = "block";
                    popup.querySelector('.pInexistente').style.display = "none";

                    popup.querySelector('.spanItem').textContent = titulo;
                    popup.querySelector('.spanCantidad').textContent = formatPrice(produccion*multiplicador);

                    popup.querySelector('.spanItemProducc').textContent = titulo;
                    popup.querySelector('.spanEnPropiedad').textContent = container.querySelector('.content .enPropiedad').textContent;
                    popup.querySelector('.spanProduccion').textContent = formatPrice(produccion * container.querySelector('.content .enPropiedad').textContent * multiplicador);
                } else {
                    popup.querySelector('.pInexistente').textContent = "???";
                    popup.querySelector('.pInexistente').style.display = "block";
                    popup.querySelector('.producing-info').style.display = "none";
                    popup.querySelector('.produce-info').style.display = "none";
                }

                // Ajustar la posición vertical del popup
                if (titulo == "Herobrine") {
                    popup.classList.add('herobrine-popup'); 
                }else{
                    const popupHeight = popup.offsetHeight;
                    const popupTop = rect.top - popupHeight - 10; 
                    popup.style.top = Math.max(popupTop, 0) + 'px';
                }

                popup.style.display = 'block'; // Mostrar el "popup"
                // Ajustar la posición del popup a la izquierda del contenedor del producto
                popup.style.left = rect.left - popup.offsetWidth + 'px';
            })
            .catch(error => console.error('Error al cargar el archivo de configuración:', error));
    };
}


function ocultarPopup() {
    document.querySelector('.popup').style.display = 'none'; // Ocultar el "popup"
}

// Obtener todos los contenedores de productos
const productContainers = document.querySelectorAll('.product-container');

// Agregar eventos para mostrar y ocultar el "popup" en cada contenedor de producto
productContainers.forEach(container => {
    container.addEventListener('mouseenter', mostrarPopup(container)); 
    container.addEventListener('mouseleave', ocultarPopup);
});

// Función para mostrar el popup con la descripción y el precio del artículo
function showPopup(item, price,multiplicador,color) {
    var popup = document.querySelector(".popupUpgrade");
    
    popup.querySelector('.titleUpgrade').innerText = item;
    popup.querySelector('.precioUpgrade').innerText = price;
    popup.querySelector('.precioUpgrade').style.color = color;
    popup.querySelector('.cuantoUpgrade').innerText = multiplicador;
    popup.querySelector('.spanItemUpgrade').innerText = item;


    popup.style.display = "block";
}

// Función para ocultar el popup
function hidePopup() {
    var popup = document.querySelector(".popupUpgrade");
    popup.style.display = "none";
}

// Agregar eventos de ratón a todos los elementos de la tienda para mostrar/ocultar el popup
var storeItems = document.getElementsByClassName("store-item");
for (var i = 0; i < storeItems.length; i++) {
    storeItems[i].addEventListener("mouseover", function() {
        var item = this.getAttribute("data-elemento");
        var price = formatPrice(this.getAttribute("data-price"));
        var multiplicador = this.getAttribute("data-gereracion");
        var color = this.getAttribute("data-color");
        showPopup(item, price,multiplicador,color);
    });
    storeItems[i].addEventListener("mouseout", hidePopup);
}

function mostrarUpgrades(){
    // Obtiene todos los elementos de la tienda
    var storeItems = document.querySelectorAll(".store-item");
    var clickCount = parsePrice(document.getElementById("clickCount").textContent);

    // Itera sobre los elementos de la tienda
    storeItems.forEach(function(item) {
        // Obtiene el valor del atributo data-aparicion del elemento actual
        var aparicion = parseInt(item.getAttribute("data-aparicion"));
        var elemento = item.getAttribute("data-elemento");

        // Verifica si el elemento es "bloque"
        if (elemento === "Bloque") {
            // Comprueba si el data-aparicion es menor o igual al conteo de clicks
            if (aparicion <= clickCount) {
                // Muestra el elemento
                item.style.display = "block";
                if (item.getAttribute('data-comprado') == 'si'){
                    item.style.display = "none";
                }
            } else {
                // Oculta el elemento
                item.style.display = "none";
            }
        }else{
            // Obtiene todos los elementos con la clase "product-container"
            var productContainers = document.querySelectorAll('.product-container');
            productContainers.forEach(function(container) {
                // Verifica si el título del producto coincide con el elemento y su data-tittle es "Steve"
                if (container.getAttribute('data-tittle') === elemento) {
                    // Comprueba si el data-aparicion es menor o igual al conteo de clicks
                    var enPropiedad = parseInt(container.querySelector('.enPropiedad').textContent);
                    
                    if (aparicion <= enPropiedad) {
                        // Muestra el elemento
                        item.style.display = "block";
                        if (item.getAttribute('data-comprado') == 'si'){
                            item.style.display = "none";
                        }
                    } else {
                        // Oculta el elemento
                        item.style.display = "none";
                    }
                } 
            });
        }
    });
    checkHoverStatus()
}

mostrarUpgrades()

// Función para verificar si el contenedor debe estar deshabilitado para hover
function checkHoverStatus() {
    // Obtiene el contenedor de elementos de tienda
    var storeItemContainer = document.querySelector('.store-item-container');

    if (!storeItemContainer) {
        console.error("No se encontró el contenedor de elementos de tienda.");
        return;
    }

    var containerHeight = storeItemContainer.clientHeight;
    var totalItemsHeight = 0;

    // Calcula la altura total de todos los elementos de la tienda
    storeItemContainer.querySelectorAll('.store-item').forEach(function(item) {
        totalItemsHeight += item.offsetHeight;

        // Verifica el atributo data-color
        var color = item.getAttribute('data-color');
        if (color === 'red') {
            // Aplica un estilo para los elementos con data-color="red"
            item.style.backgroundColor = 'rgba(255, 100, 100, 0.5)'; 
        } else if (color === 'green') {
            // Aplica un estilo para los elementos con data-color="green"
            item.style.backgroundColor = 'rgba(100, 255, 100, 0.5)';
        }
    });


    var umbral = 245; 
    // Deshabilita el hover si la altura del contenedor es menor que la altura total de los elementos
    if (umbral < totalItemsHeight) {
        storeItemContainer.classList.add('disable-hover');
    } else {
        storeItemContainer.classList.remove('disable-hover');
    }
}

function comprarUpgrade(item){
    color = item.getAttribute('data-color');
        
    // Verifica si el color es "green"
    if (color === 'green') {
        cargarConfiguracion(function(configuracion) {
            // Busca el usuario actual en la lista de usuarios
            var usuarioActual = configuracion.usuarios.find(function(usuario) {
                usuarioSesion = document.querySelector('.menu').getAttribute('data-sesion')
                return usuario.username === usuarioSesion;
            });

            if (usuarioActual) {
                // definir los multiplicadores para los campos mtpSteve,mtpEsqueleto etc
                var nombreElemento = item.getAttribute('data-elemento');

                if(nombreElemento != "Bloque"){
                    var multiplicadorStr = item.getAttribute('data-gereracion');
                    // Extraer el valor numérico del multiplicador
                    var multiplicador = parseInt(multiplicadorStr.replace('x', ''));
                    // Actualizar el valor del multiplicador correspondiente al elemento
                    usuarioActual['mtp' + nombreElemento] *= multiplicador;
                } else{
                    // Cuando el elemento es un "Bloque"
                    var multiplicadorStr = item.getAttribute('data-gereracion');
                    // Extraer el valor numérico del porcentaje
                    var porcentaje = parseInt(multiplicadorStr.replace(/[+%]/g, ''));
                    // Incrementar la producción por segundo según el porcentaje
                    usuarioActual['produccionPorSegundo'] *= (1 + porcentaje / 100);
                }

                //falta restar al contador lo que vale el upgrade
                var contador = parseInt(parsePrice(document.getElementById("clickCount").textContent))
                document.getElementById("clickCount").textContent = formatPrice(contador - parseInt(item.getAttribute('data-price')))
                

                item.style.display = "none";
                item.setAttribute("data-comprado","si");

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/guardar-configuracion", true); // Ruta para guardar la configuración en el servidor
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        console.log("Configuración actualizada correctamente en el servidor.");
                    }
                };
                xhr.send(JSON.stringify(configuracion));

                console.log("Compra exitosa. mtpSteve actualizado a 10 para el usuario:", usuarioActual.username+" "+usuarioActual.mtpSteve);
            } else {
                console.log("Usuario no encontrado en la configuración.");
            }
            });
        
    } else {
        console.log("NO SE PUEDE COMPRAR");
    }
}
