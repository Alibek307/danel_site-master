import { useState } from 'react';
import { useClipboard } from '@mantine/hooks';
import { Button, ButtonProps } from '@/shared/components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip';
import { Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { m } from 'src/paraglide/messages';
import { cn } from '@/shared/utils';

type CopyButtonProps = {
  text: string;
  variant?: 'default' | 'icon';
  size?: 'sm' | 'default' | 'lg';
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
} & Omit<ButtonProps, 'variant' | 'size'>;

export function CopyButton({
  text,
  variant = 'default',
  size = 'default',
  buttonVariant = 'outline',
  disabled = false,
  className,
  ...rest
}: CopyButtonProps) {
  const clipboard = useClipboard({ timeout: 2000 });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = async () => {
    if (!text || disabled) return;

    clipboard.copy(text);
    setIsSuccess(true);

    toast.success(m.copied(), {
      duration: 2000,
      icon: <CheckCircle2 className="w-4 h-4" />,
    });

    // Reset success state after animation
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const buttonContent = (
    <Button
      {...rest}
      size={size}
      variant={buttonVariant}
      onClick={handleCopy}
      disabled={disabled || !text}
      className={cn(
        'transition-all duration-200',
        isSuccess && 'bg-green-500 hover:bg-green-600 text-white border-green-500',
        variant === 'icon' && 'p-2',
        className,
      )}>
      {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {variant === 'default' && <span className="ml-2">{isSuccess ? m.copied() : m.copy()}</span>}
    </Button>
  );

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>{m.copy()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
