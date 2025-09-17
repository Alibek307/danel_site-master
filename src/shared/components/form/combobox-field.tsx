import { ReactNode } from 'react';
import { Label, LabelProps, Combobox, ComboboxProps } from '../shadcn';

type ComboboxFieldProps = {
  label?: ReactNode;
  labelProps?: Omit<LabelProps, 'children'>;
  
  onChange?: ComboboxProps['onValueChange'];
} & Omit<ComboboxProps, 'onChange' | 'onValueChange'>;

export const ComboboxField = ({ label, labelProps, onChange, ...rest }: ComboboxFieldProps) => {
  return (
    <div className="space-y-2">
      {label && <Label {...labelProps}>{label}</Label>}
      <Combobox {...rest} onValueChange={onChange} />
    </div>
  );
};