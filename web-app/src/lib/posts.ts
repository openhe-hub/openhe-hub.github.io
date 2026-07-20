import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Known top-level content directories under assets/.
// Anything else still works — it just won't have a nav entry.
export const CATEGORIES: Record<string, { label: string; tone: 'red' | 'green' | 'blue' }> = {
  cv: { label: 'CV', tone: 'red' },
  robotics: { label: 'Robotics', tone: 'green' },
  blogs: { label: 'Blog', tone: 'blue' },
};

export function categoryOf(post: Post): string {
  return post.id.split('/')[0];
}

export function subtopicOf(post: Post): string | undefined {
  const parts = post.id.split('/');
  return parts.length >= 3 ? parts[1] : undefined;
}

export function categoryLabel(id: string): string {
  return CATEGORIES[id]?.label ?? id;
}

export function categoryTone(id: string): string {
  return CATEGORIES[id]?.tone ?? 'blue';
}

export async function getPosts(category?: string): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const filtered = category ? posts.filter((p) => categoryOf(p) === category) : posts;
  return filtered.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function prevNext(post: Post, posts: Post[]): { prev?: Post; next?: Post } {
  const i = posts.findIndex((p) => p.id === post.id);
  return {
    prev: posts[i + 1], // older
    next: posts[i - 1], // newer
  };
}

export async function allTags(): Promise<Map<string, Post[]>> {
  const posts = await getPosts();
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(post);
    }
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

// Public URL for a file that sits next to a post's markdown source.
// Binary assets (videos, PDFs) are served verbatim under /assets/
// via the public/assets symlink.
export function assetUrlOf(post: Post, relPath: string): string {
  const filePath = post.filePath ?? '';
  const marker = '/assets/';
  const idx = filePath.lastIndexOf(marker);
  const dir = idx >= 0 ? filePath.slice(idx + marker.length, filePath.lastIndexOf('/')) : '';
  const clean = relPath.replace(/^\.\//, '');
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/assets/${dir}/${clean}`;
}

export function postUrl(post: Post): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/posts/${post.id}/`;
}
