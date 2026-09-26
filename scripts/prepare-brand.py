"""Create local font subsets and outlined lockups for the selected whale A mark."""

import argparse
from copy import deepcopy
from pathlib import Path
import xml.etree.ElementTree as ET

from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)


def outline(font, text, size, x, baseline):
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font["head"].unitsPerEm
    paths = []
    for character in text:
        glyph = cmap[ord(character)]
        pen = SVGPathPen(glyphs)
        glyphs[glyph].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        paths.append(pen.getCommands())
        x += font["hmtx"].metrics[glyph][0] * scale
    return " ".join(paths), x


def make_subset(source, text, target):
    font = TTFont(source)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(target)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--font-source", type=Path, required=True)
    parser.add_argument("--skip-fonts", action="store_true")
    args = parser.parse_args()
    latin = args.font_source / "Manrope.ttf"
    chinese = args.font_source / "NotoSansSC.ttf"
    brand = ROOT / "public/brand"
    fonts = ROOT / "public/fonts"
    fonts.mkdir(parents=True, exist_ok=True)
    copy = "".join(
        path.read_text()
        for path in (ROOT / "src").rglob("*")
        if path.suffix in (".ts", ".astro", ".md")
    )
    copy += "易AI Easy AI 易懂易用易落地让业务应用模型基础设施合作"
    latin_chars = "".join(chr(code) for code in range(32, 383)) + "‘’“”–—·©→"
    chinese_chars = "".join(sorted(set(char for char in copy if ord(char) >= 0x2E80)))
    if not args.skip_fonts:
        make_subset(latin, latin_chars, fonts / "manrope-latin.woff2")
        make_subset(chinese, chinese_chars, fonts / "noto-sans-sc-site.woff2")

    latin_font = instantiateVariableFont(TTFont(latin), {"wght": 650})
    chinese_font = instantiateVariableFont(TTFont(chinese), {"wght": 650})
    master = ET.parse(ROOT / "assets/logo/mark.svg").getroot()
    small = ET.parse(ROOT / "assets/logo/mark-small.svg").getroot()
    mark_width, mark_height = 100, 64
    # Keep the approved symbol-to-word ratio and clear the English y descender.
    lockup_height = 72
    word_x = mark_width + 10
    for lang in ("zh", "en"):
        if lang == "zh":
            # The EAI monogram is separate from the full Chinese brand name.
            yi, end = outline(chinese_font, "易", 52, word_x, 51)
            ai, end = outline(latin_font, "AI", 56, end + 3, 52)
            word = f"{yi} {ai}"
        else:
            word, end = outline(latin_font, "Easy AI", 56, word_x, 51)
        for variant, ink in (
            ("", "#20242c"),
            ("-mono", "#20242c"),
            ("-inverse", "#ffffff"),
        ):
            svg = ET.Element(f"{{{SVG}}}svg", {
                "width": f"{end + 3:.2f}",
                "height": str(lockup_height),
                "viewBox": f"0 0 {end + 3:.2f} {lockup_height}",
                "data-direction": master.attrib["data-direction"],
            })
            mark = deepcopy(master)
            mark.set("width", str(mark_width))
            mark.set("height", str(mark_height))
            for shape in mark.iter():
                if "fill" in shape.attrib and variant:
                    shape.set("fill", ink)
            svg.append(mark)
            ET.SubElement(svg, f"{{{SVG}}}path", {"d": word, "fill": ink})
            ET.ElementTree(svg).write(brand / f"logo-{lang}{variant}.svg", encoding="unicode")
    for variant, ink in (("", "#245bdb"), ("-mono", "#20242c"), ("-inverse", "#ffffff")):
        symbol = deepcopy(master)
        for shape in symbol.iter():
            if "fill" in shape.attrib:
                shape.set("fill", ink)
        ET.ElementTree(symbol).write(brand / f"logo-symbol{variant}.svg", encoding="unicode")
    for filename in ("logo-symbol-small.svg", "favicon.svg"):
        ET.ElementTree(small).write(brand / filename, encoding="unicode")
    print("Prepared six outlined whale A lockups, four symbol variants and optical favicon."
          + (" Existing fonts retained." if args.skip_fonts else " Two WOFF2 subsets updated."))


if __name__ == "__main__":
    main()
