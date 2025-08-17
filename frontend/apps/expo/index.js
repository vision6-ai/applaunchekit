import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { ExpoRoot } from 'expo-router';

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}
let AppEntryPoint;

if (Constants.expoConfig?.extra?.storybookEnabled !== 'true') {
  require('expo-router/entry');
  AppEntryPoint = App;
}

if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = require('./.ondevice').default;
  registerRootComponent(AppEntryPoint);
}

export default AppEntryPoint;
