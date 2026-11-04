import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch } from "@/lib/api";
import { setMustChange } from "@/lib/mustChange";

type Values = { current_password: string; new_password: string; confirm_password: string };

const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const fieldStyle = {
  border: HAIRLINE,
  borderRadius: brand.radius,
  height: 46,
  backgroundColor: "rgba(0,0,0,0.25)",
  color: brand.primaryColor,
};
const labelStyle = { color: brand.neutralColor, letterSpacing: "0.18em" };

export default function Screen() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [error, setError] = React.useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { current_password: "", new_password: "", confirm_password: "" } });

  const onSubmit = async (v: Values) => {
    setError("");
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: v.current_password,
          new_password: v.new_password,
        }),
      });
      setMustChange(false);
      client.removeQueries({ queryKey: ["me"] });
      navigate("home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The password was not changed. Try again.");
    }
  };

  const fields: Array<[keyof Values, string, object]> = [
    ["current_password", "Current password", { required: "Current password is required." }],
    [
      "new_password",
      "New password",
      { required: "New password is required." },
    ],
    [
      "confirm_password",
      "Confirm new password",
      {
        required: "Confirm the new password.",
        validate: (val: string) => val === getValues("new_password") || "Passwords do not match.",
      },
    ],
  ];

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-10"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <main
        className="w-full max-w-md p-6 sm:p-10"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: HAIRLINE, borderRadius: brand.radius }}
      >
        <h1 className="text-2xl" style={{ fontFamily: brand.fontHeading }}>
          Set a new password
        </h1>
        <p className="mt-3 text-sm" style={{ color: brand.neutralColor }}>
          Your password was reset by an administrator. Choose a new one to continue.
        </p>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {fields.map(([name, text, rules]) => (
            <div key={name} className="space-y-2">
              <label htmlFor={"cp-" + name} className="block text-xs uppercase" style={labelStyle}>
                {text}
              </label>
              <input
                id={"cp-" + name}
                type="password"
                autoComplete={name === "current_password" ? "current-password" : "new-password"}
                aria-invalid={errors[name] ? "true" : undefined}
                className="w-full px-3 text-sm"
                style={fieldStyle}
                {...register(name, rules)}
              />
              {errors[name] ? (
                <p role="alert" className="text-sm">
                  {errors[name]?.message}
                </p>
              ) : null}
            </div>
          ))}
          {error ? (
            <p role="alert" className="text-sm">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ backgroundColor: brand.accentColor, color: brand.backgroundColor, borderRadius: brand.radius }}
          >
            Change password
          </button>
        </form>
      </main>
    </div>
  );
}
