"""Generate an explicitly approved set of distinct logo directions."""

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = """Design one original artistic brand symbol for 易AI / Easy AI, a practical AI services company whose promise is making AI easier to understand, use, and put into practice.

{direction}

This is one standalone direction, not a variation sheet. Produce exactly one centered symbol and no words. Art direction: contemporary international technology brand, refined, memorable, calm confidence, intelligent simplicity, slightly human warmth. Compact square silhouette, strong optical balance, generous negative space, distinctive at 24px. Use one flat cobalt blue #245BDB on pure white, crisp vector-like edges. No gradients, shadows, 3D, cyan, glow, mockup, text, border badge, enclosing circle, generic spark, brain, robot, chat bubble, infinity loop, circuit pattern, lightning bolt, gateway, folded ribbon, or app-icon container. Do not create a collage or multiple options. The symbol should occupy about 68 percent of a 1024px square."""


def write_receipt(path, receipt):
    path.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")


def normalize(result):
    for image in result.get("data") or []:
        encoded = image.get("b64_json", "")
        if encoded.startswith("data:"):
            image["b64_json"] = encoded.split(",", 1)[1]
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--directions", type=Path, required=True)
    parser.add_argument("--receipt", type=Path, required=True)
    parser.add_argument("--model", default="gpt-image-2.5-sunburst")
    parser.add_argument("--quality", choices=("low", "medium", "high"), default="low")
    args = parser.parse_args()

    spec = importlib.util.spec_from_file_location("ccg_image", args.skill)
    skill = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(skill)
    key = skill.load_key(None)
    directions = json.loads(args.directions.read_text())
    destination = ROOT / "assets/logo/generated/directions"
    destination.mkdir(parents=True, exist_ok=True)
    receipt = json.loads(args.receipt.read_text()) if args.receipt.exists() else {
        "model": args.model,
        "quality": args.quality,
        "size": "1024x1024",
        "directions": [],
    }
    existing = {item["id"]: item for item in receipt["directions"]}

    for direction in directions:
        if direction["id"] in existing:
            continue
        prompt = BASE.format(direction=direction["prompt"])
        options = skill.parse_args([
            "--prompt", prompt, "--quality", args.quality,
            "--model", args.model, "-n", "1",
        ])
        response = skill.request_json(
            f"{skill.BASE_URL}{skill.SUBMIT_PATH}", key, skill.build_payload(options)
        )
        job_id = response.get("jobId") or response.get("job_id")
        if not job_id:
            raise SystemExit(f"{direction['id']}: submission returned no job ID")
        item = {**direction, "jobId": job_id, "status": "submitted"}
        receipt["directions"].append(item)
        existing[direction["id"]] = item
        write_receipt(args.receipt, receipt)
        print(f"submitted {direction['id']}: {job_id}", flush=True)

    for direction in directions:
        item = existing[direction["id"]]
        output = destination / f"{direction['id']}.jpg"
        if item.get("status") == "succeeded" and output.exists():
            print(output, flush=True)
            continue
        final = skill.poll(item["jobId"], key, 420, 5, False)
        images = skill.extract_images(normalize(final.get("result") or {}))
        if len(images) != 1:
            raise SystemExit(f"{direction['id']}: expected one image, found {len(images)}")
        raw, mime = images[0]
        output = output.with_suffix(skill.sniff_ext(raw, mime))
        output.write_bytes(raw)
        item.update(status="succeeded", output=output.name)
        write_receipt(args.receipt, receipt)
        print(output, flush=True)


if __name__ == "__main__":
    main()
