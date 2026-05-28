from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from datetime import datetime

from backend.analyzer import verificar_nitidez
from backend.auth import registrar_usuario, confirmar_codigo, login_usuario

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UsuarioCadastro(BaseModel):
    email: str
    senha: str


class ConfirmacaoCodigo(BaseModel):
    email: str
    codigo: str


@app.post("/registrar")
def registrar(dados: UsuarioCadastro):
    return registrar_usuario(dados.email, dados.senha)


@app.post("/confirmar")
def confirmar(dados: ConfirmacaoCodigo):
    return confirmar_codigo(dados.email, dados.codigo)


@app.post("/login")
def login(dados: UsuarioCadastro):
    return login_usuario(dados.email, dados.senha)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"status": "RadiaScan IA Online"}


@app.post("/analisar")
async def analisar_imagem(file: UploadFile = File(...)):
    nome_seguro = file.filename.replace(" ", "_")
    data = datetime.now().strftime("%Y%m%d_%H%M%S")
    caminho = f"{UPLOAD_DIR}/{data}_{nome_seguro}"

    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resultado = verificar_nitidez(caminho)

    resultado["upload"] = {
        "nome": file.filename,
        "caminho": caminho,
        "data": data
    }

    return resultado