import rss from '@astrojs/rss';

import { getCollection } from 'astro:content';
export async function GET(context) {
const posts = await getCollection("blog");
  return rss({
    // `<title>` campo en el xml generado
    title: 'Desarrollo Digital',
    // `<description>` campo en el xml generado
    description: 'Impulsando tu sueños a traves de migración digital',
    // Usa el "site" desde el contexto del endpoint
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array de `<item>`s en el xml generado
    // Consulta la sección "Generando `items`" para ejemplos utilizando colecciones de contenido y glob imports
    items: posts.map(post => ({
        ...post.data,
        link:`/blog/${post.slug}`
    })),
    
   
  });
}