import { RegisterForm } from "@/components/blocks/authentication/register-form"

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-login">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* <a href="" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a> */}
        <RegisterForm />
      </div>
    </div>
  )
}

