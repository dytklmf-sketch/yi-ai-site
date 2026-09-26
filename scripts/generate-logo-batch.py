"""Submit and recover an explicitly approved multi-job logo batch.

The receipt is written after every submission so interrupted runs resume existing
jobs instead of creating duplicate paid work. This is never called by builds.
"""

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def save_receipt(path, data):
    path.write_text(json.dumps(data, indent=2) + "\n")


def normalize(result):
    for image in result.get("data") or []:
        encoded = image.get("b64_json", "")
        if encoded.startswith("data:"):
            image["b64_json"] = encoded.split(",", 1)[1]
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--prompt-file", type=Path, required=True)
    parser.add_argument("--receipt", type=Path, required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--quality", choices=("low", "medium", "high"), default="low")
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--count", type=int, required=True)
    args = parser.parse_args()

    spec = importlib.util.spec_from_file_location("ccg_image", args.skill)
    skill = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(skill)
    key = skill.load_key(None)
    destination = ROOT / "assets/logo/generated"
    destination.mkdir(exist_ok=True)
    receipt = json.loads(args.receipt.read_text()) if args.receipt.exists() else {
        "model": args.model,
        "quality": args.quality,
        "size": "1024x1024",
        "prompt": str(args.prompt_file.relative_to(ROOT)),
        "jobs": [],
    }
    existing = {item["index"]: item for item in receipt["jobs"]}
    indexes = list(range(args.start, args.start + args.count))

    # Submit all missing jobs first, persisting each ID before another paid call.
    options = skill.parse_args([
        "--prompt", args.prompt_file.read_text(), "--quality", args.quality,
        "--model", args.model, "-n", "1",
    ])
    payload = skill.build_payload(options)
    for index in indexes:
        if index in existing:
            continue
        response = skill.request_json(f"{skill.BASE_URL}{skill.SUBMIT_PATH}", key, payload)
        job_id = response.get("jobId") or response.get("job_id")
        if not job_id:
            raise SystemExit(f"Index {index}: submission returned no job ID")
        item = {"index": index, "jobId": job_id, "status": "submitted"}
        receipt["jobs"].append(item)
        existing[index] = item
        save_receipt(args.receipt, receipt)
        print(f"submitted {index:02d}: {job_id}", flush=True)

    # Recover each known job. A rerun only polls unfinished IDs.
    for index in indexes:
        item = existing[index]
        if item.get("status") == "succeeded" and (destination / item["output"]).exists():
            print(destination / item["output"], flush=True)
            continue
        final = skill.poll(item["jobId"], key, 420, 5, False)
        images = skill.extract_images(normalize(final.get("result") or {}))
        if len(images) != 1:
            raise SystemExit(f"Index {index}: expected one image, found {len(images)}")
        raw, mime = images[0]
        output = f"{args.name}-{index:02d}{skill.sniff_ext(raw, mime)}"
        (destination / output).write_bytes(raw)
        item.update(status="succeeded", output=output)
        save_receipt(args.receipt, receipt)
        print(destination / output, flush=True)


if __name__ == "__main__":
    main()
