import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@app-launch-kit/components/primitives/alert-dialog';
import {
  Button,
  ButtonText,
} from '@app-launch-kit/components/primitives/button';
import { Heading } from '@app-launch-kit/components/primitives/heading';
import { Text } from '@app-launch-kit/components/primitives/text';
import React from 'react';

const EditProfileAlert = ({
  showAlertDialog,
  setShowAlertDialog,
}: {
  showAlertDialog: boolean;
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog
      isOpen={showAlertDialog}
      onClose={() => {
        setShowAlertDialog(false);
      }}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="lg">Please complete Your Profile</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm">
            It looks like you have started updating your profile but haven't
            completed it yet. Please take a moment to finish updating your
            profile information.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            onPress={() => {
              setShowAlertDialog(false);
            }}
          >
            <ButtonText>OK</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfileAlert;
