<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PostTagSeeder extends Seeder
{
    public function run(): void
    {
        $tagIds = Tag::query()->pluck('id')->all();

        if (count($tagIds) === 0) {
            $this->command?->warn('PostTagSeeder: No tags found. Run TagSeeder first.');
            return;
        }

        Post::query()
            ->select('id')
            ->chunk(200, function ($posts) use ($tagIds) {
                foreach ($posts as $post) {
                    $count = rand(2, 5);
                    $picked = Arr::random($tagIds, $count);

                    // attach without duplicates (safe to run multiple times)
                    $post->tags()->syncWithoutDetaching($picked);
                }
            });

        $this->command?->info('PostTagSeeder: Attached tags to posts.');
    }
}