<?php

include_once 'JWT.php';
include_once 'ExpiredException.php';
include_once 'BeforeValidException.php';
include_once 'SignatureInvalidException.php';
include_once '../clases/Usuario.php';


$objDatos=json_decode(file_get_contents("php://input"));
//print("LA RECALCADA CONCHA DE TU HERMANA CREARCUENTA");
if (Usuario::InsertarNuevoUsuario($objDatos->usuario, $objDatos->password)) {
	header("HTTP/1.1 200 CREACION EXITOSA");
	echo '{"data": "Nueva cuenta creada."}';
}
else{
	header("HTTP/1.1 404 ERROR DE SIGNUP");
    echo '{"data": "Usuario en uso. Ingrese uno nuevo."}';
	//echo "Usuario en uso. Ingrese uno nuevo.";
	/*try {
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo '{"data": "Exception occurred: '.$e->getMessage().'"}';
}*/
}
?>