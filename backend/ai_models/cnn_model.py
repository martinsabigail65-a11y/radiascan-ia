import torch
import torchvision.models as models

modelo = models.resnet18(
    pretrained=True
)

modelo.eval()
import kagglehub

# Download latest version
path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")

print("Path to dataset files:", path)
