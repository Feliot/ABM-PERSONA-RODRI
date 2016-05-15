<?php
require_once"accesoDatos.php";
class Usuario
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS
	public $id;
	public $usuario;
 	public $password;

  	public function __construct($dni=NULL)
	{
		if($dni != NULL){
			$obj = Persona::TraerUnaPersona($dni);
			
			$this->apellido = $obj->apellido;
			$this->nombre = $obj->nombre;
			$this->dni = $dni;
			$this->foto = $obj->foto;
		}
	}

  	public static function CheckearUsuario($usuario, $password) 
	{	
		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("select * from usuarios where usuario =:usuario AND password =:password");
		//$consulta =$objetoAccesoDato->RetornarConsulta("CALL TraerUnaPersona(:id)");
		$consulta->bindParam(':usuario', $usuario);
		$consulta->bindParam(':password', $password);
		$consulta->execute();
		$result = $consulta->fetchAll();
		//$usuarioBuscado= $consulta->fetchObject('persona');
		//return $usuarioBuscado;	
		
		if ($result) {
			//print("SIIII LA REPUTA!");
			return true;
		}
		else{
			//print("NOOOOO LA REPUTA!");
			return false;
		}
	}

	//InsertarNuevoUsuario($objDatos->usuario, $objDatos->password

	public static function InsertarNuevoUsuario($usuario, $password) 
	{	
		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("select * from usuarios where usuario =:usuario");
		$consulta->bindParam(':usuario', $usuario);
		$consulta->execute();
		$result = $consulta->fetchAll();
		if($result){
			return false;
		}
		else
		{	
			$consulta = $objetoAccesoDato->RetornarConsulta("INSERT INTO usuarios(usuario, password) VALUES (:usuario, :password)");
			$consulta->bindParam(':usuario', $usuario);
			$consulta->bindParam(':password', $password);
			$consulta->execute();
			return true;
		}
	}

}
?>