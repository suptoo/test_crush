import json
import zipfile
from collections import defaultdict
from pathlib import Path
import xml.etree.ElementTree as ET

DOC_PATH = Path('October_Hours_Final_90 (1).docx')

if not DOC_PATH.exists():
    raise SystemExit(f"File not found: {DOC_PATH}")

with zipfile.ZipFile(DOC_PATH) as docx_zip:
    xml_data = docx_zip.read('word/document.xml')

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
root = ET.fromstring(xml_data)

def get_text(element):
    # Concatenate all text nodes inside the element
    texts = []
    for node in element.findall('.//w:t', ns):
        if node.text:
            texts.append(node.text)
    return ''.join(texts).strip()

tables = []
for table in root.findall('.//w:tbl', ns):
    table_rows = []
    for row in table.findall('.//w:tr', ns):
        row_cells = []
        for cell in row.findall('.//w:tc', ns):
            cell_text = get_text(cell)
            row_cells.append(cell_text)
        # Add row only if it contains any text
        if any(cell for cell in row_cells):
            table_rows.append(row_cells)
    if table_rows:
        tables.append(table_rows)

paragraphs = []
for para in root.findall('.//w:p', ns):
    text = get_text(para)
    if text:
        paragraphs.append(text)

output = {
    'tables': tables,
    'paragraphs': paragraphs
}

print(json.dumps(output, indent=2, ensure_ascii=False))
