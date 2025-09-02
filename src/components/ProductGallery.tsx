import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export const ProductGallery = ({
  images,
  autoSlide = true,
  autoSlideInterval = 4000,
}: ProductGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoSlide || isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, isHovered, images.length]);

  const goToPrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div
        className="relative group overflow-hidden rounded-lg bg-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/3] relative">
          {images.map((image, index) => (
            <Image
              key={image.id}
              src={image.url}
              alt={image.alt}
              className={`absolute inset-0 w-full h-full object-cover gallery-transition ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              width={64}
              height={64}
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              }`}
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImage
                    ? "bg-primary scale-125"
                    : "bg-background/60 hover:bg-background/80"
                }`}
                onClick={() => goToImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex space-x-3 justify-center">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`relative overflow-hidden rounded-md transition-all duration-300 hover-lift ${
                index === currentImage
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => goToImage(index)}
            >
              <Image
                src={image.url}
                alt={`${image.alt} thumbnail`}
                className="w-16 h-16 object-cover"
                width={64}
                height={64}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
