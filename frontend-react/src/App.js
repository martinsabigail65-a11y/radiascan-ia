import "./App.css"
import { useState, useEffect } from "react"

function App(){

  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modo, setModo] = useState("Humano")
  const [paciente, setPaciente] = useState("")
  const [registro, setRegistro] = useState("")
  const [tipoExame, setTipoExame] = useState("Radiografia")
  const [dataExame, setDataExame] = useState("")
  const [historico, setHistorico] = useState([])
  const [email, setEmail] = useState("")
  const [logado, setLogado] = useState(false)

  useEffect(() => {
    const emailSalvo = localStorage.getItem("emailRadiaScan")

    if(emailSalvo){
      setEmail(emailSalvo)
      setLogado(true)

      const historicoSalvo = localStorage.getItem(`historicoRadiaScan_${emailSalvo}`)

      if(historicoSalvo){
        setHistorico(JSON.parse(historicoSalvo))
      }
    }
  }, [])

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
      const metricas = dados.metricas || {}

      const resultadoFinal = {
        status: dados.status || "ERRO",
        problema: dados.problema || "Sem descrição",
        nitidez: metricas.nitidez || 0,
        contraste: metricas.contraste || 0,
        exposicao: metricas.exposicao || 0,
        enquadramento: metricas.enquadramento || 0,
        upload: dados.upload || null
      }

      setResultado(resultadoFinal)

      const novoRegistro = {
        email: email,
        nome: imagem.name,
        paciente: paciente || "Não informado",
        registro: registro || "Não informado",
        tipoExame: tipoExame,
        modo: modo,
        status: resultadoFinal.status,
        problema: resultadoFinal.problema,
        data: new Date().toLocaleString()
      }

      const novoHistorico = [novoRegistro, ...historico]

      setHistorico(novoHistorico)

      localStorage.setItem(
        `historicoRadiaScan_${email}`,
        JSON.stringify(novoHistorico)
      )

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

  if(!logado){
    return(
      <div className="container">
        <div className="card login-card">
          <h1>🩻 RadiaScan IA</h1>
          <p>Entre com seu e-mail para salvar seus exames.</p>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button
            onClick={()=>{
              if(!email){
                alert("Digite um e-mail")
                return
              }

              localStorage.setItem("emailRadiaScan", email)
              setLogado(true)

              const historicoSalvo = localStorage.getItem(`historicoRadiaScan_${email}`)

              if(historicoSalvo){
                setHistorico(JSON.parse(historicoSalvo))
              }else{
                setHistorico([])
              }
            }}
          >
            Entrar
          </button>
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
          <p>Usuário: <strong>{email}</strong></p>
        </div>

        <div>
          <span className="online">● ONLINE</span>

          <button
            className="sair-btn"
            onClick={()=>{
              localStorage.removeItem("emailRadiaScan")
              setLogado(false)
              setEmail("")
              setHistorico([])
              setResultado(null)
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="grid">

        <section className="card upload-card">
          <h2>Enviar Exame</h2>

          <label>Tipo de Radiologia</label>
          <select value={modo} onChange={(e)=>setModo(e.target.value)}>
            <option>Humano</option>
            <option>Veterinário</option>
          </select>

          <label>Nome do Paciente</label>
          <input
            type="text"
            placeholder="Ex: Maria Silva"
            value={paciente}
            onChange={(e)=>setPaciente(e.target.value)}
          />

          <label>Registro / ID do Paciente</label>
          <input
            type="text"
            placeholder="Ex: 000123"
            value={registro}
            onChange={(e)=>setRegistro(e.target.value)}
          />

          <label>Data do Exame</label>
          <input
            type="date"
            value={dataExame}
            onChange={(e)=>setDataExame(e.target.value)}
          />

          <label>Tipo de Exame</label>
          <select
            value={tipoExame}
            onChange={(e)=>setTipoExame(e.target.value)}
          >
            <option>Radiografia</option>
            <option>Tomografia</option>
            <option>Ressonância</option>
            <option>Ultrassonografia</option>
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

              <p className="problema">{resultado.problema}</p>

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
              <strong>{historico.length}</strong>
              <span>Exames analisados</span>
            </div>

            <div>
              <strong>{historico.filter(item => item.status === "APROVADO").length}</strong>
              <span>Aprovados</span>
            </div>

            <div>
              <strong>{historico.filter(item => item.status !== "APROVADO").length}</strong>
              <span>Reprovados/Atenção</span>
            </div>
          </div>
        </section>

        <section className="card relatorio-card">
          <h2>Relatório Automático</h2>

          {resultado ? (
            <div className="relatorio-texto">
              <p><strong>Paciente:</strong> {paciente || "Não informado"}</p>
              <p><strong>Registro:</strong> {registro || "Não informado"}</p>
              <p><strong>Data do exame:</strong> {dataExame || "Não informada"}</p>
              <p><strong>Tipo de exame:</strong> {tipoExame}</p>
              <p><strong>Modo:</strong> {modo}</p>
              <p><strong>Resultado da IA:</strong> {resultado.status}</p>
              <p><strong>Observação técnica:</strong> {resultado.problema}</p>
            </div>
          ) : (
            <p className="vazio">
              O relatório será gerado após a análise da imagem.
            </p>
          )}
        </section>

        <section className="card relatorio-card">
          <h2>PEP / Prontuário Eletrônico</h2>

          <div className="pep-box">
            <p><strong>Paciente:</strong> {paciente || "Aguardando cadastro"}</p>
            <p><strong>Registro:</strong> {registro || "Aguardando registro"}</p>
            <p><strong>Exame:</strong> {tipoExame}</p>
            <p><strong>Data:</strong> {dataExame || "Não informada"}</p>
            <p><strong>Status IA:</strong> {resultado ? resultado.status : "Aguardando análise"}</p>
            <p><strong>Observação:</strong> {resultado ? resultado.problema : "Sem observação"}</p>
          </div>
        </section>

        <section className="card relatorio-card">
          <h2>Uploads Salvos</h2>

          {historico.length === 0 ? (
            <p className="vazio">Nenhum upload registrado ainda.</p>
          ) : (
            <ul className="lista-uploads">
              {historico.map((item, index) => (
                <li key={index}>
                  <strong>{item.nome}</strong>
                  <br />
                  E-mail: {item.email}
                  <br />
                  Paciente: {item.paciente}
                  <br />
                  Registro: {item.registro}
                  <br />
                  Exame: {item.tipoExame}
                  <br />
                  Modo: {item.modo}
                  <br />
                  Status: {item.status}
                  <br />
                  Observação: {item.problema}
                  <br />
                  Data: {item.data}
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  )
}

export default App