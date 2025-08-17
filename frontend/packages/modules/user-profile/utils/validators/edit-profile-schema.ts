import { city } from '@app-launch-kit/utils/validators/city';
import { country } from '@app-launch-kit/utils/validators/country';
import { firstName } from '@app-launch-kit/utils/validators/firstName';
import { gender } from '@app-launch-kit/utils/validators/gender';
import { lastName } from '@app-launch-kit/utils/validators/lastName';
import { phoneNumber } from '@app-launch-kit/utils/validators/phoneNumber';
import { state } from '@app-launch-kit/utils/validators/state';
import { zipCode } from '@app-launch-kit/utils/validators/zipCode';
import { z } from 'zod';
export const accountDetailsSchema = z.object({
  firstName,
  lastName,
  gender,
  city,
  state,
  country,
  phoneNumber,
  zipCode,
});

export type AccountDetailsSchemaType = z.infer<typeof accountDetailsSchema>;
