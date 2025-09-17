import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { SliderField, TextInputField, ComboboxField, SwitchField } from './shared/components';

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput: TextInputField,
    Slider: SliderField,
    Combobox: ComboboxField,
    Switch: SwitchField,
  },
  formComponents: {
    // SubmitButton,
  },
  fieldContext,
  formContext,
});
