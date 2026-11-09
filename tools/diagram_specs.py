"""Satu model untuk referensi SVG dan source Mermaid KasirKita."""

FLOW = {
    'nodes': [
        ('start', 'end', 'Mulai', '', (660, 30, 240, 50)),
        ('input', 'io', 'Input barang, jumlah', 'dan pembayaran', (610, 120, 340, 72)),
        ('calculate', 'step', 'Hitung total', 'dari harga produk', (640, 240, 280, 64)),
        ('valid', 'decision', 'Input valid?', 'tipe, stok, dan uang', (640, 350, 280, 100)),
        ('save', 'step', 'Simpan transaksi', 'kandidat data dan stok', (640, 500, 280, 64)),
        ('saved', 'decision', 'Simpan berhasil?', '', (640, 610, 280, 100)),
        ('receipt', 'io', 'Tampilkan nota', 'transaksi tersimpan', (610, 760, 340, 72)),
        ('finish', 'end', 'Selesai', '', (660, 900, 240, 50)),
        ('error', 'io', 'Tampilkan kesalahan', 'data aktif tidak berubah', (100, 500, 320, 72)),
    ],
    'edges': [
        ('start','input','', 'M780 80V120', None),
        ('input','calculate','', 'M780 192V240', None),
        ('calculate','valid','', 'M780 304V350', None),
        ('valid','save','Ya', 'M780 450V500', (820,475)),
        ('valid','error','Tidak', 'M640 400H540V525H413', (568,386)),
        ('save','saved','', 'M780 564V610', None),
        ('saved','receipt','Ya', 'M780 710V760', (820,736)),
        ('saved','error','Tidak', 'M640 660H520V550H406', (570,684)),
        ('error','input','Perbaiki / coba lagi', 'M110 536H60V156H620', (275,139)),
        ('receipt','finish','', 'M780 832V900', None),
    ],
}

def field(name, typ, key=''):
    return (name, typ, key)

def data_model(denormalized=False):
    return {
        'entities': [
            ('CATEGORY', (40,64), [field('id_category','VARCHAR(20)','PK'),field('name','VARCHAR(64)')]),
            ('PRODUCT', (480,64), [field('id_product','VARCHAR(20)','PK'),field('id_category','VARCHAR(20)','FK'),field('sku','VARCHAR(32)','UK'),field('name','VARCHAR(128)'),field('price','INTEGER'),field('stock','INTEGER')]),
            ('CUSTOMER', (40,424), [field('id_customer','VARCHAR(20)','PK'),field('name','VARCHAR(128)'),field('phone','VARCHAR(32)')]),
            ('SALE', (480,424), [field('id_sale','VARCHAR(20)','PK'),field('id_customer','VARCHAR(20)','FK'),field('created_at','VARCHAR(20)'),field('paid','INTEGER')]+([field('total','INTEGER')] if denormalized else [])),
            ('ITEM', (920,292), [field('id_product','VARCHAR(20)','PK, FK'),field('id_sale','VARCHAR(20)','PK, FK'),field('quantity','INTEGER'),field('unit_price','INTEGER')]),
        ],
        'relations': [
            ('CATEGORY','PRODUCT','1...1','0...*','M360 144H416V172H480', [(380,130),(454,158)], [(420,204),(420,228)]),
            ('CUSTOMER','SALE','0...1','0...*','M360 504H416V532H480', [(386,490),(454,518)], [(420,564),(420,588)]),
            ('PRODUCT','ITEM','1...1','0...*','M800 144H880V372H920', [(820,130),(894,354)], [(860,224),(860,248)]),
            ('SALE','ITEM','1...1','1...*','M800 504H872V400H920', [(820,490),(894,430)], [(860,564),(860,588)]),
        ]
    }

ERD = {
    'entities': [
        ('PELANGGAN',(40,160),[field('id_pelanggan','','PK'),field('nama',''),field('telepon','')]),
        ('NOTA_AWAL',(480,160),[field('id_nota','','PK'),field('waktu',''),field('items',''),field('dibayar','')]),
        ('PRODUK',(920,160),[field('id_produk','','PK'),field('nama_produk',''),field('nama_kategori',''),field('harga',''),field('stok','')]),
    ],
    'relations': [
        ('PELANGGAN','NOTA_AWAL','0...1','0...*','M360 248H480',[(386,230),(454,230)],[(420,400),(420,424)]),
        ('NOTA_AWAL','PRODUK','0...*','1...*','M800 248H920',[(826,230),(894,230)],[(860,400),(860,424)]),
    ]
}

def mermaid_flow():
    lines=['flowchart TD']
    formats={'end':'{id}(["{label}"])','step':'{id}["{label}"]','decision':'{id}{{"{label}"}}','io':'{id}[/"{label}"/]'}
    for node,kind,title,sub,_ in FLOW['nodes']:
        lines.append('    '+formats[kind].format(id=node,label=title+('<br/>'+sub if sub else '')))
    for a,b,label,_,_ in FLOW['edges']:
        lines.append(f'    {a} -->'+(f'|"{label}"|' if label else '')+f' {b}')
    return '\n'.join(lines)+'\n'

def mermaid_model(model):
    left={'1...1':'||','0...1':'|o','0...*':'}o','1...*':'}|'}
    right={'1...1':'||','0...1':'o|','0...*':'o{','1...*':'|{'}
    lines=['erDiagram']
    for name,_,fields in model['entities']:
        lines.append('    '+name+' {')
        for attr,typ,key in fields:
            if typ:
                lines.append(f'        {typ} {attr}'+(' '+key if key else ''))
            else:
                lines.append(f'        {attr}'+(' '+key if key else ''))
        lines.append('    }')
    for parent,child,a,b,*_ in model['relations']:
        lines.append(f'    {parent} {left[a]}--{right[b]} {child} : "memiliki / dimiliki ({a} : {b})"')
    return '\n'.join(lines)+'\n'
