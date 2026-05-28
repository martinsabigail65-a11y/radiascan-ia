import random
import json
import os
import smtplib
from email.mime.text import MIMEText
from passlib.hash import pbkdf2_sha256
from dotenv import load_dotenv

load_dotenv()

USERS_FILE = "usuarios.json"
CODES_FILE = "codigos.json"

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def carregar_json(arquivo):
    if not os.path.exists(arquivo):
        return {}

    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)


def salvar_json(arquivo, dados):
    with open(arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4)


def enviar_codigo_email(email, codigo):
    mensagem = MIMEText(
        f"Seu código de acesso ao RadiaScan IA é: {codigo}"
    )

    mensagem["Subject"] = "Código de confirmação - RadiaScan IA"
    mensagem["From"] = EMAIL_USER
    mensagem["To"] = email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
        servidor.login(EMAIL_USER, EMAIL_PASSWORD)
        servidor.send_message(mensagem)


def registrar_usuario(email, senha):
    usuarios = carregar_json(USERS_FILE)

    if email in usuarios:
        return {"erro": "E-mail já cadastrado"}

    codigo = str(random.randint(100000, 999999))

    usuarios[email] = {
        "senha": pbkdf2_sha256.hash(senha),
        "confirmado": False
    }

    codigos = carregar_json(CODES_FILE)
    codigos[email] = codigo

    salvar_json(USERS_FILE, usuarios)
    salvar_json(CODES_FILE, codigos)

    enviar_codigo_email(email, codigo)

    return {"mensagem": "Código enviado para o e-mail"}


def confirmar_codigo(email, codigo):
    usuarios = carregar_json(USERS_FILE)
    codigos = carregar_json(CODES_FILE)

    if email not in usuarios:
        return {"erro": "Usuário não encontrado"}

    if codigos.get(email) != codigo:
        return {"erro": "Código incorreto"}

    usuarios[email]["confirmado"] = True

    salvar_json(USERS_FILE, usuarios)

    if email in codigos:
        del codigos[email]

    salvar_json(CODES_FILE, codigos)

    return {"mensagem": "Conta confirmada com sucesso"}


def login_usuario(email, senha):
    usuarios = carregar_json(USERS_FILE)

    if email not in usuarios:
        return {"erro": "Usuário não encontrado"}

    usuario = usuarios[email]

    if not pbkdf2_sha256.verify(senha, usuario["senha"]):
        return {"erro": "Senha incorreta"}

    if not usuario["confirmado"]:
        return {"erro": "E-mail ainda não confirmado"}

    return {
        "mensagem": "Login realizado com sucesso",
        "email": email
    }