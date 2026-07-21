"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultSettingsValues,
  settingsSchema,
  type SettingsFormData,
} from "@/lib/validations/settings-schema";
import { Button, FormField, Input, Select, Textarea } from "@/components/ui/FormControls";

export const SettingsForm = () => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettingsValues,
    mode: "onBlur",
  });

  const onSubmit = async (data: SettingsFormData) => {
    setSavedMessage(null);

    // Simulated save — replace with a lib/api call when a backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 600));

    reset(data);
    setSavedMessage("Settings saved successfully.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-auto w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Update your profile and preferences. All required fields are validated on blur.
        </p>
      </header>

      <FormField label="Display name" htmlFor="displayName" error={errors.displayName?.message}>
        <Input
          id="displayName"
          placeholder="Jane Doe"
          aria-invalid={Boolean(errors.displayName)}
          error={errors.displayName?.message}
          {...register("displayName")}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          error={errors.email?.message}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Bio"
        htmlFor="bio"
        error={errors.bio?.message}
        hint="Optional. Up to 200 characters."
      >
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself..."
          aria-invalid={Boolean(errors.bio)}
          error={errors.bio?.message}
          {...register("bio")}
        />
      </FormField>

      <FormField label="Theme" htmlFor="theme" error={errors.theme?.message}>
        <Select
          id="theme"
          aria-invalid={Boolean(errors.theme)}
          error={errors.theme?.message}
          {...register("theme")}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </Select>
      </FormField>

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <input
          id="notifications"
          type="checkbox"
          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          {...register("notifications")}
        />
        <label htmlFor="notifications" className="text-sm text-gray-700">
          Email me about product updates
        </label>
      </div>

      {savedMessage ? (
        <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {savedMessage}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          disabled={!isDirty || isSubmitting}
          onClick={() => {
            reset(defaultSettingsValues);
            setSavedMessage(null);
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};
