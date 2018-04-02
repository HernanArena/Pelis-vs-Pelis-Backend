require('dotenv').config();
var con = require('../lib/conexionbd');

function listarCompetencia(req, res) {
    var sql = "select * from competencia";
    con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response =  resultado;
      res.send(JSON.stringify(response));
    });
}
function listarGeneros(req, res) {
    var sql = "select * from genero";
    con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response =  resultado;
      res.send(JSON.stringify(response));
    });
}
function listarDirectores(req, res) {
    var sql = "select * from director";
    con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response =  resultado;
      res.send(JSON.stringify(response));
    });
}
function listarActores(req, res) {
    var sql = "select * from actor";
    con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response =  resultado;
      res.send(JSON.stringify(response));
    });
}
function obtenerCompetencia(req, res){
  var id = req.params.id,
  filtro = "", atribute ="";
  var sql = "select * from competencia c where c.id ="+id;
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta 1", error.message);
        return res.status(404).send("Hubo un error en la consulta 1");
    }
    if(resultado.length==0) return res.status(422).json("La competencia no existe");
    if(resultado[0].genero_id !=null){
       filtro +=" join genero g on g.id ="+resultado[0].genero_id ;
       atribute += ",g.nombre as genero_nombre ";
     }
    if(resultado[0].director_id !=null){
      filtro +=" join director d on d.id ="+resultado[0].director_id;
      atribute += ",d.nombre as director_nombre ";
    }
    if(resultado[0].actor_id !=null){
      filtro +=" join actor a on a.id ="+resultado[0].actor_id;
      atribute += ",a.nombre as actor_nombre ";
    }
    var sql = "select c.nombre as competencia"+atribute+" from competencia c "+filtro+" where c.id ="+id;
    console.log(sql);
    con.query (sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta 2", error.message);
          return res.status(404).send("Hubo un error en la consulta 2");
      }
      var response = {
        'nombre': resultado[0].competencia,
        'genero_nombre': resultado[0].genero_nombre,
        'director_nombre': resultado[0].director_nombre,
        'actor_nombre': resultado[0].actor_nombre
      }
      res.send(JSON.stringify(response));
    });
  });
}
function obtenerOpciones(req, res){
  var idCompetencia = req.params.id,
  sql = "select * from competencia c where c.id ="+idCompetencia;
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta 1", error.message);
        return res.status(404).send("Hubo un error en la consulta 1");
    }
    if(resultado.length==0) return res.status(422).json("La competencia no existe");
    var filtro = crearfiltrar(resultado[0].genero_id,resultado[0].director_id,resultado[0].actor_id);
    sql = "select distinct p.titulo,p.id, p.poster,  g.nombre, c.nombre as competencia from pelicula p join competencia c on c.id = "+idCompetencia+" join actor_pelicula a on a.pelicula_id =p.id  join director_pelicula d on d.pelicula_id = p.id join genero g on p.genero_id = g.id "+filtro+" order by rand() limit 2";
    con.query(sql,function (error, resultado, fields){
       if (error) {
         console.log("Hubo un error en la consulta 2", error.message);
         return res.status(404).send("Hubo un error en la consulta 2");
       }
       var response = {
           'peliculas': resultado,
           'competencia': resultado[0].competencia
       };
       res.send(JSON.stringify(response));
     });
   });
}
function votar (req,res){
  var idCompetencia = req.params.idCompetencia,
  idPelicula = req.body.idPelicula;
  if(idCompetencia==null||idCompetencia==undefined) return res.status(422).json("La competencia no existe");
  if(idPelicula==null||idPelicula==undefined) return res.status(422).json("La pelicula no existe");
  con.query("INSERT INTO competencia_voto (competencia_id,pelicula_id)  values (?,?)",
     [idCompetencia, idPelicula],
     function (error, results, fields){
       if (error) {
           console.log("Hubo un error en la consulta", error.message);
           return res.status(404).send("Hubo un error en la consulta");
       }
          res.json(results);
   });
}
function obtenerResultados(req,res){
  var idCompetencia = req.params.id;
  var sql = "select p.titulo as titulo,p.poster as poster, c.nombre as nombre, competencia_id as idCompetencia, pelicula_id as idPelicula, count(pelicula_id) as votos from competencia_voto cv join pelicula p on cv.pelicula_id=p.id join competencia c on cv.competencia_id = c.id where competencia_id= "+idCompetencia+" group by competencia_id, pelicula_id order by votos desc limit 3";
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
    if(resultado.length==0) return res.status(422).json("No hay votos registrados para esta competencia");
    var response = {
        'resultados': resultado,
        'competencia': resultado[0].competencia
    };
    res.send(JSON.stringify(response));
  });
}
function crear(req, res){
  var nuevo_competencia = req.body,
  nombre = nuevo_competencia.nombre,
  genero = (nuevo_competencia.genero>0)?nuevo_competencia.genero:null,
  director = (nuevo_competencia.director>0)?nuevo_competencia.director:null,
  actor = (nuevo_competencia.actor>0)?nuevo_competencia.actor:null;
 console.log('nombre: '+nombre+' genero: '+genero+' director: '+director+' actor: '+actor);
  var sql = "select * from competencia where nombre ='"+nombre+"'";
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta 1", error.message);
        return res.status(404).send("Hubo un error en la consulta 1");
    }
    if(resultado.length!=0) return res.status(422).json("La competencia ya existe");
    var filtro =  crearfiltrar(genero,director,actor);
    console.log(filtro);
    var sql = "select distinct(p.titulo) from pelicula p join actor_pelicula a on a.pelicula_id =p.id  join director_pelicula d on d.pelicula_id = p.id join genero g on p.genero_id = g.id "+filtro;
    con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta 2", error.message);
          return res.status(404).send("Hubo un error en la consulta 2");
      }
      if(resultado.length<2) return res.status(422).json("No existen dos películas con las características especificadas para ser comparadas");
      con.query('INSERT INTO competencia (nombre,genero_id,director_id,actor_id) values (?,?,?,?)',
      [nombre,genero,director,actor],
      function (error, results, fields){
        if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
        }
        res.json(results);
      });
    });
  });
}
function reiniciar (req, res){
  var idCompetencia = req.params.id;
  var sql = "select * from competencia where id ="+idCompetencia;
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta 1 ", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
    if(resultado.length==0) return res.status(422).json("La competencia no existe");

     con.query('DELETE FROM competencia_voto where competencia_id ='+idCompetencia,
     function (error, results, fields){
       if (error) {
         console.log("Hubo un error en la consulta 2 ", error.message);
         return res.status(404).send("Hubo un error en la consulta");
       }
       console.log(results);
       res.json(results);
     });
   });
}
function eliminar (req,res){
  var idCompetencia = req.params.id;
  var sql = "select * from competencia where id ="+idCompetencia;
  con.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta 1 ", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
    if(resultado.length==0) return res.status(422).json("La competencia no existe");

     con.query('DELETE FROM competencia_voto where competencia_id ='+idCompetencia,
     function (error, results, fields){
       if (error) {
         console.log("Hubo un error en la consulta 2 ", error.message);
         return res.status(404).send("Hubo un error en la consulta");
       }
       con.query('DELETE FROM competencia where id='+idCompetencia,
       function (error, results, fields){
         if (error) {
           console.log("Hubo un error en la consulta 2 ", error.message);
           return res.status(404).send("Hubo un error en la consulta");
         }
         res.json(results);
       });
     });
   });
}
function editar(req,res){
  var idCompetencia = req.params.id,
  nombre = req.body.nombre,
  sql = "select * from competencia where id ="+idCompetencia;
  console.log(nombre);
  con.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta 1 ", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if(resultado.length==0) return res.status(422).json("La competencia no existe");

    con.query('UPDATE competencia SET nombre = ? where id = ?',[nombre,idCompetencia],
    function (error, results, fields){
      if (error) {
        console.log("Hubo un error en la consulta 2 ", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      res.json(results);
    });
  });
}
//funciones auxiliares
function crearfiltrar(genero_id,director_id,actor_id){
  //declaro variable filtro
  var filtro = "";

  if(genero_id!=null) filtro +="where g.id ="+genero_id;
  if(director_id!=null){
      if(genero_id!=null) filtro +=" AND  d.director_id ="+director_id;
      else filtro +=" where d.director_id ="+director_id;
  }
  if(actor_id!=null){
     if(genero_id!=null || director_id!=null) filtro +=" AND a.actor_id ="+actor_id;
     else filtro +=" where a.actor_id ="+actor_id;
  }
  return filtro;
}
module.exports = {
    listarCompetencia: listarCompetencia,
    obtenerCompetencia: obtenerCompetencia,
    obtenerOpciones: obtenerOpciones,
    votar: votar,
    obtenerResultados: obtenerResultados,
    crear: crear,
    reiniciar: reiniciar,
    listarGeneros: listarGeneros,
    listarDirectores: listarDirectores,
    listarActores: listarActores,
    eliminar: eliminar,
    editar: editar
};
