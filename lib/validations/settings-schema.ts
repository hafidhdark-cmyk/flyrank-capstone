import { z } from "zod";

export const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or fewer"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be 200 characters or fewer"),
  notifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Select a theme",
  }),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const defaultSettingsValues: SettingsFormData = {
  displayName: "",
  email: "",
  bio: "",
  notifications: true,
  theme: "system",
};
