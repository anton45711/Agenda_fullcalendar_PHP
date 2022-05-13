

document.addEventListener('DOMContentLoaded', function() {

let formulario = document.querySelector("#formularioEventos");

  var calendarEl = document.getElementById('agenda');

  var calendar = new FullCalendar.Calendar(calendarEl, {
   
    initialView: 'dayGridMonth',
    locale:"es",

    displayEventTime:false,

    headerToolbar: {
        left: 'prev,next today',

        center: 'title',

        right: 'dayGridMonth,timeGridWeek,listWeek'

    },

    eventSources:{
        url: baseURL+"/evento/mostrar",
        method:"POST",
        extraParams:{
            _token: formulario._token.value,

        }
    },


    dateClick:function(info){    //aparece el modal en el dia
        formulario.reset();     // resetear el formulario

        formulario.start.value=info.dateStr; 
        formulario.end.value=info.dateStr;  //asignar las fechas correspondientes

        $("#evento").modal("show");
    },
    eventClick:function (info){

        var evento= info.event;
        console.log(evento);

        axios.post(baseURL+"/evento/editar/"+info.event.id).//envia todos los datos

        then(
            (respuesta) =>{ //colocacion de los datos introducidos

                formulario.id.value= respuesta.data.id;
                formulario.title.value= respuesta.data.title;
                formulario.descripcion.value= respuesta.data.descripcion;
                
                formulario.start.value= respuesta.data.start;
                formulario.end.value= respuesta.data.end;
                
                
                $("#evento").modal("show"); //oculta el modal
            }
            ).catch(
                error=>{
                    if(error.response){
                        console.log(error.response.data);
                    }
                }
            )

    }
 
    });

  calendar.render();

             document.getElementById("btnGuardar").addEventListener("click",function(){

                 enviarDatos("/evento/agregar");

        
            });
            document.getElementById("btnEliminar").addEventListener("click",function(){

                enviarDatos("/evento/borrar/"+formulario.id.value);


            });

            document.getElementById("btnModificar").addEventListener("click",function(){

                enviarDatos("/evento/actualizar/"+formulario.id.value);
            });
            
            function enviarDatos(url){
                const datos= new FormData(formulario);
          
                const nuevaURL= baseURL+url;

            axios.post(nuevaURL, datos).//envia todos los datos
            then(
                (respuesta) =>{
                    calendar.refetchEvents();
                    $("#evento").modal("hide"); //oculta el modal
                }
                ).catch(
                    error=>{if(error.response){console.log(error.response.data);}
                    }
                )
                
            }
    });
