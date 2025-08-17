import './button.css';
import {
  Button as ButtonGS,
  ButtonText,
} from '@app-launch-kit/components/primitives/button';

import { View, Text } from 'react-native';

export const Button = () => {
  return (
    <>
      <View className="bg-red-400">
        <Text>Hello</Text>
      </View>
      <ButtonGS className="bg-red-500">
        <ButtonText>dhhdjd</ButtonText>
      </ButtonGS>
    </>
  );
};
