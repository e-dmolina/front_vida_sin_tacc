/*Agrega api de google*/
var map;
// var miCoord = {lat: -31.416795, lng: -64.183602 };

//Mapa de google maps
function initMap() {

    var mapOptions = {
        zoom: 15,
        center: {lat: -31.416795, lng: -64.183602 },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);    
    
    getEstablecimientos();
}

//Voy a mi ubicacion
document.getElementById("btnMiUbicacion").addEventListener('click', (e) =>{
    e.preventDefault();

    //Mi posicion y establezco el zoom
    navigator.geolocation.getCurrentPosition(function(position){
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var infoWindow = new google.maps.InfoWindow({
            map: map,
            position: geolocate,
            content: '<p class="estasAqui">Estas aquí</p>'
        });

        //Zoom de mapa
        var seleccion = document.getElementById('selectZoom').value;
        
        switch (seleccion) {
            case '300':
                    map.setZoom(18);
                break;
            case '500':
                    map.setZoom(17);
                break;
            case '1000':
                    map.setZoom(15);
                break;
        }
        
        //map.panTo(geolocate);
        map.setCenter(geolocate);
        
        
    });  
});

//Obtengo todos los establecimientos
getEstablecimientos = async () => {
    const url = 'http://localhost:5001/api/establecimientos';
    // const url = 'http://localhost:59096/api/Establecimientos';
    const response = await fetch(url);
    const jsonResponse = await response.json();
    obtenerMarcadores(jsonResponse);
    tabla(jsonResponse);
    console.log(response)
    console.log(jsonResponse)
}

const obtenerMarcadores = (datos) => {
    for (let establecimiento of datos) {
        var coord = { lat: establecimiento.lat, lng: establecimiento.lng }
        marker = new google.maps.Marker({
            position: coord,
            map: map
        });
    }
}


//filtro establecimientos
document.getElementById("btnFiltrar").addEventListener('click', async (e) => {
    e.preventDefault();
    const rubro = document.getElementById("selectRubro").value;

    if (rubro == 'Todos') {
         url = 'http://localhost:5001/api/establecimientos';
        // url = 'http://localhost:59096/api/Establecimientos';
    } else {
        url = 'http://localhost:5001/api/establecimientos/filtrar/' + rubro;
        // url = 'http://localhost:59096/Api/Establecimientos/?rubro=' + rubro;
    }
        
    const response = await fetch(url);
    const jsonResponse = await response.json();

    obtenerMarcadores(jsonResponse);
    tabla(jsonResponse);

    //mensaje de response vacia
    let msj = document.getElementById("msj");
    if (jsonResponse.length===0) {
        console.log('Json Vacio');
        
        msj.classList.add("alert");
        msj.classList.add("alert-warning");
        msj.innerText = 'No se encontraron resultados para tu búsqueda...';
    } else {        
        msj.classList.remove('alert');
        msj.classList.remove('alert-warning');
        msj.innerText = '';
    }       
})

//dibuja la tabla con los establecimientos
const tabla = (datos) => {
    let tbody = document.getElementById("cuerpo-tabla");
    tbody.innerHTML = '';
    for (let establecimiento of datos) {
        tbody.innerHTML += `
        <tr>
            <th scope="row">${establecimiento.nombre}</th>
            <td>${establecimiento.direccion}</td>
            <td>${establecimiento.descripcion}</td>
            <td>${establecimiento.rubro}</td>
        </tr>`;
    }
}