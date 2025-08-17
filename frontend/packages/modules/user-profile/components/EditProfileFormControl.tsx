import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@app-launch-kit/components/primitives/form-control';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';

type Props = {
  isInvalid: boolean;
  label: string;
  errorMessage: string | undefined;
  children: React.ReactNode;
  required?: boolean;
};

const EditProfileFormControl = ({
  isInvalid,
  label,
  errorMessage,
  children,
  required = false,
}: Props) => {
  return (
    <FormControl className="flex-1" isRequired={required} isInvalid={isInvalid}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>

      {children}

      <FormControlError>
        <FormControlErrorIcon as={AlertTriangle} />
        <FormControlErrorText>{errorMessage}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export default EditProfileFormControl;
