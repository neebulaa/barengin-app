<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use App\Models\PostImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content_html' => ['required', 'string', 'max:20000'],
            'allows_comment' => ['required', 'boolean'],
            'location' => ['nullable', 'string', 'max:255'],

            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['file', 'image', 'max:5120'],

            // ✅ chip model tags (supports spaces)
            'tag_names' => ['nullable', 'array', 'max:10'],
            'tag_names.*' => ['string', 'max:50'],
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($validated, $request, $userId) {
            $contentHtml = $validated['content_html'];

            $post = Post::create([
                'user_id' => $userId,
                'content' => $contentHtml, // store HTML so bold/italic persists
                'allows_comment' => (bool) $validated['allows_comment'],
                'location' => $validated['location'] ?? null,
                'like' => 0,
            ]);

            // ---- images
            $files = $request->file('images', []);
            foreach ($files as $file) {
                $path = $file->store('posts', 'public'); // posts/xxxxx.jpg

                PostImage::create([
                    'post_id' => $post->id,
                    'img_name' => basename($path),
                ]);
            }

            // ---- tags from chips (preferred)
            $tagNames = $this->normalizeChipTags($validated['tag_names'] ?? []);

            if (!empty($tagNames)) {
                $tagIds = [];

                foreach ($tagNames as $name) {
                    $tag = Tag::firstOrCreate([
                        'tag_key' => mb_strtolower($name),
                        'tag_name' => $name,
                    ]);
                    $tagIds[] = $tag->id;
                }

                $post->tags()->sync($tagIds);
            }
        });

        return redirect()->back();
    }

    private function normalizeChipTags(array $tags): array
    {
        $out = [];

        foreach ($tags as $t) {
            $name = (string) $t;

            // remove leading '#'
            $name = ltrim($name, "#");

            // normalize whitespace
            $name = preg_replace('/\s+/u', ' ', $name) ?? $name;

            $name = trim($name);

            if ($name === '') continue;

            // Optional: enforce a max length after normalization
            if (mb_strlen($name) > 50) {
                $name = mb_substr($name, 0, 50);
            }

            $out[] = $name;
        }

        // de-duplicate case-insensitively
        $unique = [];
        $seen = [];

        foreach ($out as $name) {
            $key = mb_strtolower($name);
            if (isset($seen[$key])) continue;
            $seen[$key] = true;
            $unique[] = $name;
        }

        return $unique;
    }

    private function htmlToText(string $html): string
    {
        // Convert HTML to plain text safely for hashtag extraction
        $text = strip_tags($html);

        // decode HTML entities (&nbsp; etc)
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // normalize whitespace
        $text = preg_replace('/\s+/', ' ', $text) ?? $text;

        return trim($text);
    }

    private function extractHashtags(string $text): array
    {
        // Supports: #tag, #tag_name, #tag-name, #tag123
        // Stops at whitespace/punctuation not allowed.
        preg_match_all('/(^|\\s)#([\\p{L}\\p{N}_-]{1,30})/u', $text, $m);

        $raw = $m[2] ?? [];
        $raw = array_map(fn ($t) => mb_strtolower(trim($t)), $raw);

        // Remove empties + duplicates
        $raw = array_values(array_unique(array_filter($raw)));

        return $raw;
    }
}