import olefile, os, io, re, zlib

path = r'C:\Users\rolda\source\Projects\cocha-tech\Infraestructura-UNICRON\docs\legalities'
files = ['AlquilerInmueble.doc', 'Aticretico.doc', 'Contrato_MedianteIntermediario.doc', 
         'Contrato_ReservaPropiedades.doc', 'Contrato_VentaDirecta.doc', 'Contrato_VentaConArras.doc']

for f in files:
    fp = os.path.join(path, f)
    print(f'=== {f} ===')
    try:
        ole = olefile.OleFileIO(fp)
        print(f'Streams: {ole.listdir()}')
        
        # Look for Word binary streams
        for stream_path in ole.listdir():
            name = '/'.join(stream_path)
            if 'WordDocument' in name or 'body' in name.lower() or 'story' in name.lower() or 'paragraph' in name.lower():
                print(f'Found relevant stream: {name}')
        
        # Try to get the WordDocument stream (binary format)
        if ole.exists('WordDocument'):
            ws = ole.openstream('WordDocument')
            raw = ws.read()
            # Try to extract text from binary WordDocument stream
            # Look for UTF-16LE runs (common in OLE .doc)
            try:
                text = raw.decode('utf-16-le', errors='replace')
                # Filter printable
                found = re.findall(r'[^\x00-\x1f\x7f-\xff]{5,}', text)
                if found:
                    print('UTF-16LE text found:')
                    for s in found[:30]:
                        print(s[:200])
                else:
                    print('No readable UTF-16LE text')
            except:
                pass
            
            # Try UTF-8
            try:
                text = raw.decode('utf-8', errors='replace')
                found = re.findall(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{10,}', text)
                if found:
                    print('UTF-8 text found:')
                    for s in found[:30]:
                        print(s[:200])
            except:
                pass
        
        ole.close()
    except Exception as e:
        print(f'Error: {e}')
    print()
