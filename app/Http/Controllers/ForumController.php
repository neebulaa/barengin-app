<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    private function imageUrl(?string $imgName): string
    {
        if (!$imgName) return '';

        // already a full/absolute path like "/assets/default-image.png"
        if (str_starts_with($imgName, '/') || str_starts_with($imgName, 'http')) {
            return $imgName;
        }

        // otherwise treat as a stored file name
        return asset('storage/posts/' . $imgName);
    }

    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $tag = trim((string) $request->query('tag', ''));

        $postsQuery = Post::query()
            ->with([
                'user:id,full_name,profile_image',
                'images:id,post_id,img_name',
                'tags:id,tag_name',
            ])
            // count ALL post_comments rows (top-level + replies) for each post
            ->withCount([
                'comments as comments_count',
            ])
            ->latest();

        if ($q !== '') {
            $postsQuery->where('content', 'like', "%{$q}%");
        }

        if ($tag !== '') {
            $postsQuery->whereHas('tags', function ($tq) use ($tag) {
                $tq->where('tag_name', $tag);
            });
        }

        $posts = $postsQuery->paginate(10)->withQueryString();

        $tags = Tag::query()
            ->select('id', 'tag_name')
            ->orderBy('tag_name')
            ->get();

        return inertia('Forum/Index', [
            'filters' => [
                'q' => $q,
                'tag' => $tag,
            ],

            'posts' => $posts->through(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'allows_comment' => (bool) $post->allows_comment,
                    'location' => $post->location,

                    // synced counts
                    'likes' => (int) ($post->like ?? 0),
                    'comments_count' => (int) ($post->comments_count ?? 0),

                    'created_at' => $post->created_at,

                    'user' => [
                        'id' => $post->user?->id,
                        'name' => $post->user?->full_name,
                        'avatar' => $post->user?->public_profile_image,
                    ],

                    'tags' => $post->tags->map(fn ($t) => [
                        'id' => $t->id,
                        'tag_name' => $t->tag_name,
                    ])->values(),

                    'images' => $post->images->map(fn ($img) => [
                        'id' => $img->id,
                        'img_name' => $img->img_name,
                        'url' => $this->imageUrl($img->img_name),
                    ])->values(),
                ];
            }),

            'tags' => $tags,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $sort = $request->query('sort', 'popular'); // popular | newest

        $post = Post::query()
            ->with([
                'user:id,full_name,profile_image',
                'images:id,post_id,img_name',
                'tags:id,tag_name',
            ])
            ->findOrFail($id);

        $commentsQuery = $post->comments()
            ->whereNull('parent_id')
            ->with([
                'user:id,full_name,profile_image',
                'replies.user:id,full_name,profile_image',
            ]);

        if ($sort === 'newest') {
            $commentsQuery->latest();
        } else {
            $commentsQuery->orderByDesc('like')->latest();
        }

        $comments = $commentsQuery->get();

        $responseCount = $comments->count()
            + $comments->sum(fn ($c) => $c->replies->count());

        return inertia('Forum/PostShow', [
            'sort' => $sort,
            'responseCount' => $responseCount,

            'post' => [
                'id' => $post->id,
                'content' => $post->content,
                'allows_comment' => (bool) $post->allows_comment,
                'location' => $post->location,

                // synced counts
                'likes' => (int) ($post->like ?? 0),
                'comments_count' => (int) $responseCount,

                'created_at' => $post->created_at,

                'user' => [
                    'id' => $post->user?->id,
                    'name' => $post->user?->full_name,
                    'avatar' => $post->user?->public_profile_image,
                ],

                'tags' => $post->tags->map(fn ($t) => [
                    'id' => $t->id,
                    'tag_name' => $t->tag_name,
                ])->values(),

                'images' => $post->images->map(fn ($img) => [
                    'id' => $img->id,
                    'img_name' => $img->img_name,
                    'url' => $this->imageUrl($img->img_name),
                ])->values(),
            ],

            'comments' => $comments->map(fn ($c) => [
                'id' => $c->id,
                'comment_text' => $c->comment_text,
                'likes' => (int) ($c->like ?? 0),
                'created_at' => $c->created_at,

                'user' => [
                    'id' => $c->user?->id,
                    'name' => $c->user?->full_name,
                    'avatar' => $c->user?->public_profile_image,
                ],

                'replies' => $c->replies->map(fn ($r) => [
                    'id' => $r->id,
                    'comment_text' => $r->comment_text,
                    'likes' => (int) ($r->like ?? 0),
                    'created_at' => $r->created_at,
                    'user' => [
                        'id' => $r->user?->id,
                        'name' => $r->user?->full_name,
                        'avatar' => $r->user?->public_profile_image,
                    ],
                ])->values(),
            ])->values(),
        ]);
    }
}