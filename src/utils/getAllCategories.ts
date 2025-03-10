import { getCollection } from 'astro:content';

// Tipado para la entrada de blog (ajustado a lo que usamos en el proyecto)
interface BlogPost {
  id: string;
  data: {
    categories: string[];
    pubDate: Date;
    title: string;
    image: {
      url: string;
      alt: string;
    };
  };
}

// Obtiene todas las categorías únicas de la colección "blog"
export async function getAllCategories(): Promise<string[]> {
  const posts = await getCollection('blog');
  const categories = posts
    .flatMap((post: BlogPost) => post.data.categories)
    .sort();
  return Array.from(new Set(categories));
}

// Obtiene las 5 categorías más frecuentes de la colección "blog"
export async function getAllCategoriesFilter(): Promise<string[]> {
  const posts = await getCollection('blog');
  const categoryCounts: Record<string, number> = posts.reduce(
    (acc: Record<string, number>, post: BlogPost) => {
      post.data.categories.forEach((category: string) => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    },
    {}
  );

  return Object.entries(categoryCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([category]) => category);
}

// Obtiene los 3 posts más recientes de la colección "blog"
export async function getLastPost(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts
    .sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    )
    .slice(0, 3);
}
