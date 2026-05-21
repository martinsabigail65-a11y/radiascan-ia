import cv2
import numpy as np

def verificar_nitidez(imagem_path):
    imagem = cv2.imread(imagem_path, 0)

    if imagem is None:
        return {
            "status": "ERRO",
            "problema": "Imagem não encontrada",
            "metricas": {}
        }

    nitidez_score = cv2.Laplacian(imagem, cv2.CV_64F).var()
    contraste_score = np.std(imagem)
    exposicao_score = np.mean(imagem)

    nitidez = min(100, int((nitidez_score / 300) * 100))
    contraste = min(100, int((contraste_score / 80) * 100))

    if exposicao_score < 80:
        exposicao = int((exposicao_score / 80) * 100)
    elif exposicao_score > 180:
        exposicao = int(100 - ((exposicao_score - 180) / 75) * 100)
    else:
        exposicao = 90

    enquadramento = 85

    problemas = []

    if nitidez < 60:
        problemas.append("Imagem borrada")

    if contraste < 60:
        problemas.append("Baixo contraste")

    if exposicao < 60:
        problemas.append("Exposição inadequada")

    status = "APROVADO" if len(problemas) == 0 else "ATENÇÃO"

    return {
        "status": status,
        "problema": "Qualidade OK" if len(problemas) == 0 else ", ".join(problemas),
        "metricas": {
            "nitidez": nitidez,
            "contraste": contraste,
            "exposicao": exposicao,
            "enquadramento": enquadramento
        }
    }