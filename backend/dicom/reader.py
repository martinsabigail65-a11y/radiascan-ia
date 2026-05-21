import pydicom

def ler_dicom(caminho):

    ds = pydicom.dcmread(
        caminho
    )

    return ds.pixel_array