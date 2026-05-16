import olefile, sys, os, re

path = r'C:\Users\rolda\source\Projects\cocha-tech\Infraestructura-UNICRON\docs\legalities'
files = sys.argv[1:]

for f in files:
    filepath = os.path.join(path, f)
    try:
        ole = olefile.OleFileIO(filepath)
        if ole.exists('WordDocument'):
            # Try 1Table then 0Table
            stream = None
            for s in ['1Table', '0Table']:
                if ole.exists(s):
                    stream = ole.openstream(s)
                    break
            if stream is None:
                print(f'=== {f} ===\nNo table stream found\n')
                ole.close()
                continue
            data = stream.read()
            text = data.decode('latin-1', errors='replace')
            # Filter printable chunks
            found = re.findall(r'[\x20-\xFF][\x20-\xFF]{10,}', text)
            print(f'=== {f} ===')
            for s in found[:40]:
                print(re.sub(r'[\x7f-\xff]', '', s)[:200])
            print()
        ole.close()
    except Exception as e:
        print(f'=== {f} ===\nError: {e}\n')
