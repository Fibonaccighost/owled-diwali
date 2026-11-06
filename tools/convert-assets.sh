#!/bin/bash
# Turns the originals in assets/Assets/ into the web files in assets/work/.
#   videos → <id>.webm (VP9/Opus), <id>.mp4 (H.264/AAC, for phones that don't play WebM) and <id>.webp (poster)
#   images → <id>.webp
# Run from the project folder: tools/convert-assets.sh
# Files that already exist are skipped, so adding a new line below converts only the new piece.
# Needs ffmpeg and cwebp. HEIC images need macOS (sips).
set -u
SRC="assets/Assets"; OUT="assets/work"; TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
FIT='scale=w=min(LONG\,iw):h=min(LONG\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2'

video() { # id, source path, optional kbps cap for pieces that would pass Cloudflare Pages' 25 MB per-file limit, optional poster time in seconds
  local id="$1" in="$SRC/$2" cap="${3:-}" at="${4:-2}" vf="${FIT//LONG/1280}" pf="${FIT//LONG/720}"
  [ -s "$OUT/$id.webm" ] || ffmpeg -nostdin -v error -y -i "$in" -map_metadata -1 -vf "$vf" -pix_fmt yuv420p \
    -c:v libvpx-vp9 -crf 34 -b:v "${cap:-0}k" -row-mt 1 -cpu-used 3 -deadline good -g 120 -c:a libopus -b:a 96k "$OUT/$id.tmp.webm" && [ ! -e "$OUT/$id.tmp.webm" ] || mv "$OUT/$id.tmp.webm" "$OUT/$id.webm"
  [ -s "$OUT/$id.mp4" ] || ffmpeg -nostdin -v error -y -i "$in" -map_metadata -1 -vf "$vf" -pix_fmt yuv420p \
    -c:v libx264 -crf 25 -preset slow -maxrate "${cap:-2500}k" -bufsize 5000k -c:a aac -b:a 96k -movflags +faststart "$OUT/$id.tmp.mp4" && [ ! -e "$OUT/$id.tmp.mp4" ] || mv "$OUT/$id.tmp.mp4" "$OUT/$id.mp4"
  if [ ! -s "$OUT/$id.webp" ]; then
    ffmpeg -nostdin -v error -y -ss "$at" -i "$in" -vf "thumbnail=150,$pf" -frames:v 1 -update 1 "$TMP/$id.png" && cwebp -quiet -q 78 "$TMP/$id.png" -o "$OUT/$id.webp"
  fi
  echo "done $id"
}
film() { # id, slug on the Owled US site's film bucket. The bucket has no mp4 or masters, so the mp4 is made from its webm
  local id="$1" base="https://assets.owledmedia.com/films/$2"
  [ -s "$OUT/$id.webm" ] || curl -fsSL "$base.webm" -o "$OUT/$id.webm"
  [ -s "$OUT/$id.webp" ] || curl -fsSL "$base.webp" -o "$OUT/$id.webp"
  [ -s "$OUT/$id.mp4" ] || ffmpeg -nostdin -v error -y -i "$OUT/$id.webm" -map_metadata -1 -pix_fmt yuv420p \
    -c:v libx264 -crf 25 -preset slow -maxrate 2500k -bufsize 5000k -c:a aac -b:a 96k -movflags +faststart "$OUT/$id.tmp.mp4" && [ ! -e "$OUT/$id.tmp.mp4" ] || mv "$OUT/$id.tmp.mp4" "$OUT/$id.mp4"
  echo "done $id"
}
image() { # id, source path
  local id="$1" in="$SRC/$2"
  [ -s "$OUT/$id.webp" ] && { echo "done $id"; return; }
  case "$in" in
    *.HEIC|*.heic) sips -s format png "$in" --resampleHeightWidthMax 1280 --out "$TMP/$id.png" >/dev/null; in="$TMP/$id.png" ;;
  esac
  cwebp -quiet -q 82 "$in" -o "$OUT/$id.webp"; echo "done $id"
}

image fs-socks      "FS/Socks carving.png"
image fs-razorpay   "FS/Razorpay.png"
image fs-upasana    "FS/Upasana Kamineni.png"
image fs-ultraviolette "FS/Ultraviolette.png"
image fs-lit        "FS/LIT School.png"
image fs-foundery   "FS/Foundery.png"
image fs-tata       "FS/TATA Sons.png"
image fs-priyagold  "FS/Screenshot 2026-11-05 215325.png"
image or-wispr      "Origin/Wispr.HEIC"

video hc-allen      "HOOC/Allen NEET Warriors.mp4"
video hc-hero       "HOOC/Hero cycles.mp4"
video hc-canva      "HOOC/Canva.mp4"
video hc-district   "HOOC/District.mp4"
video hc-zilo       "HOOC/Zilo.mp4"
video hc-kivi       "HOOC/Kivi by Sarvam.mp4"
video fl-juspay     "Owled films/Juspay.mp4" "" 40
video fl-wazirx     "Owled films/WazirX.mp4"
video fl-openui     "Owled films/OpenUI.mp4"
video fl-confido    "Owled films/Confido.mp4"
video fl-pixxel     "Owled films/Pixxel.mp4" 1050
video or-senco      "Origin/Everlite by Senco.mp4"
video or-supermoney "Origin/Supermoney.mp4"
video or-hero       "Origin/Hero cycle.mp4" 1400
video or-zomato     "Origin/Zomato.mp4"
film sb-emergent-100m-arr emergent-100m-arr
film sb-emergent-series-c emergent-series-c
film sb-wispr-flow wispr-flow
echo ALL DONE
