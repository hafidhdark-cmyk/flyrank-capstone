import { z } from "zod";

const displayNamePattern = /^[a-zA-Z0-9 ]+$/;

export const settingsSchemaV2 = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or fewer")
    .regex(displayNamePattern, "Display name cannot contain special characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .refine((value) => value === value.toLowerCase(), {
      message: "Email must be lowercase",
    }),
  bio: z
    .string()
    .max(200, "Bio must be 200 characters or fewer"),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Select a theme",
  }),
  notifications: z.boolean(),
});

export type SettingsFormDataV2 = z.infer<typeof settingsSchemaV2>;

export const defaultSettingsValuesV2: SettingsFormDataV2 = {
  displayName: "",
  email: "",
  bio: "",
  theme: "system",
  notifications: true,
};

export const BIO_MAX_LENGTH = 200;
