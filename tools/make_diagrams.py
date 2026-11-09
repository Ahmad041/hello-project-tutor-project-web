from pathlib import Path
from html import escape
from diagram_specs import FLOW, ERD, data_model, mermaid_flow, mermaid_model

ROOT = Path(__file__).resolve().parent
OUT = ROOT/'diagrams'
P, B, I, M, R, A = '#050c16', '#0d1725', '#edf3fc', '#b2c1d5', '#34465e', '#ebd1a1'

KEY_PK, KEY_FK, KEY_UK = '#fbbf24', '#94a3b8', '#38bdf8'

def text(x,y,value,size=16,color=I,anchor='start'):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" font-family="Sora, system-ui, sans-serif">{escape(value)}</text>'

def key_icon(x, y, color, title=''):
    cy = y - 4
    return (
        f'<g class="key-icon" role="img">'
        f'<title>{escape(title)}</title>'
        f'<circle cx="{x+4.5}" cy="{cy}" r="3" fill="none" stroke="{color}" stroke-width="1.3"/>'
        f'<path d="M{x+7.5} {cy}H{x+13.5} M{x+10.5} {cy}V{cy+3} M{x+13} {cy}V{cy+2.5}" fill="none" stroke="{color}" stroke-width="1.3" stroke-linecap="round"/>'
        f'</g>'
    )

def label(x,y,value):
    width=len(value)*7.8+16
    return f'<rect x="{x-width/2}" y="{y-15}" width="{width}" height="22" fill="{P}"/>'+text(x,y,value,12,M,'middle')

def shape(kind,x,y,w,h,title,sub=''):
    if kind=='decision':
        drawing=f'<path d="M{x+w/2} {y}L{x+w} {y+h/2}L{x+w/2} {y+h}L{x} {y+h/2}Z" fill="{B}" stroke="{A}"/>'
    elif kind=='io':
        drawing=f'<path d="M{x+20} {y}H{x+w}L{x+w-20} {y+h}H{x}Z" fill="{B}" stroke="{R}"/>'
    else:
        drawing=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2 if kind=="end" else 6}" fill="{B}" stroke="{R}"/>'
    return drawing+text(x+w/2,y+h/2+(5 if not sub else -3),title,16,I,'middle')+(text(x+w/2,y+h/2+21,sub,12,M,'middle') if sub else '')

def entity(name,pos,fields,is_erd=False):
    x,y=pos;w=320;h=72+28*len(fields)
    result=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{B}" stroke="{R}"/><path d="M{x} {y+56}H{x+w}" stroke="{R}"/>'
    badge = 'ENTITAS KONSEPTUAL' if is_erd else 'DATA / RECORD'
    result+=text(x+16,y+22,badge,10,M)+text(x+16,y+44,name,16,A)
    for i,(attr,typ,key) in enumerate(fields):
        y_line = y + 80 + 28 * i
        icons_svg = ''
        x_cursor = x + 16
        if 'PK' in key:
            icons_svg += key_icon(x_cursor, y_line, KEY_PK, 'Primary Key (PK)')
            x_cursor += 16
        if 'FK' in key:
            icons_svg += key_icon(x_cursor, y_line, KEY_FK, 'Foreign Key (FK)')
            x_cursor += 16
        if 'UK' in key:
            icons_svg += key_icon(x_cursor, y_line, KEY_UK, 'Unique (UK)')
            x_cursor += 16
        text_x = max(x_cursor + 4, x + 36)
        result += icons_svg + text(text_x, y_line, attr, 12, I)
        if typ:
            result += text(x+w-16, y_line, typ, 12, M, 'end')
    return result

def source_panel(slug):
    source=(OUT/(slug+'.mmd')).read_text(encoding='utf-8')
    return '<details class="mermaid-source"><summary>Lihat source Mermaid</summary><div class="codebar"><span>'+slug+'.mmd</span><button class="copy" type="button">Salin source</button></div><pre tabindex="0"><code>'+escape(source)+'</code></pre><p><a href="'+slug+'.mmd" download>Unduh .mmd</a></p></details>'

def save(slug,title,desc,body,notes,height,source):
    (OUT/(slug+'.mmd')).write_text(source,encoding='utf-8')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 {height}" role="img" aria-labelledby="{slug}-title {slug}-desc"><title id="{slug}-title">{escape(title)}</title><desc id="{slug}-desc">{escape(desc)}</desc><defs><marker id="{slug}-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 1L7 4L0 7" fill="{M}"/></marker></defs>{body}</svg>'
    html='<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' | KasirKita</title><link rel="stylesheet" href="../assets/css/diagrams.css"><script src="../assets/js/diagram-source.js" defer></script></head><body><main><a href="../project.html#probis">Kembali ke Dokumen Persiapan</a><h1>'+escape(title)+'</h1><p>'+escape(desc)+'</p><div class="canvas">'+svg+'</div><p>'+escape(notes)+'</p>'+source_panel(slug)+'<footer>Diagram Design · Rancangan latihan KasirKita C/TXT.</footer><p role="status" aria-live="polite" class="copy-feedback"></p></main></body></html>'
    (OUT/(slug+'.html')).write_text(html,encoding='utf-8')
    return svg

def generate():
    drawings={}
    slug='flowchart-checkout'
    body=''
    for _,_,_,path,_ in FLOW['edges']:
        body+=f'<path d="{path}" fill="none" stroke="{M}" stroke-width="1.5" marker-end="url(#{slug}-arrow)"/>'
    for _,kind,title,sub,pos in FLOW['nodes']:
        body+=shape(kind,*pos,title,sub)
    for _,_,value,_,pos in FLOW['edges']:
        if value:body+=label(*pos,value)
    body+=text(40,998,'OVAL: mulai/selesai · KOTAK: proses · DIAMOND: keputusan · PARALELOGRAM: input/output',13,M)
    drawings[slug]=save(slug,'Flowchart checkout','Nota hanya ditampilkan setelah input valid dan penyimpanan berhasil.',body,'Panah menunjukkan arah alur. Lingkaran connector dipakai hanya jika perlu menyambungkan bagian pada halaman yang sama. Simpan gagal tidak mengubah data aktif; pemulihan file dijalankan sebelum mencoba ulang.',1040,mermaid_flow())
    for slug,model,title in [('erd-awal',ERD,'ERD awal'),('pdm-normalisasi',data_model(False),'PDM setelah normalisasi'),('pdm-denormalisasi',data_model(True),'PDM setelah denormalisasi')]:
        is_erd = (slug == 'erd-awal')
        body=''.join(f'<path d="{rel[4]}" fill="none" stroke="{M}" stroke-width="1.5"/>' for rel in model['relations'])
        body+=''.join(entity(*ent, is_erd=is_erd) for ent in model['entities'])
        for _,_,a,b,_,ends,verbs in model['relations']:
            body+=label(*ends[0],a)+label(*ends[1],b)
            body+=label(*verbs[0],'memiliki >')+label(*verbs[1],'< dimiliki')
        height=760 if not is_erd else 640
        if is_erd:
            body+=key_icon(40, height-52, KEY_PK, 'Primary Key')
            body+=text(60, height-52, 'Kunci Kuning: Primary Key (PK entitas)', 12, M)
        else:
            body+=key_icon(40, height-52, KEY_PK, 'Primary Key')
            body+=text(60, height-52, 'Kunci Kuning: PK', 12, M)
            body+=key_icon(190, height-52, KEY_FK, 'Foreign Key')
            body+=text(210, height-52, 'Kunci Abu-abu: FK', 12, M)
            body+=key_icon(350, height-52, KEY_UK, 'Unique Key')
            body+=text(370, height-52, 'Kunci Biru: Unique (UK)', 12, M)
        body+=text(40,height-24,'1...1: tepat satu · 0...1: satu opsional · 1...*: satu atau banyak · 0...*: nol atau banyak',13,M)
        notes='ID dan referensi ID memakai VARCHAR(20), dipetakan ke char[21] di C. Relasi diperiksa oleh program C, bukan constraint SQL otomatis.'
        if is_erd:notes='Pada ERD konseptual awal belum ada Foreign Key (FK) maupun tipe data teknis. Relasi dimodelkan langsung antar-entitas; items adalah daftar berulang pada model awal.'
        elif slug=='pdm-denormalisasi':notes+=' SALE.total harus sama dengan jumlah quantity × unit_price. Harga item menyimpan harga saat transaksi.'
        drawings[slug]=save(slug,title,'Kardinalitas dan kata memiliki/dimiliki menunjukkan hubungan record KasirKita.',body,notes,height,mermaid_model(model))
    return drawings


if __name__=='__main__':
    print('Generated',len(generate()),'Diagram Design diagrams with Mermaid sources')
