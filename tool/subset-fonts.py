"""按已生成的官网文本裁剪现有字体，不下载、不重新命名字体。"""
import argparse
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
pages = [root / 'index.html', *root.glob('features/**/index.html'),
         *(root / folder / 'index.html' for folder in ('platforms', 'guide', 'privacy', 'faq'))]
text = ''.join(page.read_text(encoding='utf-8') for page in pages)
text += (root / 'script.js').read_text(encoding='utf-8')
text += (root / 'motion.js').read_text(encoding='utf-8')
text += ''.join(chr(code) for code in range(32, 127))
for style, dest in [('Regular', 'regular'), ('SemiBold', 'semibold')]:
    font = TTFont(args.source_dir / f'FlowMuseSans-{style}.ttf', recalcTimestamp=False)
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = 'woff2'
    path = root / 'assets' / f'flowmuse-{dest}.woff2'
    font.save(path)
    font.close()
    print(f'{path.name}: {path.stat().st_size} bytes')
