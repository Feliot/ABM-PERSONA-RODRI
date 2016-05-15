var app = angular.module('ABMangularPHP', ['ngAnimate', 'ui.router', 'angularFileUpload', 'satellizer'])



.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.loginUrl = 'ABM-PERSONA-RODRI/PHP/Sesiones/autentificador.php'; //"http://api.com/auth/login";
  $authProvider.signupUrl = 'signupUrlPrueba'; //"http://api.com/auth/signup";
  $authProvider.tokenName = 'tokenNamePrueba'; //"token";
  $authProvider.tokenPrefix = "tokenPrefixPrueba"; //"myApp",

  $stateProvider
    .state('menu', {
      views: {
        'principal': {
          templateUrl: 'template/menu.html',
          controller: 'controlMenu'
        },
        'menuSuperior': {
          templateUrl: 'template/menuSuperior.html'
        }
      },
      url: '/menu'
    })


  .state('grilla', {
    url: '/grilla',
    views: {
      'principal': {
        templateUrl: 'template/templateGrilla.html',
        controller: 'controlGrilla'
      },
      'menuSuperior': {
        templateUrl: 'template/menuSuperior.html'
      }
    }
  })

  .state('alta', {
    url: '/alta',
    views: {
      'principal': {
        templateUrl: 'template/templateUsuario.html',
        controller: 'controlAlta'
      },
      'menuSuperior': {
        templateUrl: 'template/menuSuperior.html'
      }
    }


  })

  .state('modificar', {
    url: '/modificar/{id}?:nombre:apellido:dni:foto',
    views: {
      'principal': {
        templateUrl: 'template/templateUsuario.html',
        controller: 'controlModificacion'
      },
      'menuSuperior': {
        templateUrl: 'template/menuSuperior.html'
      }
    }

  })

  .state('login', {
    url: '/login',
    views: {
      'principal': {
        templateUrl: 'template/templateLogin.html',
        controller: 'controlLogin'
      },
      'menuSuperior': {
        templateUrl: 'template/menuSuperior.html'
      }
    }

  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});





app.controller('controlMenu', function($scope, $http) {
  $scope.DatoTest = "**Menu**";
});

/*█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█*/

app.controller('controlAlta', function($scope, $http, $state, FileUploader, cargadoDeFoto, $auth) {
  $scope.DatoTest = "**alta**";

  if (!($auth.isAuthenticated())) {
      //SI NO ESTOY AUTENTICADO, REDIRECCIONO A LOGIN
      $state.go('login');
  }

  $scope.uploader = new FileUploader({
    url: 'PHP/nexo.php'
  });
  $scope.uploader.queueLimit = 1;

  //inicio las variables
  $scope.persona = {};
  $scope.persona.nombre = "natalia";
  $scope.persona.dni = "12312312";
  $scope.persona.apellido = "natalia";
  $scope.persona.foto = "pordefecto.png";

  cargadoDeFoto.CargarFoto($scope.persona.foto, $scope.uploader);



  $scope.Guardar = function() {
    console.log($scope.uploader.queue);
    if ($scope.uploader.queue[0].file.name != 'pordefecto.png') {
      var nombreFoto = $scope.uploader.queue[0]._file.name;
      $scope.persona.foto = nombreFoto;
    }
    $scope.uploader.uploadAll();
    console.log("persona a guardar:");
    console.log($scope.persona);
  }
  $scope.uploader.onSuccessItem = function(item, response, status, headers) {
    //alert($scope.persona.foto);
    $http.post('PHP/nexo.php', {
        datos: {
          accion: "insertar",
          persona: $scope.persona
        }
      })
      .then(function(respuesta) {
        //aca se ejetuca si retorno sin errores        
        console.log(respuesta.data);
        $state.go("grilla");

      }, function errorCallback(response) {
        //aca se ejecuta cuando hay errores
        console.log(response);
      });
    console.info("Ya guardé el archivo.", item, response, status, headers);
  };
});

/*█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█*/

app.controller('controlGrilla', function($scope, $http, $location, $state, $auth) {
  if (!$auth.isAuthenticated()) {
      //SI NO ESTOY AUTENTICADO, REDIRECCIONO A LOGIN
      $state.go('login');
    }
  $scope.DatoTest = "**grilla**";


  $scope.guardar = function(persona) {

    console.log(JSON.stringify(persona));
    $state.go("modificar, {persona:" + JSON.stringify(persona) + "}");
  }


  $http.get('PHP/nexo.php', {
      params: {
        accion: "traer"
      }
    })
    .then(function(respuesta) {

      $scope.ListadoPersonas = respuesta.data.listado;
      console.log(respuesta.data);

    }, function errorCallback(response) {
      $scope.ListadoPersonas = [];
      console.log(response);
    });

  $scope.Borrar = function(persona) {
      console.log("borrar" + persona);
      $http.post("PHP/nexo.php", {
          datos: {
            accion: "borrar",
            persona: persona
          }
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(respuesta) {
          //aca se ejetuca si retorno sin errores        
          console.log(respuesta.data);
          $http.get('PHP/nexo.php', {
              params: {
                accion: "traer"
              }
            })
            .then(function(respuesta) {

              $scope.ListadoPersonas = respuesta.data.listado;
              console.log(respuesta.data);

            }, function errorCallback(response) {
              $scope.ListadoPersonas = [];
              console.log(response);

            });

        }, function errorCallback(response) {
          //aca se ejecuta cuando hay errores
          console.log(response);
        });
    } // $scope.Borrar






});

/*█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█*/

app.controller('controlModificacion', function($scope, $http, $state, $stateParams, FileUploader, $auth) //, $routeParams, $location)
  {
    if (!$auth.isAuthenticated()) {
      //SI NO ESTOY AUTENTICADO, REDIRECCIONO A LOGIN
      $state.go('login');
    }
    $scope.persona = {};
    $scope.DatoTest = "**Modificar**";
    $scope.uploader = new FileUploader({
      url: 'PHP/nexo.php'
    });
    $scope.uploader.queueLimit = 1;
    $scope.persona.id = $stateParams.id;
    $scope.persona.nombre = $stateParams.nombre;
    $scope.persona.apellido = $stateParams.apellido;
    $scope.persona.dni = $stateParams.dni;
    $scope.persona.foto = $stateParams.foto;

    $scope.cargarfoto = function(nombrefoto) {

      var direccion = "fotos/" + nombrefoto;
      $http.get(direccion, {
          responseType: "blob"
        })
        .then(function(respuesta) {
          console.info("datos del cargar foto", respuesta);
          var mimetype = respuesta.data.type;
          var archivo = new File([respuesta.data], direccion, {
            type: mimetype
          });
          var dummy = new FileUploader.FileItem($scope.uploader, {});
          dummy._file = archivo;
          dummy.file = {};
          dummy.file = new File([respuesta.data], nombrefoto, {
            type: mimetype
          });

          $scope.uploader.queue.push(dummy);
        });
    }
    $scope.cargarfoto($scope.persona.foto);


    $scope.uploader.onSuccessItem = function(item, response, status, headers) {
      $http.post('PHP/nexo.php', {
          datos: {
            accion: "modificar",
            persona: $scope.persona
          }
        })
        .then(function(respuesta) {
            //aca se ejetuca si retorno sin errores       
            console.log(respuesta.data);
            $state.go("grilla");
          },
          function errorCallback(response) {
            //aca se ejecuta cuando hay errores
            console.log(response);
          });
      console.info("Ya guardé el archivo.", item, response, status, headers);
    };


    $scope.Guardar = function(persona) {
      if ($scope.uploader.queue[0].file.name != 'pordefecto.png') {
        var nombreFoto = $scope.uploader.queue[0]._file.name;
        $scope.persona.foto = nombreFoto;
      }
      $scope.uploader.uploadAll();
    }
  }); //app.controller('controlModificacion')

app.service('cargadoDeFoto', function($http, FileUploader) {
  this.CargarFoto = function(nombrefoto, objetoUploader) {
    var direccion = "fotos/" + nombrefoto;
    $http.get(direccion, {
        responseType: "blob"
      })
      .then(function(respuesta) {
        console.info("datos del cargar foto", respuesta);
        var mimetype = respuesta.data.type;
        var archivo = new File([respuesta.data], direccion, {
          type: mimetype
        });
        var dummy = new FileUploader.FileItem(objetoUploader, {});
        dummy._file = archivo;
        dummy.file = {};
        dummy.file = new File([respuesta.data], nombrefoto, {
          type: mimetype
        });

        objetoUploader.queue.push(dummy);
      });
  }

}); //app.service('cargadoDeFoto',function($http,FileUploader){

app.controller('controlLogin', function($scope, $http, $location, $state, $auth) {
  $scope.DatoTest = "LOGIN";

  if ($auth.isAuthenticated()) {
    //SI ESTOY AUTENTICADO, REDIRECCIONO A MENÚ
    $state.go('menu');
  }

  $scope.Login = function() {
    console.info("ENTRÉ A LA FUNCIÓN LOGIN", $scope.cuenta.usuario);
    $auth.login({
        usuario: $scope.cuenta.usuario,
        password: $scope.cuenta.password
      })
      .then(function(response) {
        // Si se ha logueado correctamente, lo tratamos aquí.
        // Podemos también redirigirle a una ruta
        console.info("ENTRÓ POR LOGUEO CORRECTO", response);
        console.info($auth.isAuthenticated());
        console.info("datos auth en menu", $auth.getPayload());

        //$location.path("/private")
      })
      .catch(function(response) {
        console.info("ALTO ERROR WACHIN", response);
        console.info($auth.isAuthenticated());
        // Si ha habido errores llegamos a esta parte
      });
  }




  //Ver que garcha uso de acá! :D 
  /* $scope.persona = {};
  $scope.persona.nombre = $("#nombre").val();
  $scope.persona.clave = $("#clave").val();

  console.info("DATOS DE LOGIN:", item, response, status, headers);

  var funcionAjax = $.ajax({
    url: "ValidarUsuario.php",
    type: "post",
    data: DatosLogin
  });

  funcionAjax.done(function(respuesta) {
    alert(respuesta);
    if (respuesta == "correcto") {
      $("#MensajeError").val("");
      window.location.href = "menu.php"; // vamos al menu
    } else {
      alert("NO esta registrado... ");

      // mostrar mensaje "no esta en la base"
      //vamos al registro
      //window.location.href="registroJquery.php";
    }
  });

  if ($auth.isAuthenticated()) {
    $state.go("alta");
  } else {
    $state.go("menu");
  }



  $scope.authenticate = function(provider) {
    $auth.authenticate(provider);
  };
*/
});
