<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Mews\Purifier\Facades\Purifier;

class SanitizeForumPosts extends Command
{
    protected $signature = 'forum:sanitize-posts {--dry-run : Tampilkan perubahan tanpa menyimpan}';

    protected $description = 'Sanitasi ulang seluruh konten postingan forum yang tersimpan (menetralkan Stored XSS pada baris lama)';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $changed = 0;

        // chunkById agar hemat memori pada tabel besar.
        Post::query()->orderBy('id')->chunkById(200, function ($posts) use (&$changed, $dry) {
            foreach ($posts as $post) {
                $clean = Purifier::clean((string) $post->content, 'forum_post');

                if ($clean !== (string) $post->content) {
                    $changed++;
                    $this->line("Post #{$post->id}: konten dibersihkan.");

                    if (! $dry) {
                        // Hindari update timestamp agar urutan feed tidak berubah.
                        $post->timestamps = false;
                        $post->content = $clean;
                        $post->save();
                    }
                }
            }
        });

        if ($dry) {
            $this->info("[dry-run] {$changed} postingan akan dibersihkan (tidak ada yang disimpan).");
        } else {
            $this->info("Selesai. {$changed} postingan dibersihkan.");
        }

        return self::SUCCESS;
    }
}
