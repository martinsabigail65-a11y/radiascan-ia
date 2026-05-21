function previewImagem(event){

    let imagem =
        document.getElementById(
            "preview"
        )

    imagem.src =
        URL.createObjectURL(
            event.target.files[0]
        )

    imagem.style.display = "block"
}

async function enviarImagem(){

    let arquivo =
        document.getElementById(
            "arquivo"
        ).files[0]

    let modo =
        document.getElementById(
            "modo"
        ).value

    let loading =
        document.getElementById(
            "loading"
        )

    let resultado =
        document.getElementById(
            "resultado"
        )

    loading.style.display = "block"

    resultado.innerHTML = ""

    let formData =
        new FormData()

    formData.append(
        "file",
        arquivo
    )

    formData.append(
        "modo",
        modo
    )

    let resposta =
        await fetch(

            "http://127.0.0.1:8000/analisar",

            {
                method:"POST",
                body:formData
            }

        )

    let dados =
        await resposta.json()

    loading.style.display = "none"

    resultado.innerHTML = `

        <div>

            ${dados.status}

        </div>

        <div style="
            font-size:16px;
            margin-top:10px;
            color:#94a3b8;
        ">

            ${dados.problema}

        </div>

    `
}