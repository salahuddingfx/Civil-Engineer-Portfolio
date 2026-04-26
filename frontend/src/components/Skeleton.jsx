import React from "react";

/**
 * Base Skeleton primitive with shimmer and pulse animation.
 */
export const Skeleton = ({ className = "", style = {} }) => (
  <div 
    className={`relative overflow-hidden bg-[var(--bg-accent)] rounded-lg ${className}`} 
    style={style}
  >
    <div className="absolute inset-0 shimmer" />
    <div className="absolute inset-0 skeleton-pulse" />
  </div>
);

/**
 * Skeleton for Project Cards
 */
export const ProjectSkeleton = () => (
  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--highlight-border)] p-8 flex flex-col justify-end bg-[var(--bg-card)]">
    <div className="translate-y-0 space-y-4">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex items-center justify-between pt-4 border-t border-[var(--highlight-border)]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Service Cards
 */
export const ServiceSkeleton = () => (
  <div className="p-8 pb-12 rounded-[24px] border border-[var(--highlight-border)] bg-[var(--bg-card)] relative overflow-hidden">
    <Skeleton className="w-12 h-12 rounded-full mb-10 mt-4" />
    <Skeleton className="h-7 w-3/4 mb-4" />
    <div className="space-y-3 mb-8">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <Skeleton className="h-4 w-28" />
  </div>
);

/**
 * Skeleton for Testimonial Cards
 */
export const TestimonialSkeleton = () => (
  <div className="p-8 md:p-16 lg:p-24 flex flex-col md:flex-row gap-12 items-center bg-[var(--bg-card)] rounded-3xl border border-[var(--highlight-border)]">
    <div className="flex-1 space-y-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-5 h-5 rounded-sm" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/6" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Gallery Items
 */
export const GallerySkeleton = () => (
  <div className="aspect-square rounded-2xl overflow-hidden border border-[var(--highlight-border)]">
    <Skeleton className="w-full h-full" />
  </div>
);

export default Skeleton;
