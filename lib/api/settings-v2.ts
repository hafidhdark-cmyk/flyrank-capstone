import type { SettingsFormDataV2 } from "@/lib/validations/settings-schema-v2";

export class SettingsSaveError extends Error {
  constructor(message = "Failed to save settings. Please try again.") {
    super(message);
    this.name = "SettingsSaveError";
  }
}

type SaveSettingsOptions = {
  shouldFail?: boolean;
};

export const saveSettingsV2 = async (
  _data: SettingsFormDataV2,
  options?: SaveSettingsOptions,
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (options?.shouldFail) {
    throw new SettingsSaveError();
  }
};
