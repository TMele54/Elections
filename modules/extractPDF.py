import io, os
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfpage import PDFPage

import tabula


pdf_path = "C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\pdf\\events.pdf"
def extract_text_by_page(pdf_path):
    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh,
                                      caching=True,
                                      check_extractable=True):
            resource_manager = PDFResourceManager()
            fake_file_handle = io.StringIO()
            converter = TextConverter(resource_manager, fake_file_handle)
            page_interpreter = PDFPageInterpreter(resource_manager, converter)
            page_interpreter.process_page(page)

            text = fake_file_handle.getvalue()
            yield text

            # close open handles
            converter.close()
            fake_file_handle.close()


def extract_text(pdf_path):
    return extract_text_by_page(pdf_path)
'''
pages = extract_text(pdf_path)
for p in pages:
    print(p)
    input()
'''

# Read pdf into list of DataFrame
df = tabula.read_pdf(pdf_path, pages='all', stream=True, output_format="json",guess = False,  pandas_options={'header':None})
print(len(df))

yrs = []
events = []
l=0
with open('your_file.txt', 'w', encoding='utf-8') as f:
    for k in range(0,len(df)):
        for d in df[k]["data"]:
            yr = d[0]["text"]
            try:
                f.write("%s\n" % yr)
            except:
                print("BAD CHARACTER")
                print(l)
                l+=1
