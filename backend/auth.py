import json
import os
from passlib.hash import pbkdf2_sha256

USERS_FILE = "usuarios.json"


def carregar_json(arquivo):
    if not os.path.exists(arquivo):
        return {}

    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)


def salvar_json(arquivo, dados):
    with open(arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4)


def registrar_usuario(email, senha):
    usuarios = carregar_json(USERS_FILE)

    if email in usuarios:
        return {"erro": "E-mail já cadastrado"}

    usuarios[email] = {
        "senha": pbkdf2_sha256.hash(senha),
        "confirmado": True
    }

    salvar_json(USERS_FILE, usuarios)

    return {
        "mensagem": "Conta criada com sucesso",
        "email": email
    }


def confirmar_codigo(email, codigo):
    return {
        "mensagem": "Confirmação por código desativada",
        "email": email
    }


def login_usuario(email, senha):
    usuarios = carregar_json(USERS_FILE)

    if email not in usuarios:
        return {"erro": "Usuário não encontrado"}

    usuario = usuarios[email]

    if not pbkdf2_sha256.verify(senha, usuario["senha"]):
        return {"erro": "Senha incorreta"}

    return {
        "mensagem": "Login realizado com sucesso",
        "email": email
    }