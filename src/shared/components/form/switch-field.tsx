import { ReactNode } from 'react';
import { Label, LabelProps, Switch } from '../shadcn';
import * as SwitchPrimitive from '@radix-ui/react-switch';

type SwitchFieldProps = {
  label?: ReactNode;
  labelProps?: Omit<LabelProps, 'children'>;
  
  onChange?: (checked: boolean) => void;
} & Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, 'onChange' | 'onCheckedChange'>;

export const SwitchField = ({ label, labelProps, onChange, ...rest }: SwitchFieldProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch {...rest} onCheckedChange={onChange} />
      {label && <Label {...labelProps}>{label}</Label>}
    </div>
  );
};