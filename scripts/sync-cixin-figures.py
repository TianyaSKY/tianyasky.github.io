"""Sync locally produced QwenLoRA training charts into the site assets.

Only real generated figures are copied. Placeholder SVGs are intentionally
not produced: every image under public/projects must be referenced by the
project article.
"""
import os
import re
from html import escape, unescape

OUT = "public/projects/cixin-singularity"
SRC = "/home/tianya/WorkPlace/QwenLoRA/figures"
COPIES = [
    ("图2_训练与验证损失曲线.svg", "loss-curves.svg"),
    ("图3_训练动态指标.svg", "dynamics.svg"),
]

FONT_FAMILY = "'Comic Sans MS', 'Comic Neue', 'Noto Sans SC', cursive"
OUTLINED_LABEL = re.compile(
    r'^(?P<indent> *)<!-- (?P<label>[^\n]+?) -->\n'
    r'(?P=indent)<g (?:style="(?P<style>[^"]*)" )?'
    r'transform="(?P<position>translate\([^)]+\)(?: rotate\([^)]+\))?) '
    r'scale\((?P<scale>[\d.]+) -[\d.]+\)">\n'
    r'(?P<glyphs>[\s\S]*?)^(?P=indent)</g>',
    re.MULTILINE,
)


def set_figure_font(svg):
    def editable_label(match):
        label = unescape(match["label"])
        if label.startswith("$"):
            exponent = re.fullmatch(r"\$\\mathdefault\{10\^\{(-?\d+)\}\}\$", label)
            if not exponent:
                raise ValueError(f"Unsupported outlined math label: {label}")
            body = f'10<tspan font-size="70%" baseline-shift="super">{exponent[1]}</tspan>'
        else:
            body = escape(label)
        size = float(match["scale"]) * 100
        style = f' style="{match["style"]}"' if match["style"] else ""
        glyph = re.search(r'<use xlink:href="#([^"]+)', match["glyphs"])
        weight = ' font-weight="700"' if glyph and "Bold" in glyph[1] else ""
        return (
            f'{match["indent"]}<text transform="{match["position"]}" '
            f'font-size="{size:g}"{weight}{style}>{body}</text>'
        )

    svg = OUTLINED_LABEL.sub(editable_label, svg)
    # Matplotlib can also export live text, with a font property in its inline style.
    return svg.replace(
        "</svg>",
        f' <style>text {{ font-family: {FONT_FAMILY} !important; }}</style>\n</svg>',
    )


def main():
    missing = []
    for source_name, target_name in COPIES:
        source = os.path.join(SRC, source_name)
        if not os.path.exists(source):
            missing.append(source)
            continue
        with open(source, encoding="utf-8") as original:
            svg = set_figure_font(original.read())
        with open(os.path.join(OUT, target_name), "w", encoding="utf-8") as target:
            target.write(svg)
    if missing:
        print("[cixin] missing source figures, skipped:", ", ".join(missing))


if __name__ == "__main__":
    main()
