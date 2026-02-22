import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Welcome back
        </p>
        <h1 className="mt-1 font-bold font-mono text-2xl tracking-tight">
          Sign in to your account.
        </h1>
      </div>
      <LoginForm />
    </>
  );
}
