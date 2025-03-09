export interface BlogPost {
  id: string;
  image: { url: string; alt: string };
  title: string;
  author: string;
  description: string;
  pubDate: Date;
  keywords: string[];
  categories: string[];
  relatedPosts: string[]; // IDs de otros posts en 'blog'
}

export interface BlogPostRich {
  id: string;
  image: { url: string; alt: string };
  title: string;
  author: string;
  description: string;
  pubDate: Date;
  keywords: string[];
  categories: string[];
  relatedPosts: string[]; // IDs de otros posts en 'blogPostRich'
  faqs: { question: string; answer: string }[];
}
