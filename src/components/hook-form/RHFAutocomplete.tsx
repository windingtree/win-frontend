import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import { findObjectWithPropertyAndValue } from '../../utils/objects';
import { useCallback } from 'react';

type ObjectWithLabel = { label: string; [key: string]: unknown };

type StringOrObject = string | ObjectWithLabel | unknown;

type IProps<T extends StringOrObject> = {
  name: string;
  options: T[];
  freeSolo?: boolean;
  width?: string | number;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  optionValueField?: string;
  optionLabelField?: string;
};

type Props<T extends StringOrObject> = IProps<T> & TextFieldProps;

export const RHFAutocomplete = <T extends StringOrObject>({
  name,
  options,
  freeSolo = true,
  width = '100%',
  optionValueField = '',
  optionLabelField = 'label',
  // if freeSolo is true, then arbitrary text is allowed,
  // and all values are considered valid. In this case, we should always return true
  isOptionEqualToValue = (option, value) => freeSolo || option === value,
  getOptionLabel,
  ...other
}: Props<T>) => {
  const { control, setValue } = useFormContext();
  const isOptionEqualToValueFn = optionValueField
    ? (option, value) => freeSolo || option[optionValueField] === value
    : isOptionEqualToValue;

  const getOptionLabelFn =
    getOptionLabel ??
    useCallback(
      (option) => {
        // if option is an object with a field for label return the label value
        if (option[optionLabelField]) return option[optionLabelField];

        let foundOption;
        // if 'option' is a string and 'options' is an array of objects
        // we need to look up the corresponding object with this 'option' value
        if (typeof option === 'string') {
          foundOption = findObjectWithPropertyAndValue(
            options as Record<string, unknown>[],
            optionValueField,
            option
          );
        }

        // return the found option object's label or the literal string if no object found
        const label = foundOption ? foundOption[optionLabelField] : option;
        return label;
      },
      [options, optionValueField, optionLabelField]
    );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const changeHandler = (event, newValue) => {
          const finalValue = newValue
            ? optionValueField
              ? newValue[optionValueField]
              : newValue
            : '';
          setValue(field.name, finalValue);
        };
        return (
          <Autocomplete
            sx={{ width }}
            {...field}
            freeSolo={freeSolo}
            isOptionEqualToValue={isOptionEqualToValueFn}
            onChange={changeHandler}
            onInputChange={changeHandler}
            options={options}
            getOptionLabel={getOptionLabelFn}
            renderInput={({ InputProps, inputProps, ...restParams }) => (
              <TextField
                label={other.label}
                error={!!error}
                helperText={error?.message}
                placeholder={other.placeholder}
                variant={other.variant}
                inputProps={{ ...inputProps, ...other.inputProps }}
                InputProps={{ ...InputProps, ...other.InputProps }}
                {...restParams}
              />
            )}
          />
        );
      }}
    />
  );
};
