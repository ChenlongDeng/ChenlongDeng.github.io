#!/usr/bin/env python3
"""Generate metadata-free responsive WebP assets for the static site.

The originals remain untouched. Paper previews and logos use lossless WebP;
the portrait uses a high-quality photographic WebP after conversion to sRGB.
"""

from __future__ import annotations

import json
import re
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageCms, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OPTIMIZED = PUBLIC / "optimized"
MANIFEST = ROOT / "src" / "generated" / "responsive-images.json"


def normalized_image(path: Path) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        icc_profile = source.info.get("icc_profile")
        if icc_profile and image.mode == "RGB":
            image = ImageCms.profileToProfile(
                image,
                ImageCms.ImageCmsProfile(BytesIO(icc_profile)),
                ImageCms.createProfile("sRGB"),
                outputMode="RGB",
            )
        else:
            image = image.copy()

    if image.mode not in {"RGB", "RGBA"}:
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
    return image


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def maximum_crop_width(image: Image.Image, aspect: tuple[int, int]) -> int:
    aspect_ratio = aspect[0] / aspect[1]
    if image.width / image.height >= aspect_ratio:
        return round(image.height * aspect_ratio)
    return image.width


def generate_variants(
    source_path: Path,
    output_dir: Path,
    widths: list[int],
    *,
    lossless: bool,
    quality: int = 92,
) -> list[dict[str, str | int]]:
    image = normalized_image(source_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    stem = source_path.stem
    sources: list[dict[str, str | int]] = []

    for width in sorted(set(min(width, image.width) for width in widths)):
        output_path = output_dir / f"{stem}-{width}.webp"
        resized = resize_to_width(image, width)
        resized.save(
            output_path,
            "WEBP",
            lossless=lossless,
            quality=quality,
            method=6,
        )
        public_output = "/" + output_path.relative_to(PUBLIC).as_posix()
        sources.append({"src": public_output, "width": width})

    return sources


def generate_cropped_variants(
    source_path: Path,
    output_dir: Path,
    widths: list[int],
    *,
    aspect: tuple[int, int],
    variant_name: str,
) -> list[dict[str, str | int]]:
    image = normalized_image(source_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    stem = source_path.stem
    max_width = maximum_crop_width(image, aspect)
    sources: list[dict[str, str | int]] = []

    for width in sorted(set(min(width, max_width) for width in widths)):
        height = round(width * aspect[1] / aspect[0])
        cropped = ImageOps.fit(
            image,
            (width, height),
            Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
        output_path = output_dir / f"{stem}-{variant_name}-{width}.webp"
        cropped.save(
            output_path,
            "WEBP",
            lossless=True,
            exact=True,
            method=6,
        )
        public_output = "/" + output_path.relative_to(PUBLIC).as_posix()
        sources.append({"src": public_output, "width": width})

    return sources


def main() -> None:
    manifest: dict[str, dict[str, object]] = {}

    portrait = PUBLIC / "portrait.jpg"
    manifest["/portrait.jpg"] = {
        "sources": generate_variants(
            portrait,
            OPTIMIZED,
            [224, 448, 640],
            lossless=False,
            quality=92,
        )
    }

    bibliography = (ROOT / "content" / "publications.bib").read_text(encoding="utf-8")
    paper_names = sorted(
        set(re.findall(r"preview\s*=\s*\{([^}]+)\}", bibliography, flags=re.IGNORECASE))
    )
    paper_output_dir = OPTIMIZED / "papers"
    paper_output_dir.mkdir(parents=True, exist_ok=True)
    for generated_file in paper_output_dir.glob("*.webp"):
        generated_file.unlink()

    for paper_name in paper_names:
        paper = PUBLIC / "papers" / paper_name.strip()
        if not paper.is_file():
            raise FileNotFoundError(f"Missing paper preview: {paper}")
        public_source = f"/papers/{paper.name}"
        manifest[public_source] = {
            "variants": {
                "16x9": generate_cropped_variants(
                    paper,
                    paper_output_dir,
                    [384, 768, 1280],
                    aspect=(16, 9),
                    variant_name="16x9",
                ),
                "4x3": generate_cropped_variants(
                    paper,
                    paper_output_dir,
                    [384, 768, 1280],
                    aspect=(4, 3),
                    variant_name="4x3",
                ),
            }
        }

    for logo in sorted((PUBLIC / "logos").glob("*.png")):
        public_source = f"/logos/{logo.name}"
        manifest[public_source] = {
            "sources": generate_variants(
                logo,
                OPTIMIZED / "logos",
                [72, 108],
                lossless=True,
            )
        }

    avatar = normalized_image(PUBLIC / "avatar.jpg")
    avatar = ImageOps.fit(avatar, (64, 64), Image.Resampling.LANCZOS)
    avatar.save(PUBLIC / "favicon-64.png", "PNG", optimize=True)

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
