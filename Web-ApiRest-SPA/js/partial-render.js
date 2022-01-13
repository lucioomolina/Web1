"use strict"

let contenido = document.querySelector('.contenido');
let btn_inicio = document.querySelector('#btn-inicio');
let btn_cuadros = document.querySelector('#btn-cuadros');
let btn_remeras = document.querySelector('#btn-remeras');

let url = "https://60cb604d21337e0017e449be.mockapi.io/Talles";
let html = "";
let tableTalles = [];

//menu desplegable
document.querySelector(".btn_menu").addEventListener("click", function (e){
    e.preventDefault;
    document.querySelector(".contenedor-navegacion").classList.toggle("show");
});

CargarHtml('partial-render/inicio.html');

btn_inicio.addEventListener('click', function(e){
    e.preventDefault;
    html = 'partial-render/inicio.html';

    CargarHtml(html);

    btn_inicio.classList.add("activo");
    btn_cuadros.classList.remove("activo");
    btn_remeras.classList.remove("activo");
});

btn_cuadros.addEventListener('click', function(e){
    e.preventDefault;

    html = 'partial-render/cuadros.html';
    CargarHtml(html);

    btn_cuadros.classList.add("activo");
    btn_inicio.classList.remove("activo");
    btn_remeras.classList.remove("activo");
});

btn_remeras.addEventListener('click', function(e){
    e.preventDefault;
  
    html = 'partial-render/remeras.html';
    CargarHtml(html);

    btn_remeras.classList.add("activo");
    btn_inicio.classList.remove("activo");
    btn_cuadros.classList.remove("activo");
});

function CargarHtml(phtml){
    
    fetch(phtml)
        //una vez que el fetch termina se ejecuta lo que esta dentro del then.
        .then( response => {
            if (response.ok)
                //response es la respuesta del servidor viene con variada informacion. le hago el .text() para obtener el html.
                return response.text();
            else
                throw('Error al Cargar el Html');
        }) 
        //al hacer el .text() para obtener el html me hace otra promesa, ya que puede demorar dependiendo del tamaño del html.
        .then (html => {
            //a partir de aca ya se que obtuve la respuesta necesaria y puedo empezar a trabajar sobre ella.
            contenido.innerHTML = html;
        
            if (phtml === 'partial-render/inicio.html'){
                console.log("Partial-Render: Inicio");
                asignarEventListenerInicio();

            } else if (phtml === 'partial-render/remeras.html'){
                console.log("Partial-Render: Remeras");
                asignarEventListenerRemeras();

            } else if (phtml ==='partial-render/cuadros.html'){
                console.log("Partial-Render: Cuadros");
            }
        })
        .catch (error => {
            console.log(error);
            document.querySelector('.contenido').innerHTML =  "Error al Solicitar el Html..."
        });   
}

function asignarEventListenerInicio(){
    
    let campo_captcha = document.querySelector('#mostrar-captcha').value = (rellenar_captcha());
    console.log(campo_captcha);

    let btn_suscribirse = document.querySelector('#btn-suscribirse');
    btn_suscribirse.addEventListener("click", () => {

        let leer_captcha = document.querySelector('#leer-captcha').value;
    
        if (campo_captcha == leer_captcha) {
            document.querySelector('#registro-correcto').innerHTML = "*Se ha registrado correctamente";
        } else {
            document.querySelector('#registro-correcto').innerHTML = "*Captcha Incorrecto, asegúrese de escribir bien el código (distingue mayúsculas)"
        }
    });
}

function rellenar_captcha() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    const MAX = "5";
    const total_caracteres = caracteres.length;
    
    for (let i = 0; i < MAX; i++) {
        captcha += caracteres.charAt(Math.floor(Math.random() * total_caracteres));
    }
    return captcha;
}

function asignarEventListenerRemeras(){

let btn_Estandar = document.querySelector('#btn-tallesEstandar'),
    btn_EliminarTalle = document.querySelector('#btn-eliminarTalle'),
    btn_ModificarTalle = document.querySelector('#btn-modificarTalle'),
    form = document.querySelector('.cargaDatos'),
    inpTalle = document.querySelector('#inpTalle'),
    inpPecho = document.querySelector('#inpPecho'),
    inpCintura = document.querySelector('#inpCintura'),
    inpCadera = document.querySelector('#inpCadera'),
    inpId = document.querySelector('#inpId'),
    inpBuscador = document.querySelector("#inpBuscador");

    ConsultarTalles();

    form.addEventListener("submit", function(e){
        e.preventDefault();

        let newTalle = {
            Talle : inpTalle.value.toUpperCase(),
            Pecho : +inpPecho.value,
            Cintura : +inpCintura.value,
            Cadera : +inpCadera.value,
        };
        console.log(newTalle);
        AgregarTalle(newTalle);
    });

    btn_Estandar.addEventListener('click', CargarEstandar);

//Al hacer click en alguna fila obtengo el indice de la misma y la dejo resaltada.
document.querySelector('#tablaTalles').onclick = function(e) {
    let tabla = document.querySelector('#tablaTalles');
    let index = e.target.parentElement.rowIndex;

    e.target.parentElement.classList.toggle("clickfila");
    for (let i = 1; i < tabla.rows.length; i++ ){
        if (i !== index){
            tabla.rows[i].classList.remove("clickfila");
        }
    }    
    ObtenerDatosFila(index);
 }

 //Agarro el Id del Input y los valores correspondientes al talle y se los mando a la funcion que realizara la modificacion en el servidor.
btn_ModificarTalle.addEventListener('click', function(e){
    let id = inpId.value;

    let newTalle = {
        Talle : inpTalle.value.toUpperCase(),
        Pecho : +inpPecho.value,
        Cintura : +inpCintura.value,
        Cadera : +inpCadera.value,
    };

    ModificarTalle(id, newTalle);
});

btn_EliminarTalle.addEventListener('click', function(e){
    let id = inpId.value;
    EliminarTalle(id);
});

inpBuscador.addEventListener("keyup",BuscaryMostrar);

}

//Hace la llamada al servidor para traer los datos.
function ConsultarTalles (){
    fetch (url, {
        method: 'GET',

    }).then(response =>{
        return response.json();

    }).then(Talles =>{
        MostrarTalles(Talles);
        tableTalles = Talles;

    }).catch(error =>{
        console.log(error);
    })
}

//Recorre el arreglo obtenido del servidor y lo va mostrando por filas en la tabla.
function MostrarTalles (Talles){
    
    let tbody = document.querySelector('#tablaTalles tbody');
    let tr = tbody.getElementsByTagName("tr");
    const MAX = 120;
        
    tbody.innerHTML = "";
    
    for (let i = 0; i < Talles.length; i++){
        let fila = tbody.insertRow(i)

        let talleCell = fila.insertCell(0),
            pechoCell = fila.insertCell(1),
            cinturaCell = fila.insertCell(2),
            caderaCell = fila.insertCell(3),
        idCell = fila.insertCell(4);
        
        talleCell.innerHTML = Talles[i].Talle;
        pechoCell.innerHTML = Talles[i].Pecho + " cm";
        cinturaCell.innerHTML = Talles[i].Cintura+ " cm";
        caderaCell.innerHTML = Talles[i].Cadera+ " cm";
        idCell.innerHTML = Talles[i].id;
        idCell.classList.add('oculto');

        if (Talles[i].Pecho > MAX|| Talles[i].Cintura > MAX|| Talles[i].Cadera > MAX){
            tr[i].classList.add('filaResaltada');
        }
    }
}

function AgregarTalle (newTalle){
    fetch (url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTalle)
        
    }).then(response =>{
        console.log(`Se guardo: ${newTalle.Talle}`);
        ConsultarTalles();
        LimpiarInputs();

    }).catch(error =>{
        console.log(`Hubo un problema: ${error}`);
    })
    
}

//Carga el objeto y lo pasa como parametro a la funcion que luego los manda al servidor, realizando esta accion tres veces.
function CargarEstandar(){

    let newTalle = {
        Talle: "S",
        Pecho: 95,
        Cintura: 82,
        Cadera: 96,
    }
   for(let i = 0; i < 3; i++){
    AgregarTalle(newTalle);
   }    
}

//Recibo el indice de la fila y obtiene los datos del arreglo local tableTalles y los manda a los inputs
function ObtenerDatosFila (index){
    let tabla = document.querySelector('#tablaTalles');
    let id = tabla.rows[index].cells[4].innerHTML;

    for (let i = 0; i < tableTalles.length; i++){
        
        if (id == tableTalles[i].id){

            inpTalle.value = tableTalles[i].Talle;
            inpPecho.value = tableTalles[i].Pecho;
            inpCintura.value = tableTalles[i].Cintura;
            inpCadera.value = tableTalles[i].Cadera;
            inpId.value = tableTalles[i].id;
        }
    }
}

//recibo el id del item a modificar y el objeto con las modificaciones y lo manda al servidor.
function ModificarTalle (id, newTalle){
    fetch (url+`/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTalle)
        
    }).then(response => {
        ConsultarTalles();
        LimpiarInputs();

    }).catch(error => {
        console.log(`Hubo un problema: ${error}`)
    })
}

//recibo el id a eliminar, se concatena a la url, se elimina el objeto con esa Id y luego se vuelve a consultar para mostrar en la tabla.
function EliminarTalle (id){
    fetch (url + `/${id}`, {
        method: 'DELETE',

    }).then(response => {
        return response.json();

    }).then(Talles => {
        console.log(`Se elimino el Talle: ${Talles.Talle}`);
        ConsultarTalles();
        LimpiarInputs();

    }).catch(error => {
        console.log(`Hubo un problema: ${error}`)
    })
}

function BuscaryMostrar(){
    let busqueda = inpBuscador.value.toUpperCase();
    let tbody = document.querySelector('#tablaTalles tbody');
    let tr = tbody.getElementsByTagName("tr");
    tbody.innerHTML = "";
    
    for (let i = 0; i < tableTalles.length; i++){
            
        let fila = tbody.insertRow(i)
    
        let talleCell = fila.insertCell(0),
            pechoCell = fila.insertCell(1),
            cinturaCell = fila.insertCell(2),
            caderaCell = fila.insertCell(3),
        idCell = fila.insertCell(4);
            
        talleCell.innerHTML = tableTalles[i].Talle;
        pechoCell.innerHTML = tableTalles[i].Pecho + " cm";
        cinturaCell.innerHTML = tableTalles[i].Cintura+ " cm";
        caderaCell.innerHTML = tableTalles[i].Cadera+ " cm";
        idCell.innerHTML = tableTalles[i].id;
        idCell.classList.add('oculto');

        if (!tableTalles[i].Talle.includes(busqueda)){
            tr[i].classList.add('oculto');
        }
    }
}

//limpia los valores de los inputs, se llama luego de realizar alguna alta, baja o modificacion.
function LimpiarInputs (){
    inpTalle.value = "";
    inpPecho.value = "";
    inpCintura.value = "";
    inpCadera.value = "";
    inpId.value = "";
    inpBuscador.value = "";
}
