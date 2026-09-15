/** After API success: full biometric prompts vs finalize immediately (e.g. biometric sign-in). */
export type LoginPostLoginFlow = "full" | "finalize_only";

export type LoginSubmitOptions = Readonly<{
  postLoginFlow?: LoginPostLoginFlow;
}>;

export type LoginCredentialsPayload = Readonly<{
  email: string;
  password: string;
}>;

export type HandleLoginFn = (
  data: LoginCredentialsPayload,
  setIsLoading: (loading: boolean) => void,
  clearInputs: () => void,
  options?: LoginSubmitOptions,
) => Promise<void>;
