import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Get started
        </p>
        <h1 className="mt-1 font-bold font-mono text-2xl tracking-tight">
          Create your account.
        </h1>
      </div>
      <RegisterForm />
    </>
  );
}
