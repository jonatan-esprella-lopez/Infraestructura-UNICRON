import olefile, os, re

path = r'C:\Users\rolda\source\Projects\cocha-tech\Infraestructura-UNICRON\docs\legalities'
files = ['AlquilerInmueble.doc', 'Aticretico.doc', 'Contrato_MedianteIntermediario.doc', 
         'Contrato_ReservaPropiedades.doc', 'Contrato_VentaDirecta.doc', 'Contrato_VentaConArras.doc']

for f in files:
    fp = os.path.join(path, f)
    print(f'=== {f} ===')
    try:
        ole = olefile.OleFileIO(fp)
        ws = ole.openstream('WordDocument')
        raw = ws.read()
        text = raw.decode('utf-8', errors='replace')
        # Filter meaningful sequences
        chunks = re.findall(r'[A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s\.,;:()"\'-]{15,}', text)
        for c in chunks[:80]:
            c = c.strip()
            if len(c) > 15:
                print(c[:300])
        ole.close()
    except Exception as e:
        print(f'Error: {e}')
    print()
