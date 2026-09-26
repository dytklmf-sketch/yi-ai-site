"""Explicit paid design operation using the installed, reviewed CCG image skill.

Not used by builds or tests. Credentials are read from CCG_API_KEY only.
Use --job to resume a submitted task without paying for another generation.
"""

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--job")
    parser.add_argument("--prompt-file", type=Path, default=ROOT / "assets/logo/yi-mark-prompt.txt")
    parser.add_argument("--receipt", type=Path, default=ROOT / "assets/logo/generated/yi-generation.json")
    parser.add_argument("--name", default="easyai-yi-original")
    parser.add_argument("--quality", choices=("low", "medium", "high"), default="low")
    parser.add_argument("--image", type=Path)
    parser.add_argument("--model", default="gpt-image-2")
    parser.add_argument("-n", type=int, default=1)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("ccg_image", args.skill)
    skill = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(skill)
    key = skill.load_key(None)
    prompt = args.prompt_file
    destination = ROOT / "assets/logo/generated"
    destination.mkdir(exist_ok=True)
    receipt = args.receipt
    if args.job:
        job_id = args.job
    else:
        if receipt.exists():
            raise SystemExit("A receipt exists. Inspect it and resume using --job; do not resubmit.")
        option_args = [
            "--prompt", prompt.read_text(), "--quality", args.quality,
            "--model", args.model, "-n", str(args.n),
        ]
        if args.image:
            option_args.extend(["--image", str(args.image)])
        options = skill.parse_args(option_args)
        submitted = skill.request_json(
            f"{skill.BASE_URL}{skill.SUBMIT_PATH}", key, skill.build_payload(options)
        )
        job_id = submitted.get("jobId") or submitted.get("job_id")
        if not job_id:
            raise SystemExit("Submission returned no job ID; inspect server state before retrying.")
        receipt.write_text(json.dumps({
            "jobId": job_id, "model": args.model, "quality": args.quality,
            "size": "1024x1024", "count": args.n, "prompt": str(prompt.relative_to(ROOT)),
            "sourceImage": str(args.image.relative_to(ROOT)) if args.image else None,
            "status": "submitted",
        }, indent=2) + "\n")
    print(f"jobId: {job_id}", flush=True)
    final = skill.poll(job_id, key, 420, 5, False)
    result = final.get("result") or {}
    # The service can wrap b64_json in a data URI; normalize before skill decoding.
    for image in result.get("data") or []:
        encoded = image.get("b64_json", "")
        if encoded.startswith("data:"):
            image["b64_json"] = encoded.split(",", 1)[1]
    images = skill.extract_images(result)
    if len(images) != args.n:
        raise SystemExit(f"Expected {args.n} results, found {len(images)}. Resume this job; do not submit another.")
    outputs = []
    for index, (raw, mime) in enumerate(images, start=1):
        suffix = "" if args.n == 1 else f"-{index:02d}"
        output = destination / (args.name + suffix + skill.sniff_ext(raw, mime))
        output.write_bytes(raw)
        outputs.append(output.name)
    metadata = json.loads(receipt.read_text()) if receipt.exists() else {"jobId": job_id}
    metadata.update(status="succeeded", outputs=outputs)
    receipt.write_text(json.dumps(metadata, indent=2) + "\n")
    for output in outputs:
        print(str(destination / output), flush=True)


if __name__ == "__main__":
    main()
