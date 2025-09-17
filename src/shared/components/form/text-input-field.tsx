import React, { ReactNode } from 'react';
import { Input, InputProps, Label, LabelProps } from '../shadcn';

type TextInputFieldProps = {
  label?: ReactNode;
  labelProps?: Omit<LabelProps, 'children'>;
} & InputProps;

export const TextInputField = ({ label, labelProps, ...rest }: TextInputFieldProps) => {
  return (
    <div className="space-y-2">
      {label && <Label {...labelProps}>{label}</Label>}
      <Input {...rest} />
    </div>
  );
};
