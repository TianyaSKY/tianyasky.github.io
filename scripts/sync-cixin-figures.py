"""Sync locally produced QwenLoRA training charts into the site assets.

Only real generated figures are copied. Placeholder SVGs are intentionally
not produced: every image under public/projects must be referenced by the
project article.
"""
import os
import shutil

OUT = "public/projects/cixin-singularity"
SRC = "/home/tianya/WorkPlace/QwenLoRA/figures"
COPIES = [
    ("图2_训练与验证损失曲线.svg", "loss-curves.svg"),
    ("图3_训练动态指标.svg", "dynamics.svg"),
]


def main():
    missing = []
    for source_name, target_name in COPIES:
        source = os.path.join(SRC, source_name)
        if not os.path.exists(source):
            missing.append(source)
            continue
        shutil.copyfile(source, os.path.join(OUT, target_name))
    if missing:
        print("[cixin] missing source figures, skipped:", ", ".join(missing))


if __name__ == "__main__":
    main()
