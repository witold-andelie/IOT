"""Generate the video narration with Kokoro TTS (voice af_heart).

Reads the narration of every scene from video/script.md and writes
video/public/narration/scene-XX.wav plus durations.json (used by Remotion).

Setup (once):
    python3 -m venv video/tts/.venv
    video/tts/.venv/bin/pip install -r video/tts/requirements.txt
    mkdir -p video/tts/models && cd video/tts/models
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Run:
    video/tts/.venv/bin/python video/tts/generate.py
"""
import json
import re
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro
from kokoro_onnx.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT.parent / "script.md"
OUT = ROOT.parent / "public" / "narration"
MODELS = ROOT / "models"

VOICE = "af_heart"
LANG = "en-us"
SPEED = 1.0

# Words the phonemizer reads wrongly -> spelling that sounds right
RESPELL = [
    ("CO₂", "C O two"),
    ("ESP32-C3", "E S P thirty-two C three"),
    ("ESP32", "E S P thirty-two"),
    ("SCD41", "S C D forty-one"),
    ("PostgreSQL", "Postgres Q L"),
    ("3D-printed", "three D printed"),
    ("LED", "L E D"),
]

# Chinese names: explicit phonemes (approximate pinyin pronunciation)
NAMES = {
    "Zongyuan Chi": "zˈʊŋ jwˈɛn tʃˈɜː",
    "Lijie Luo": "lˈiː dʒjˈɛ lwˈɔː",
    "Jingyi Liu": "dʒˈɪŋ ˈiː ljˈoʊ",
    "Wentao Ma": "wˈɛn tˈaʊ mˈɑː",
}


def scenes(markdown: str):
    """Yield (number, title, narration) for every '## N. Title' section."""
    for m in re.finditer(r"^## (\d+)\. ([^\n(]+?)\s*(?:\([^\n]*\))?\n(.*?)(?=^## |\Z)", markdown, re.S | re.M):
        num, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
        narration = re.search(r"\*\*Narration:\*\*\n(.*)", body, re.S)
        if narration:
            yield num, title, " ".join(narration.group(1).split())


def to_phonemes(text: str, tokenizer: Tokenizer) -> str:
    """Phonemize text, but use the fixed phonemes for the names."""
    pattern = "(" + "|".join(re.escape(n) for n in NAMES) + ")"
    parts = []
    for piece in re.split(pattern, text):
        if piece in NAMES:
            parts.append(NAMES[piece])
        elif piece.strip():
            parts.append(tokenizer.phonemize(piece, LANG))
    return " ".join(parts)


def main():
    kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    tokenizer = Tokenizer()
    OUT.mkdir(parents=True, exist_ok=True)

    durations = []
    for num, title, text in scenes(SCRIPT.read_text(encoding="utf-8")):
        for word, spoken in RESPELL:
            text = text.replace(word, spoken)
        if any(name in text for name in NAMES):
            audio, sr = kokoro.create(to_phonemes(text, tokenizer), voice=VOICE, speed=SPEED,
                                      lang=LANG, is_phonemes=True)
        else:
            audio, sr = kokoro.create(text, voice=VOICE, speed=SPEED, lang=LANG)
        name = f"scene-{num:02d}.wav"
        sf.write(OUT / name, audio, sr)
        seconds = round(len(audio) / sr, 2)
        durations.append({"scene": num, "title": title, "file": f"narration/{name}", "seconds": seconds})
        print(f"{name}  {seconds:6.2f} s  {title}")

    (OUT / "durations.json").write_text(json.dumps(durations, indent=2) + "\n", encoding="utf-8")
    print(f"total {sum(d['seconds'] for d in durations):.1f} s")


if __name__ == "__main__":
    main()
