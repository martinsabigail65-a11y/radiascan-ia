import cv2
import numpy as np

def analisar_qualidade(imagem_path):

    imagem = cv2.imread(
        imagem_path,
        0
    )

    if imagem is None:

        return {
            "status":"ERRO"
        }

    # NITIDEZ
    nitidez = cv2.Laplacian(
        imagem,
        cv2.CV_64F
    ).var()

    # BRILHO
    brilho = np.mean(imagem)

    # CONTRASTE
    contraste = np.std(imagem)

    problemas = []

    if nitidez < 100:
        problemas.append(
            "Imagem borrada"
        )

    if brilho < 50:
        problemas.append(
            "Subexposição"
        )

    if brilho > 220:
        problemas.append(
            "Superexposição"
        )

    if contraste < 30:
        problemas.append(
            "Baixo contraste"
        )

    if len(problemas) == 0:

        return {
            "status":"APROVADO",
            "problema":"Qualidade OK"
        }

    return {
        "status":"REPROVADO",
        "problema": ", ".join(problemas)
    }