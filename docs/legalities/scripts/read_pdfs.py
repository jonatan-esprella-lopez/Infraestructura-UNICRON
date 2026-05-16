import pdfplumber, os, sys

path = r'C:\Users\rolda\source\Projects\cocha-tech\Infraestructura-UNICRON\docs\legalities'

for f in ['codigoCivilBolivia.pdf', 'codigoProcesalCivil.pdf']:
    fp = os.path.join(path, f)
    print(f'=== {f} ===')
    try:
        with pdfplumber.open(fp) as pdf:
            for i, page in enumerate(pdf.pages[:3]):
                text = page.extract_text()
                if text:
                    print(f'--- Page {i+1} ---')
                    print(text[:500])
    except Exception as e:
        print(f'Error: {e}')
    print()

# Images
from PIL import Image
for f in ['CompraVenta.jpeg', 'VisitacionMinutas.jpeg']:
    fp = os.path.join(path, f)
    print(f'=== {f} ===')
    try:
        img = Image.open(fp)
        print(f'Size: {img.size}, Mode: {img.mode}')
        # Save a tiny thumbnail to temp
        thumb = img.resize((400, 300))
        out = os.path.join(r'C:\Users\rolda\AppData\Local\Temp\kilo', f.replace('.jpeg','.png'))
        thumb.save(out)
        print(f'Thumbnail saved to: {out}')
    except Exception as e:
        print(f'Error: {e}')
    print()
