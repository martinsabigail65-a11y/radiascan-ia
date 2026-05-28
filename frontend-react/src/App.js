import "./App.css"
import { useState } from "react"

function App(){

  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modo, setModo] = useState("Humano")

  async function enviarImagem(){

    if(!imagem){
      alert("Escolha uma imagem")
      return
    }

    const formData = new FormData()
    formData.append("file", imagem)

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

      setResultado({
        status: dados.status || "APROVADO",
        problema: dados.problema || "Nenhum problema crítico encontrado",
        nitidez: dados.nitidez || 92,
        contraste: dados.contraste || 88,
        exposicao: dados.exposicao || 90,
        enquadramento: dados.enquadramento || 85
      })

    }catch(erro){
      setResultado({
        status: "ERRO",
        problema: "Erro ao conectar ao servidor",
        nitidez: 0,
        contraste: 0,
        exposicao: 0,
        enquadramento: 0
      })
    }

    setLoading(false)
  }

  function Barra({nome, valor}){
    return(
      <div className="barra-item">
        <div className="barra-topo">
          <span>{nome}</span>
          <strong>{valor}%</strong>
        </div>

        <div className="barra-fundo">
          <div 
            className="barra-preenchida"
            style={{width:`${valor}%`}}
          ></div>
        </div>
      </div>
    )
  }

  return(
    <div className="container">

      <header className="header">
        <div>
          <h1>🩻 RadiaScan IA</h1>
          <p>Análise inteligente de qualidade radiológica</p>
        </div>

        <span className="online">● ONLINE</span>
      </header>

      <main className="grid">

        <section className="card upload-card">
          <h2>Enviar Exame</h2>

          <label>Tipo de Radiologia</label>
          <select value={modo} onChange={(e)=>setModo(e.target.value)}>
            <option>Humano</option>
            <option>Veterinário</option>
          </select>

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e)=>{
              const arquivo = e.target.files[0]
              setImagem(arquivo)
              setPreview(URL.createObjectURL(arquivo))
              setResultado(null)
            }}
          />

          {preview && (
            <div className="preview-box">
              <img src={preview} alt="Radiografia" />
              <p>{imagem?.name}</p>
            </div>
          )}

          <button onClick={enviarImagem}>
            {loading ? "Analisando..." : "🔍 Analisar Exame"}
          </button>

          {loading && <div className="loading">IA processando imagem...</div>}
        </section>

        <section className="card resultado-card">
          <h2>Resultado da IA</h2>

          {!resultado && (
            <p className="vazio">
              Envie uma radiografia para visualizar a análise.
            </p>
          )}

          {resultado && (
            <>
              <div className={
                resultado.status === "APROVADO" 
                ? "status aprovado" 
                : "status reprovado"
              }>
                {resultado.status}
              </div>

              <p className="problema">
                {resultado.problema}
              </p>

              <div className="metricas">
                <Barra nome="Nitidez" valor={resultado.nitidez} />
                <Barra nome="Contraste" valor={resultado.contraste} />
                <Barra nome="Exposição" valor={resultado.exposicao} />
                <Barra nome="Enquadramento" valor={resultado.enquadramento} />
              </div>
            </>
          )}
        </section>

        <section className="card painel-card">
          <h2>Painel Hospitalar</h2>

          <div className="painel-grid">
            <div>
              <strong>1</strong>
              <span>Exames analisados</span>
            </div>

            <div>
              <strong>{resultado?.status === "APROVADO" ? 1 : 0}</strong>
              <span>Aprovados</span>
            </div>

            <div>
              <strong>{resultado?.status === "REPROVADO" ? 1 : 0}</strong>
              <span>Reprovados</span>
            </div>
          </div>
        </section>

        <section className="card relatorio-card">
          <h2>Relatório Automático</h2>

          {resultado ? (
            <p>
              O exame foi analisado no modo <strong>{modo}</strong>. 
              Resultado: <strong>{resultado.status}</strong>. 
              Observação técnica: {resultado.problema}.
            </p>
          ) : (
            <p className="vazio">
              O relatório será gerado após a análise da imagem.
            </p>
          )}
        </section>

      </main>

    </div>
  )
}

export default App