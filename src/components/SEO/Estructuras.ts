// jsonldUtils.ts

// Tipo para datos de la organización
interface OrganizationSchema {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    logo: string;
    contactPoint: {
      "@type": string;
      telephone: string;
      contactType: string;
    };
  }
  
  // Tipo para preguntas y respuestas de FAQ
  interface FAQ {
    question: string;
    answer: string;
  }
  
  interface FAQSchema {
    "@context": string;
    "@type": string;
    mainEntity: Array<{
        "@type": string;
        name: string;
        acceptedAnswer: {
            "@type": string;
            text: string;
        };
    }>;
}
  
  // Tipo para los datos de un producto
  interface ProductSchema {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    image: string;
    offers: {
      "@type": string;
      priceCurrency: string;
      price: string;
      itemCondition: string;
      availability: string;
    };
  }
  
  // Tipo para datos de un artículo
  interface ArticleSchema {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string;
    author: {
      "@type": string;
      name: string;
    };
    datePublished: string;
  }
  
  // Tipo para datos de un evento
  interface EventSchema {
    "@context": string;
    "@type": string;
    name: string;
    startDate: string;
    endDate: string;
    location: {
      "@type": string;
      name: string;
      address: string;
    };
    description: string;
  }
  
  // Función para generar datos estructurados de tipo "Organization"
  export function generateOrganizationSchema(
    name: string,
    url: string,
    logo: string,
    telephone: string,
    contactType: string
  ): OrganizationSchema {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url,
      logo,
      contactPoint: {
        "@type": "ContactPoint",
        telephone,
        contactType
      }
    };
  }
  
  // Función para generar datos estructurados de tipo "FAQPage"
  export function generateFAQSchema(faqs: Array<{ question: string, answer: string }>): FAQSchema {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
            }
        }))
    };
}
  
  // Función para generar datos estructurados de tipo "Product"
  export function generateProductSchema(
    name: string,
    description: string,
    image: string,
    offers: {
      currency: string;
      price: string;
    }
  ): ProductSchema {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image,
      offers: {
        "@type": "Offer",
        priceCurrency: offers.currency,
        price: offers.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock"
      }
    };
  }
  
  // Función para generar datos estructurados de tipo "Article"
  export function generateArticleSchema(
    title: string,
    description: string,
    author: string,
    datePublished: string,
    image: string
  ): ArticleSchema {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image,
      author: {
        "@type": "Person",
        name: author
      },
      datePublished
    };
  }
  
  // Función para generar datos estructurados de tipo "Event"
  export function generateEventSchema(
    name: string,
    startDate: string,
    endDate: string,
    location: {
      name: string;
      address: string;
    },
    description: string
  ): EventSchema {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name,
      startDate,
      endDate,
      location: {
        "@type": "Place",
        name: location.name,
        address: location.address
      },
      description
    };
  }
  