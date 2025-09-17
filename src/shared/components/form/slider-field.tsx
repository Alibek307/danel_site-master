import { ReactNode } from 'react';
import { Label, LabelProps, Slider, SliderProps } from '../shadcn';

type SliderFieldProps = {
  label?: ReactNode;
  labelProps?: Omit<LabelProps, 'children'>;

  onChange?: SliderProps['onValueChange'];
} & Omit<SliderProps, 'onChange' | 'onValueChange'>;

export const SliderField = ({ label, labelProps, onChange, ...rest }: SliderFieldProps) => {
  return (
    <div className="space-y-2">
      {label && <Label {...labelProps}>{label}</Label>}
      <Slider {...rest} onValueChange={onChange} />
    </div>
  );
};
