import pdfplumber

path = r'C:\Users\rolda\source\Projects\cocha-tech\Infraestructura-UNICRON\docs\legalities'
fp = path + '/codigoProcesalCivil.pdf'
try:
    with pdfplumber.open(fp) as pdf:
        for i, page in enumerate(pdf.pages[:5]):
            text = page.extract_text()
            if text:
                print(f'--- Page {i+1} ---')
                print(text[:500])
except Exception as e:
    print(f'Error: {e}')
    # Try raw byte extraction
    with open(fp,'rb') as f:
        data = f.read()
    print(f'File size: {len(data)}')
    print(f'First 200 bytes: {data[:200]}')
