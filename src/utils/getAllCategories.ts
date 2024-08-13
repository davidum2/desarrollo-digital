import { getCollection } from "astro:content";

interface BlogPost {
    data: {
      categories: string[];
      pubDate: Date;
      title: string;
     
      image:{
        url: string,
        alt: string
      },
    };
  }


export async function getAllCategories() {
    const posts = await getCollection("blog")
    return Array.from(
        new Set(
            posts.map(post => post.data.categories)
            .flat()
            .sort()
        )
    )

}



export async function getAllCategoriesFilter(){
  const posts = await getCollection("blog");
  const categoryCounts: Record<string, number> = posts.reduce((acc, post) => {
    post.data.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);


  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)  
    .map(([category]) => category);  

  return sortedCategories;
}

export async function getLastPost(){
    const posts = await getCollection("blog");
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
    });
    return sortedPosts.slice(0, 3);
  }