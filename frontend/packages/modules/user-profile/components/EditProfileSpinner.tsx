import colors from 'tailwindcss/colors';
import { Box } from '@app-launch-kit/components/primitives/box';
import { Spinner } from '@app-launch-kit/components/primitives/spinner';

export default function EditProfileSpinner() {
  return (
    <Box className="h-[656px] md:h-80 justify-center align-center">
      <Spinner size="large" color={colors.gray[700]} />
    </Box>
  );
}
