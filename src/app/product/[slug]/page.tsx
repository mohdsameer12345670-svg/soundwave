import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DataService } from '@/lib/data/store';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await DataService.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | SoundWave',
    };
  }

  return {
    title: `${product.name} | SoundWave Audio`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [{ url: product.main_image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await DataService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const allCategoryProducts = await DataService.getProducts({ category: product.category?.slug });
  const relatedProducts = allCategoryProducts.filter(p => p.id !== product.id);

  // Fetch verified reviews for this product
  const reviews = await DataService.getReviews(product.id);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
