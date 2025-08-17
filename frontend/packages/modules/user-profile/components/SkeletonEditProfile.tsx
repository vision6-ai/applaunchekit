import { Skeleton } from '@app-launch-kit/components/primitives/skeleton';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import React from 'react';

export default function SkeletonEditProfile({
  isLoaded,
  className,
  ...props
}: {
  isLoaded: boolean;
  className?: string;
}) {
  return (
    <>
      <VStack className="md:flex-row" space="lg">
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
      </VStack>
      <VStack className="md:flex-row" space="lg">
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
      </VStack>
      <VStack className="md:flex-row" space="lg">
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
      </VStack>
      <VStack className="md:flex-row" space="lg">
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
        <Skeleton
          isLoaded={isLoaded}
          className={`h-[68px] md:flex-1 ${className}`}
          {...props}
        />
      </VStack>
    </>
  );
}
