var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controladores/controlador')
var http = require('http');
var app = express();//guardo la referencia
// le aplico el bodyParser a app
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
//le indico que los pedidos van a salir en formato json
app.use(bodyParser.json());
app.get('/competencias/:id',controlador.obtenerCompetencia);
app.get('/competencias/:id/peliculas', controlador.obtenerOpciones);
app.get('/competencias/:id/resultados',controlador.obtenerResultados);
app.get('/competencias', controlador.listarCompetencia);
app.post('/competencias/:idCompetencia/voto', controlador.votar);
app.post('/competencias', controlador.crear);
app.put('/competencias/:id',controlador.editar);
app.delete('/competencias/:id',controlador.eliminar);
app.delete('/competencias/:id/votos',controlador.reiniciar);
app.get('/generos',controlador.listarGeneros);
app.get('/directores',controlador.listarDirectores);
app.get('/actores',controlador.listarActores);


var puerto = '8080';
// le digo a mi app que va a estar escuchando el puerto8080
app.listen(puerto, function() {
    console.log("Escuchando en el puerto " + puerto);
});
