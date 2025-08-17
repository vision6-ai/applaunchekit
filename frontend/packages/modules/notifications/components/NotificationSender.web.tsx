import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { Text } from '@app-launch-kit/components/primitives/text';

export default function NotificationSender() {
  return (
    <VStack className="self-center justify-center items-center h-screen w-screen bg-background-0">
      <Text>Notifications are not supported on web yet...</Text>
    </VStack>
  );
}
