"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[]; // expect at least 3 images
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
}

interface ProductCardCarouselProps {
  product: Product;
}

export const ProductCardCarousel = ({ product }: ProductCardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = product.images.length;
  const safeImages = useMemo(() => {
    if (total >= 3) return product.images;
    // ensure at least 3 images repeating if necessary
    const arr: string[] = [];
    while (arr.length < 3) {
      arr.push(
        product.images[arr.length % Math.max(1, total)] ?? product.images[0]
      );
    }
    return arr;
  }, [product.images, total]);

  const startAutoplay = (immediate?: boolean) => {
    if (intervalRef.current) return;
    if (immediate) {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    }, 1200);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAutoplay();
  }, []);

  const goPrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length
    );
  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/produto/${product.id}`} className="block">
      <div
        className="group craft-card rounded-xl overflow-hidden hover-lift"
        onMouseEnter={() => startAutoplay(true)}
        onMouseLeave={stopAutoplay}
      >
        {/* Image carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {safeImages.map((src, idx) => (
            <Image
              key={idx}
              src={src}
              alt={`${product.name} - imagem ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`absolute inset-0 object-cover transition-opacity duration-300 ${
                idx === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {product.isNew && (
              <Badge className="bg-craft-coral text-white">Novo</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Arrows */}
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={(e) => {
              e.preventDefault();
              goPrev();
            }}
            onMouseEnter={stopAutoplay}
            onMouseLeave={() => startAutoplay()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={(e) => {
              e.preventDefault();
              goNext();
            }}
            onMouseEnter={stopAutoplay}
            onMouseLeave={() => startAutoplay()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-craft-coral" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-primary text-lg group-hover:text-primary-glow transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating)
                        ? "fill-craft-coral text-craft-coral"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            <div className="space-x-2">
              <span className="text-xl font-bold text-craft-coral">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
