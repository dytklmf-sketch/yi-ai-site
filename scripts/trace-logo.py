"""Normalize a generated logo to one ink and keep a local reference trace."""

import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from PIL import Image
import vtracer

ROOT = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=ROOT / "assets/logo/generated/easyai-yi-original.png")
    parser.add_argument("--prefix", default="easyai-yi")
    args = parser.parse_args()
    if not args.prefix or Path(args.prefix).name != args.prefix or args.prefix in (".", ".."):
        parser.error("--prefix must be a filename prefix, not a path")
    generated = ROOT / "assets/logo/generated"
    normalized = generated / f"{args.prefix}-normalized.png"
    trace = generated / f"{args.prefix}-trace.svg"
    image = Image.open(args.source).convert("RGB")
    cleaned = Image.new("RGBA", image.size)
    output = []
    for red, green, blue in image.getdata():
        if blue - red > 55 and blue > 110:
            output.append((36, 91, 219, 255))
        else:
            output.append((0, 0, 0, 0))
    cleaned.putdata(output)
    bounds = cleaned.getbbox()
    if not bounds:
        raise ValueError("No blue foreground found")
    cleaned.save(normalized)
    vtracer.convert_image_to_svg_py(
        str(normalized), str(trace), colormode="color", hierarchical="stacked",
        mode="spline", filter_speckle=32, color_precision=8, corner_threshold=80,
        length_threshold=4, splice_threshold=45, path_precision=3,
    )
    traced = ET.parse(trace).getroot()
    left, top, right, bottom = bounds
    scale = 56 / max(right - left, bottom - top)
    offset_x = (64 - (right - left) * scale) / 2 - left * scale
    offset_y = (64 - (bottom - top) * scale) / 2 - top * scale
    master = ET.Element(f"{{{SVG}}}svg", {"viewBox": "0 0 64 64"})
    group = ET.SubElement(master, f"{{{SVG}}}g", {
        "transform": f"translate({offset_x:.5f} {offset_y:.5f}) scale({scale:.7f})",
    })
    for shape in traced:
        if shape.tag == f"{{{SVG}}}path":
            fill = shape.get("fill", "").lower()
            if fill != "#245bdb":
                raise ValueError(f"Unexpected traced palette: {fill}")
            group.append(shape)
    if not len(group):
        raise ValueError("Trace contains no paths")
    # Keep the trace as a reference; never overwrite the production-cleaned master.
    ET.ElementTree(master).write(
        generated / f"{args.prefix}-traced-master.svg", encoding="unicode"
    )
    print(json.dumps({"source_size": image.size, "bounds": bounds, "paths": len(group)}))


if __name__ == "__main__":
    main()
