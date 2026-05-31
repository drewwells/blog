import rss from '@astrojs/rss';
import { sortedPosts } from '../posts.ts';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts.ts';

export function GET(context) {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.title,
      description: post.dek,
      pubDate: new Date(post.date + 'T00:00:00Z'),
      link: `/posts/${post.slug}/`,
      categories: post.tags ?? [],
    })),
  });
}
