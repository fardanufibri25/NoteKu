"""Rebuild the icon font with only the glyphs used in src.

Requires: pip install fonttools brotli, and @fontsource/material-symbols-outlined
as a dev dependency (the source font). Run with `npm run icons` after adding an icon.
"""

import re
import subprocess
import sys
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
FONT = (
    ROOT
    / 'node_modules/@fontsource/material-symbols-outlined/files'
    / 'material-symbols-outlined-latin-400-normal.woff2'
)
OUT = SRC / 'assets/material-symbols-subset.woff2'

ICON_TEXT = re.compile(r'material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*<')
STRING = re.compile(r'["\']([a-z][a-z0-9_]*)["\']')

names = set()
sources = [file.read_text(encoding='utf-8') for file in SRC.rglob('*.jsx')]
for source in sources:
    names.update(ICON_TEXT.findall(source))

font = TTFont(FONT)
reverse_cmap = {glyph: code for code, glyph in font.getBestCmap().items()}
ligatures = {}
for lookup in font['GSUB'].table.LookupList.Lookup:
    for subtable in lookup.SubTable:
        subtable = getattr(subtable, 'ExtSubTable', subtable)
        if not hasattr(subtable, 'ligatures'):
            continue
        for first, entries in subtable.ligatures.items():
            for entry in entries:
                text = ''.join(
                    chr(reverse_cmap[glyph])
                    for glyph in [first, *entry.Component]
                    if glyph in reverse_cmap
                )
                ligatures[text] = entry.LigGlyph

missing = sorted(name for name in names if name not in ligatures)
if missing:
    sys.exit(f'No ligature for: {", ".join(missing)}')

# Any quoted lowercase identifier matching a ligature name is treated as an icon.
for source in sources:
    names.update(name for name in STRING.findall(source) if name in ligatures)

glyphs = sorted({ligatures[name] for name in names})
alphabet = ''.join(sorted(set(''.join(names))))
OUT.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(
    [
        sys.executable,
        '-m',
        'fontTools.subset',
        str(FONT),
        f'--text={alphabet}',
        f'--glyphs={",".join(glyphs)}',
        '--layout-features=*',
        '--no-layout-closure',
        '--flavor=woff2',
        f'--output-file={OUT}',
    ],
    check=True,
)
print(f'{len(names)} icons -> {OUT.stat().st_size} bytes')
