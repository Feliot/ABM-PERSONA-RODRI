<?php

include_once 'JWT.php';
include_once 'ExpiredException.php';
include_once 'BeforeValidException.php';
include_once 'SignatureInvalidException.php';
include_once '../clases/Usuario.php';


$objDatos=json_decode(file_get_contents("php://input"));

if (Usuario::InsertarNuevoUsuario($objDatos->usuario, $objDatos->password)) {

}
else{
	echo "Usuario en uso. Ingrese uno nuevo.";
	/*try {
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo '{"data": "Exception occurred: '.$e->getMessage().'"}';
}*/
}
?>