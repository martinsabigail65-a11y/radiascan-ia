import "./App.css"
import { useState } from "react"

function App(){

  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState("")
  const [loading, setLoading] = useState(false)
  const [modo, setModo] = useState("Humano")

  async function enviarImagem(){

    if(!imagem){
      alert("Escolha uma imagem")
      return
    }

    const formData = new FormData()

    formData.append(
      "file",
      imagem
    )

    setLoading(true)

    try{

      const resposta = await fetch(
        "https://name-radiascania-api.onrender.com/analisar",
        {
          method:"POST",
          body:formData
        }
      )

      const dados = await resposta.json()

      setResultado(
        `${dados.status} - ${dados.problema}`
      )

    }

    catch(erro){

      setResultado(
        "Erro ao conectar ao servidor"
      )

    }

    setLoading(false)

  }

  return(

    <div className="container">

      <div className="painel">

        <div className="topo">

          <div>
            <h1>🩻 RadiaScan IA</h1>

            <p>
              Plataforma Inteligente de Radiologia
            </p>
          </div>

          <div className="status-online">
            ● ONLINE
          </div>

        </div>

        <div className="modo-box">

          <label>
            Tipo de Radiologia
          </label>

          <select
            value={modo}
            onChange={(e)=>setModo(e.target.value)}
          >

            <option>
              Humano
            </option>

            <option>
              Veterinário
            </option>

          </select>

        </div>

        <input
          type="file"
          onChange={(e)=>{

            setImagem(
              e.target.files[0]
            )

            setPreview(
              URL.createObjectURL(
                e.target.files[0]
              )
            )

          }}
        />

        {
          preview &&

          <div className="preview-box">

            <img
              src={preview}
              alt=""
              className="preview"
            />

          </div>
        }

        <button
          onClick={enviarImagem}
        >
          🔍 Analisar Exame
        </button>

        {
          loading &&

          <div className="loading">
            IA analisando imagem...
          </div>
        }

        <div className="resultado">
          {resultado}
        </div>

      </div>

    </div>

  )

}

export default App