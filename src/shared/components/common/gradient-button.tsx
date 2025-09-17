import { Button } from '@/shared/components';
import { ButtonProps } from '@/shared/components/shadcn/button';
import { cn } from '@/shared/utils';

interface GradientButtonProps extends ButtonProps {
  decorative?: boolean;
  decorativeColor?: 'purple' | 'gray' | 'red';
}

export function GradientButton({ 
  children, 
  className, 
  decorative = false, 
  decorativeColor = 'purple',
  ...props 
}: GradientButtonProps) {
  const decorativeColors = {
    purple: 'bg-purple-500/10 dark:bg-purple-500/20',
    gray: 'bg-gray-500/10 dark:bg-gray-500/20',
    red: 'bg-red-500/10 dark:bg-red-500/20',
  };

  return (
    <Button
      className={cn(
        "relative",
        className
      )}
      {...props}
    >
      {children}
      {decorative && (
        <div 
          className={cn(
            "absolute bottom-0 right-0 w-8 h-8 rounded-full -mr-4 -mb-4 pointer-events-none",
            decorativeColors[decorativeColor]
          )} 
          aria-hidden="true" 
        />
      )}
    </Button>
  );
}