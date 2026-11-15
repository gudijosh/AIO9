#!/usr/bin/env node
// Prepares the reel videos: compresses each one for the web and extracts a
// poster frame, then prints the entries for src/data/videos.ts.
//
//   node scripts/prepare-videos.mjs <input folder>
//
// Name the source files <id>-es.<ext> and <id>-en.<ext> (for example
// presentacion-es.mp4 and presentacion-en.mov). A subtitle file next to a
// video with the same name and .srt or .vtt is converted and attached.
// Output goes to public/videos/<lang>/<id>.mp4, .webp and .vtt.
// Needs ffmpeg and ffprobe on the PATH.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

const input = process.argv[2];
if (!input || !existsSync(input)) {
  console.error("Usage: node scripts/prepare-videos.mjs <input folder>");
  process.exit(1);
}

const VIDEO = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi"]);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
const entries = { es: [], en: [] };

for (const file of readdirSync(input).sort()) {
  const ext = extname(file).toLowerCase();
  if (!VIDEO.has(ext)) continue;
  const match = basename(file, extname(file)).match(/^(.+)-(es|en)$/i);
  if (!match) {
    console.warn(`skip ${file}: name it <id>-es${ext} or <id>-en${ext}`);
    continue;
  }
  const id = match[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const lang = match[2].toLowerCase();
  const source = join(input, file);
  const out = join("public", "videos", lang);
  mkdirSync(out, { recursive: true });

  const duration = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", source]));
  const hasAudio = run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", source]).trim() !== "";

  // 720 px wide (vertical reels end up 720×1280), H.264 so every browser plays it,
  // moov atom first so it starts before it has fully downloaded.
  run("ffmpeg", [
    "-y", "-i", source,
    "-vf", "scale='min(720,iw)':-2",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high", "-pix_fmt", "yuv420p",
    ...(hasAudio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]),
    "-movflags", "+faststart",
    join(out, `${id}.mp4`),
  ]);
  // Poster: a frame a second in (or the middle of very short clips).
  run("ffmpeg", [
    "-y", "-ss", String(Math.min(1, duration / 2)), "-i", source,
    "-frames:v", "1", "-vf", "scale='min(720,iw)':-2", "-quality", "82",
    join(out, `${id}.webp`),
  ]);

  let captions;
  for (const sub of [".vtt", ".srt"]) {
    const subtitle = join(input, basename(file, extname(file)) + sub);
    if (existsSync(subtitle)) {
      run("ffmpeg", ["-y", "-i", subtitle, join(out, `${id}.vtt`)]);
      captions = `/videos/${lang}/${id}.vtt`;
      break;
    }
  }

  const size = statSync(join(out, `${id}.mp4`)).size / 1e6;
  console.log(`${lang}/${id}.mp4  ${duration.toFixed(1)} s  ${size.toFixed(1)} MB${hasAudio ? "" : "  (no audio)"}${captions ? "  + captions" : ""}`);
  entries[lang].push({ id, src: `/videos/${lang}/${id}.mp4`, poster: `/videos/${lang}/${id}.webp`, title: id, ...(captions && { captions }) });
}

console.log("\nPaste into src/data/videos.ts and write a real title for each:\n");
console.log(JSON.stringify(entries, null, 2));
