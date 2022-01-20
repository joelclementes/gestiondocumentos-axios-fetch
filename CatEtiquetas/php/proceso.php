<?php 
include_once("../../BackEnd/gestiondocumentos.php");

$oEtiq = new Documentos();
$proceso = $_GET["proceso"];

switch ($proceso){
    case "CATETIQUETAS_SELECT":
        print $oEtiq->catetiquetas_select();
        break;
    case "CATETIQUETAS_GUARDA":
        print $oEtiq->catetiquetas_guarda(
            $_GET["idEtiqueta"],
            $_GET["nombre"]
        );
        break;
    case "CATETIQUETAS_DELETE":
        print $oEtiq->catetiquetas_delete($_GET["idEtiqueta"]);
        break;
}
?>