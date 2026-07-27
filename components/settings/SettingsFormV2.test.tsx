import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsFormV2 } from "@/components/settings/SettingsFormV2";
import { saveSettingsV2 } from "@/lib/api/settings-v2";

vi.mock("@/lib/api/settings-v2", () => ({
  saveSettingsV2: vi.fn(),
  SettingsSaveError: class SettingsSaveError extends Error {
    constructor(message = "Failed to save settings. Please try again.") {
      super(message);
      this.name = "SettingsSaveError";
    }
  },
}));

const getForm = () => screen.getByTestId("settings-form-v2");

describe("SettingsFormV2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows an error when submitted with an empty display name", async () => {
    render(<SettingsFormV2 />);

    fireEvent.submit(getForm());

    expect(await screen.findByText("Display name is required")).toBeInTheDocument();
  });

  it("shows an error when submitted with an invalid email", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsFormV2 />);

    await user.type(screen.getByLabelText("Display name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    fireEvent.submit(getForm());

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("shows a success message when submitted with valid data", async () => {
    vi.mocked(saveSettingsV2).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsFormV2 />);

    await user.type(screen.getByLabelText("Display name"), "Jane Doe");
    await user.tab();
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.tab();

    const saveButton = screen.getByRole("button", { name: "Save changes" });

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await user.click(saveButton);

    await vi.advanceTimersByTimeAsync(1000);

    expect(await screen.findByRole("status")).toHaveTextContent("Settings saved successfully.");
    expect(saveSettingsV2).toHaveBeenCalledWith({
      displayName: "Jane Doe",
      email: "jane@example.com",
      bio: "",
      theme: "system",
      notifications: true,
    });
  });

  it("updates the bio character count live as the user types", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsFormV2 />);

    expect(screen.getByText("Optional. 0/200 characters.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Bio"), "Hello");

    expect(screen.getByText("Optional. 5/200 characters.")).toBeInTheDocument();
  });
});
