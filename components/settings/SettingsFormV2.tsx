"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSettingsV2 } from "@/lib/api/settings-v2";
import {
  BIO_MAX_LENGTH,
  defaultSettingsValuesV2,
  settingsSchemaV2,
  type SettingsFormDataV2,
} from "@/lib/validations/settings-schema-v2";
import { Button, FormField, Input, Select, Textarea, Toast } from "@/components/ui/FormControls";

type ToastState = {
  message: string;
  variant: "success" | "error";
};

export const SettingsFormV2 = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<SettingsFormDataV2>({
    resolver: zodResolver(settingsSchemaV2),
    defaultValues: defaultSettingsValuesV2,
    mode: "onBlur",
  });

  const bioValue = watch("bio") ?? "";

  const onSubmit = async (data: SettingsFormDataV2) => {
    setToast(null);

    try {
      await saveSettingsV2(data);
      reset(data);
      setToast({ message: "Settings saved successfully.", variant: "success" });
    } catch {
      setToast({
        message: "Failed to save settings. Please try again.",
        variant: "error",
      });
    }
  };

  const handleReset = () => {
    reset(defaultSettingsValuesV2);
    setToast(null);
  };

  return (
    <>
      {toast ? (
        <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="settings-form-v2"
        className="mx-auto w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Update your profile and preferences. Fields are validated when you leave them.
          </p>
        </header>

        <FormField
          label="Display name"
          htmlFor="displayName"
          error={errors.displayName?.message}
        >
          <Input
            id="displayName"
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? "displayName-error" : undefined}
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
            aria-describedby={errors.email ? "email-error" : undefined}
            error={errors.email?.message}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Bio"
          htmlFor="bio"
          error={errors.bio?.message}
          hint={`Optional. ${bioValue.length}/${BIO_MAX_LENGTH} characters.`}
        >
          <Textarea
            id="bio"
            placeholder="Tell us a little about yourself..."
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            error={errors.bio?.message}
            {...register("bio")}
          />
        </FormField>

        <FormField label="Theme" htmlFor="theme" error={errors.theme?.message}>
          <Select
            id="theme"
            aria-invalid={Boolean(errors.theme)}
            aria-describedby={errors.theme ? "theme-error" : undefined}
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

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </>
  );
};
