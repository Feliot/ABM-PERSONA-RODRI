var app = angular.module('ABMangularPHP', ['ngAnimate', 'ui.router', 'angularFileUpload', 'satellizer'])



.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.loginUrl = 'ABM-PERSONA-RODRI/PHP/Sesiones/autentificador.php'; //"http://api.com/auth/login";
  $authProvider.signupUrl = 'ABM-PERSONA-RODRI/PHP/Sesiones/CrearCuenta.php'; //"http://api.com/auth/signup";
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
          templateUrl: 'template/menuSuperior.html',
          controller: 'controlMenuSuperior'
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
        templateUrl: 'template/menuSuperior.html',
         controller: 'controlMenuSuperior'
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
        templateUrl: 'template/menuSuperior.html',
         controller: 'controlMenuSuperior'
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
        templateUrl: 'template/menuSuperior.html',
          controller: 'controlMenuSuperior'
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
        templateUrl: 'template/menuSuperior.html',
          controller: 'controlMenuSuperior'
      }
    }

  })

  .state('signup', {
    url: '/signup',
    views: {
      'principal': {
        templateUrl: 'template/templateSignUp.html',
        controller: 'controlSignUp'
      },
      'menuSuperior': {
        templateUrl: 'template/menuSuperior.html',
          controller: 'controlMenuSuperior'
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
    else{

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

  $scope.IrASignUp = function() {
    $state.go('signup');
  }

  $scope.Login = function() {
    console.info("ENTRÉ A LA FUNCIÓN LOGIN", $scope.cuenta.usuario);
    toastr.options = {
                'closeButton' : true,
                'progressBar' : true
            };
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
        toastr.success('LOGUEO CORRECTO!');
        $scope.infoDeUsuario = $scope.cuenta.usuario;
       // toastr.success('Logueo correcto!');
     
        //$location.path("/private")
      })
      .catch(function(response) {
        toastr.error( response.data.data, response.statusText);
        //toastr.error('I do not think that word means what you think it means.', 'Inconceivable!');
        console.info("ALTO ERROR WACHIN", response);
        console.info($auth.isAuthenticated());
        // Si ha habido errores llegamos a esta parte
      });
  }
});

app.controller('controlSignUp', function($scope, $http, $location, $state, $auth) {
  $scope.DatoTest = "SIGNUP";

  if ($auth.isAuthenticated()) {
    //SI ESTOY AUTENTICADO, REDIRECCIONO A MENÚ
    $state.go('menu');
  }

  $scope.SignUp = function() {
    console.info("ENTRÉ A LA FUNCIÓN SIGNUP", $scope.nuevaCuenta.usuario);
    $auth.signup({
        usuario: $scope.nuevaCuenta.usuario,
        password: $scope.nuevaCuenta.password
      })
      .then(function(response) {
          console.info("CREACION CORRECTA", response);
          toastr.success(response.data.data, response.statusText);
          $state.go('login');
      })
      .catch(function(response) {
        console.info("CREACION CON ALTO ERROR WACHIN", response);
        toastr.error( response.data.data, response.statusText);
        //console.info("ALTO ERROR WACHIN", response);
        //console.info($auth.isAuthenticated());
        // Si ha habido errores llegamos a esta parte
      });
  }
});

app.controller('controlMenuSuperior', function($scope, $http, $location, $state, $auth) {
  console.info("CONTROLADOR DE MENU SUPERIOR", $auth.isAuthenticated());
  $scope.Logout = function() {
    console.info("ENTRÉ A LA FUNCIÓN SIGNUP", $scope.nuevaCuenta.usuario);
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        toastr.info('You have been logged out');
        $state.go('login');
      });

  };
});