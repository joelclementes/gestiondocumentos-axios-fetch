class Etiquetas {
    constructor(reset = false) {
        this.urlProceso = "CatEtiquetas/php/proceso.php";
        this.nombreTabla = "catetiquetas";
        alertify.defaults.transition = "zoom";
        alertify.defaults.theme.ok = "btn btn-primary";
        alertify.defaults.theme.cancel = "btn btn-danger";
        alertify.defaults.theme.input = "form-control";
        if (reset) {
            // En cada módulo hay que usar new Menu().fnCreaMenu() porque si no, desaparecen las opciones
            new Menu().fnCreaMenu();

            // Con esta función cargamos los datos
            // new Etiquetas().fnLimpiaDatos();
            new Etiquetas().ConsultaEtiquetas();

            // Funciones de los botones cuando se hace clic en ellos.
            document.querySelector("#btnGuardar").addEventListener("click", () => { new Etiquetas().fnGuarda() })
            document.querySelector("#btnCancelar").addEventListener("click", () => { new Etiquetas().fnLimpiaDatos() })
        }
    }

        async ConsultaEtiquetas(){
            try {
                const resp = await fetch(this.urlProceso+"?proceso=CATETIQUETAS_SELECT");
                const datos = await resp.json();
        let elementos = ``;
        for (let d of datos) {
            let jsonDatos = {};
            jsonDatos = JSON.stringify(d);
            elementos += `
                    <div class="lista_item">
                        <div class="col-10 lista_nombre">${d.nombre}</div>
                        <div class="col-2 lista_botones">
                            <button style="color:#4582EC" class="btn btn-link" onclick='new Etiquetas().fnMuestraDatos(`+ jsonDatos + `)'><i class="fa fa-pencil-alt"></i></button>
                            <button style="color:#FF0000" class="btn btn-link" onclick='new Etiquetas().fnBorraDatos(`+ jsonDatos + `)'><i class="far fa-trash-alt"></i></button>
                        </div>
                    </div>
            `;
        }
        $("#listaElementos").html(elementos);
            } catch (error) {
                console.log(error);
            }
        }

    fnConstruyeLista(datos) {
        // datos = JSON.parse(datos);
        let elementos = ``;
        for (let d of datos) {
            let jsonDatos = {};
            jsonDatos = JSON.stringify(d);
            elementos += `
                    <div class="lista_item">
                        <div class="col-10 lista_nombre">${d.nombre}</div>
                        <div class="col-2 lista_botones">
                            <button style="color:#4582EC" class="btn btn-link" onclick='new Etiquetas().fnMuestraDatos(`+ jsonDatos + `)'><i class="fa fa-pencil-alt"></i></button>
                            <button style="color:#FF0000" class="btn btn-link" onclick='new Etiquetas().fnBorraDatos(`+ jsonDatos + `)'><i class="far fa-trash-alt"></i></button>
                        </div>
                    </div>
            `;
        }
        $("#listaElementos").html(elementos);
    }


    fnMuestraDatos(dato) {
        new Etiquetas().fnLimpiaDatos();
        document.querySelector("#txtNombre").value = dato.nombre;
        document.querySelector("#nombreModificado").innerHTML = `Modificando etiqueta <strong>${dato.nombre}</strong>`;
        document.querySelector("#txtNombre").focus();
        localStorage.setItem("idEtiquetaModificada", dato.idEtiqueta);
    }

    fnBorraDatos(depto){
        let resp = alertify.confirm('Atención', 'Se borrarrá la etiqueta ' + depto.nombre
                , () => { new Etiquetas().fnDelete(depto)  }
                , () => {});
    }

    async fnDelete(depto){
        try {
            const resp = await fetch(this.urlProceso+"?proceso=CATETIQUETAS_DELETE&idEtiqueta="+depto.idEtiqueta+"&");
            const datos = await resp.json();
            if (datos != 1) {
                alertify.alert('Ocurrió un error', resultado).set('modal', false);
                return;
            } else {
                alertify.success('Se borró con éxito')
                new Etiquetas().fnLimpiaDatos();
            }
        } catch (error){
            console.log(error);
        }
    }

    async fnGuarda() {
        let par_idEtiqueta = localStorage.getItem("idEtiquetaModificada") == null ? 0 : parseInt(localStorage.getItem("idEtiquetaModificada"), 10);
        let par_nombre = document.querySelector("#txtNombre").value;
        if (par_nombre == "") {
            alertify.alert('Atención', "No ha capturado nombre").set('modal', false);
            return;
        }
        try {
            const resp = await fetch(this.urlProceso+"?proceso=CATETIQUETAS_GUARDA&idEtiqueta="+par_idEtiqueta+"&nombre="+par_nombre);
            const resultado = await resp.json();
            if (resultado != 1) {
                alertify.alert('Ocurrió un error', resultado).set('modal', false);
                return;
            } else {
                new Etiquetas().fnLimpiaDatos();
            }
        } catch (error) {
            console.log(error);
        }
    }

    fnLimpiaDatos() {
        // DATOS DE ETIQUETA
        document.querySelector("#txtNombre").value = "";
        document.querySelector("#nombreModificado").innerHTML = "Etiqueta nueva";
        localStorage.removeItem("idEtiquetaModificada");

        // Se muestran todos los usuarios al cargar la página
        new Etiquetas().ConsultaEtiquetas();

        document.querySelector("#txtNombre").focus();
    }
}
window.onload = () => new Etiquetas(true);
