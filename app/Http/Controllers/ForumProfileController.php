<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ForumProfileController extends Controller
{
    private function imageUrl(?string $imgName): string
    {
        if (!$imgName) return '';

        if (str_starts_with($imgName, '/') || str_starts_with($imgName, 'http')) {
            return $imgName;
        }

        return asset('storage/posts/' . $imgName);
    }

    public function me(Request $request)
    {
        $user = Auth::user();
        return $this->render($request, $user);
    }

    public function show(Request $request, string $username)
    {
        $user = User::query()
            ->where('username', $username)
            ->firstOrFail();

        return $this->render($request, $user);
    }

    private function render(Request $request, User $profileUser)
    {
        $tab = $request->query('tab', 'posts');
        if (!in_array($tab, ['posts', 'likes', 'replies'], true)) {
            $tab = 'posts';
        }

        $authUser = Auth::user();
        $isMe = $authUser && ((int) $authUser->id === (int) $profileUser->id);

        $isFollowing = false;
        if ($authUser && !$isMe) {
            $isFollowing = $authUser->followings()
                ->where('following_id', $profileUser->id)
                ->exists();
        }

        $followersCount = $profileUser->followers()->count();
        $followingCount = $profileUser->followings()->count();

        // Helper: transform a Post model into the shape your frontend uses
        $postToPayload = function (Post $post, array $likedByMeLookup) {
            return [
                'id' => $post->id,
                'content' => $post->content,
                'allows_comment' => (bool) $post->allows_comment,
                'location' => $post->location,
                'created_at' => $post->created_at,

                'likes_count' => $post->likes_count ?? 0,
                'comments_count' => $post->comments_count ?? 0,
                'liked_by_me' => isset($likedByMeLookup[$post->id]),

                'user' => [
                    'id' => $post->user?->id,
                    'name' => $post->user?->full_name,
                    'username' => $post->user?->username,
                    'avatar' => $post->user?->public_profile_image,
                ],

                'tags' => ($post->tags ?? [])->map(fn ($t) => [
                    'id' => $t->id,
                    'tag_name' => $t->tag_name,
                ])->values(),

                'images' => ($post->images ?? [])->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => $this->imageUrl($img->img_name),
                    ];
                })->values(),
            ];
        };

        // -------------------------
        // TAB: replies
        // -------------------------
        if ($tab === 'replies') {
            $repliesQuery = PostComment::query()
                ->where('user_id', $profileUser->id)
                ->with([
                    'user:id,full_name,username,profile_image',

                    // direct post (comment on post)
                    'post' => function ($q) {
                        $q->with([
                            'user:id,full_name,username,profile_image',
                            'tags:id,tag_name',
                            'images:id,post_id,img_name',
                        ])->withCount(['comments', 'likes']);
                    },

                    // parent comment (reply to comment)
                    'parent:id,post_id,user_id,comment_text,created_at',
                    'parent.user:id,full_name,username,profile_image',

                    // parent post
                    'parent.post' => function ($q) {
                        $q->with([
                            'user:id,full_name,username,profile_image',
                            'tags:id,tag_name',
                            'images:id,post_id,img_name',
                        ])->withCount(['comments', 'likes']);
                    },
                ])
                ->latest();

            $replies = $repliesQuery->paginate(10)->withQueryString();

            // Collect post ids (direct post OR parent.post)
            $postIds = $replies->getCollection()->map(function ($c) {
                return $c->post?->id ?? $c->parent?->post?->id;
            })->filter()->values();

            $likedByMeLookup = [];
            if ($authUser && $postIds->count()) {
                $likedByMePostIds = DB::table('post_likes')
                    ->where('user_id', $authUser->id)
                    ->whereIn('post_id', $postIds)
                    ->pluck('post_id')
                    ->all();
                $likedByMeLookup = array_fill_keys($likedByMePostIds, true);
            }

            $repliesTransformed = $replies->through(function ($comment) use ($likedByMeLookup, $postToPayload) {
                $post = $comment->post ?: ($comment->parent?->post);
                $context = $comment->parent ? 'comment' : 'post';

                $parentPayload = null;
                if ($comment->parent) {
                    $parentPayload = [
                        'id' => $comment->parent->id,
                        'comment_text' => $comment->parent->comment_text,
                        'created_at' => $comment->parent->created_at,
                        'likes_count' => $comment->parent->likes_count ?? null, // optional if you have withCount elsewhere
                        'liked_by_me' => $comment->parent->liked_by_me ?? null, // optional
                        'user' => [
                            'id' => $comment->parent->user?->id,
                            'name' => $comment->parent->user?->full_name,
                            'username' => $comment->parent->user?->username,
                            'avatar' => $comment->parent->user?->public_profile_image,
                        ],
                    ];
                }

                return [
                    'id' => $comment->id,
                    'comment_text' => $comment->comment_text,
                    'created_at' => $comment->created_at,

                    'context' => $context, // ✅ 'post' or 'comment'

                    'user' => [
                        'id' => $comment->user?->id,
                        'name' => $comment->user?->full_name,
                        'username' => $comment->user?->username,
                        'avatar' => $comment->user?->public_profile_image,
                    ],

                    'parent_comment' => $parentPayload,

                    'post' => $post ? $postToPayload($post, $likedByMeLookup) : null,
                ];
            });

            $replies->setCollection($repliesTransformed->getCollection());

            return Inertia::render('Forum/Profile', [
                'profileUser' => [
                    'id' => $profileUser->id,
                    'full_name' => $profileUser->full_name,
                    'username' => $profileUser->username,
                    'bio' => $profileUser->bio,
                    'public_profile_image' => $profileUser->public_profile_image,
                ],
                'counts' => [
                    'followers' => $followersCount,
                    'following' => $followingCount,
                ],
                'isMe' => $isMe,
                'isFollowing' => $isFollowing,
                'tab' => $tab,

                'replies' => $replies,
                'posts' => null,
                'likes' => null,
            ]);
        }

        // -------------------------
        // TAB: likes (post likes + comment likes, sorted by liked_at)
        // -------------------------
        if ($tab === 'likes') {
            // Get unified list of liked targets, ordered by liked_at
            // We paginate manually by paginating this union.
            $postLikes = DB::table('post_likes')
                ->where('user_id', $profileUser->id)
                ->selectRaw("'post' as type, post_id as target_id, NULL as comment_id, created_at as liked_at");

            $commentLikes = DB::table('post_comment_likes')
                ->where('user_id', $profileUser->id)
                ->selectRaw("'comment' as type, NULL as target_id, post_comment_id as comment_id, created_at as liked_at");

            $union = $postLikes->unionAll($commentLikes);

            // Wrap union so we can order + paginate
            $likedPage = DB::query()
                ->fromSub($union, 'liked_items')
                ->orderByDesc('liked_at')
                ->paginate(10)
                ->withQueryString();

            $likedItems = collect($likedPage->items());

            $postIds = $likedItems
                ->where('type', 'post')
                ->pluck('target_id')
                ->filter()
                ->values()
                ->all();

            $commentIds = $likedItems
                ->where('type', 'comment')
                ->pluck('comment_id')
                ->filter()
                ->values()
                ->all();

            // Load posts for post likes
            $postsById = Post::query()
                ->whereIn('id', $postIds)
                ->with([
                    'user:id,full_name,username,profile_image',
                    'tags:id,tag_name',
                    'images:id,post_id,img_name',
                ])
                ->withCount(['comments', 'likes'])
                ->get()
                ->keyBy('id');

            // Load comments (and their post) for comment likes
            $commentsById = PostComment::query()
                ->whereIn('id', $commentIds)
                ->with([
                    'user:id,full_name,username,profile_image',
                    'post' => function ($q) {
                        $q->with([
                            'user:id,full_name,username,profile_image',
                            'tags:id,tag_name',
                            'images:id,post_id,img_name',
                        ])->withCount(['comments', 'likes']);
                    },
                ])
                ->get()
                ->keyBy('id');

            // liked_by_me for embedded posts (auth user)
            $allEmbeddedPostIds = collect($postsById->keys())
                ->merge($commentsById->map(fn ($c) => $c->post?->id)->filter())
                ->unique()
                ->values();

            $likedByMeLookup = [];
            if ($authUser && $allEmbeddedPostIds->count()) {
                $likedByMePostIds = DB::table('post_likes')
                    ->where('user_id', $authUser->id)
                    ->whereIn('post_id', $allEmbeddedPostIds)
                    ->pluck('post_id')
                    ->all();
                $likedByMeLookup = array_fill_keys($likedByMePostIds, true);
            }

            // For comment cards: liked_by_me on comment (auth user)
            $likedCommentByMeLookup = [];
            if ($authUser && count($commentIds)) {
                $likedCommentIds = DB::table('post_comment_likes')
                    ->where('user_id', $authUser->id)
                    ->whereIn('post_comment_id', $commentIds)
                    ->pluck('post_comment_id')
                    ->all();
                $likedCommentByMeLookup = array_fill_keys($likedCommentIds, true);
            }

            // comment likes count for displayed comments
            $commentLikesCounts = [];
            if (count($commentIds)) {
                $counts = DB::table('post_comment_likes')
                    ->select('post_comment_id', DB::raw('COUNT(*) as c'))
                    ->whereIn('post_comment_id', $commentIds)
                    ->groupBy('post_comment_id')
                    ->get();

                foreach ($counts as $row) {
                    $commentLikesCounts[$row->post_comment_id] = (int) $row->c;
                }
            }

            $likesTransformed = $likedItems->map(function ($li) use (
                $postsById,
                $commentsById,
                $postToPayload,
                $likedByMeLookup,
                $likedCommentByMeLookup,
                $commentLikesCounts
            ) {
                if ($li->type === 'post') {
                    $post = $postsById->get($li->target_id);
                    return [
                        'type' => 'post',
                        'liked_at' => $li->liked_at,
                        'post' => $post ? $postToPayload($post, $likedByMeLookup) : null,
                        'comment' => null,
                    ];
                }

                // comment like
                $comment = $commentsById->get($li->comment_id);
                $post = $comment?->post;

                return [
                    'type' => 'comment',
                    'liked_at' => $li->liked_at,
                    'post' => $post ? $postToPayload($post, $likedByMeLookup) : null,
                    'comment' => $comment ? [
                        'id' => $comment->id,
                        'comment_text' => $comment->comment_text,
                        'created_at' => $comment->created_at,
                        'likes_count' => $commentLikesCounts[$comment->id] ?? 0,
                        'liked_by_me' => isset($likedCommentByMeLookup[$comment->id]),
                        'user' => [
                            'id' => $comment->user?->id,
                            'name' => $comment->user?->full_name,
                            'username' => $comment->user?->username,
                            'avatar' => $comment->user?->public_profile_image,
                        ],
                    ] : null,
                ];
            });

            // Replace paginator items
            $likedPage->setCollection($likesTransformed);

            return Inertia::render('Forum/Profile', [
                'profileUser' => [
                    'id' => $profileUser->id,
                    'full_name' => $profileUser->full_name,
                    'username' => $profileUser->username,
                    'bio' => $profileUser->bio,
                    'public_profile_image' => $profileUser->public_profile_image,
                ],
                'counts' => [
                    'followers' => $followersCount,
                    'following' => $followingCount,
                ],
                'isMe' => $isMe,
                'isFollowing' => $isFollowing,
                'tab' => $tab,

                'likes' => $likedPage,
                'posts' => null,
                'replies' => null,
            ]);
        }

        // -------------------------
        // TAB: posts (unchanged)
        // -------------------------
        $postsQuery = Post::query()
            ->with([
                'user:id,full_name,username,profile_image',
                'tags:id,tag_name',
                'images:id,post_id,img_name',
            ])
            ->withCount(['comments', 'likes'])
            ->latest()
            ->where('user_id', $profileUser->id);

        $posts = $postsQuery->paginate(10)->withQueryString();

        $likedByMeLookup = [];
        if ($authUser) {
            $likedByMePostIds = DB::table('post_likes')
                ->where('user_id', $authUser->id)
                ->whereIn('post_id', $posts->pluck('id'))
                ->pluck('post_id')
                ->all();
            $likedByMeLookup = array_fill_keys($likedByMePostIds, true);
        }

        $postsTransformed = $posts->through(function ($post) use ($likedByMeLookup, $postToPayload) {
            return $postToPayload($post, $likedByMeLookup);
        });

        $posts->setCollection($postsTransformed->getCollection());

        return Inertia::render('Forum/Profile', [
            'profileUser' => [
                'id' => $profileUser->id,
                'full_name' => $profileUser->full_name,
                'username' => $profileUser->username,
                'bio' => $profileUser->bio,
                'public_profile_image' => $profileUser->public_profile_image,
            ],
            'counts' => [
                'followers' => $followersCount,
                'following' => $followingCount,
            ],
            'isMe' => $isMe,
            'isFollowing' => $isFollowing,
            'tab' => $tab,

            'posts' => $posts,
            'likes' => null,
            'replies' => null,
        ]);
    }
}