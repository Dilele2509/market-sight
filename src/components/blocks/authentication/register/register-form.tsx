"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatePresence } from "framer-motion"
import { RegistrationTypeSelection } from "./registration-type-selection"
import { AccountRegistrationForm } from "./account-registration-form"
import { BusinessRegistrationForm } from "./business-registration-form"
import { toast } from "sonner"
import { axiosAuth, axiosPrivate } from "@/API/axios"

export type FormData = {
  registerType: "business" | "account" | ""
  firstName: string
  lastName: string
  email: string
  role: string
  business_id: number
  password: string
  confirmPassword: string

  // Business registration fields
  businessName: string
  businessEmail: string
  businessPhone: string
  industry: string
  otpCode: string
}

export type RegistrationStatus = "pending" | "success" | "error"

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState(0)
  const [registrationType, setRegistrationType] = useState<"business" | "account" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>("pending")
  const [formData, setFormData] = useState<FormData>({
    registerType: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    business_id: null,
    password: "",
    confirmPassword: "",
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    industry: "",
    otpCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const handleOTPChange = useCallback((value: string) => {
    setFormData((prev) => {
      // Only update if the value is different to prevent unnecessary re-renders
      if (prev.otpCode !== value) {
        return { ...prev, otpCode: value }
      }
      return prev
    })
  }, [])

  const handleNext = () => {
    setDirection("left")
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setDirection("right")

    // If we're on step 1 and going back to step 0, reset the form
    if (step === 1) {
      // Reset registration type and clear form data
      setRegistrationType(null)

      // Reset only the relevant form data based on registration type
      if (registrationType === "business") {
        setFormData((prev) => ({
          ...prev,
          businessName: "",
          businessEmail: "",
          businessPhone: "",
          industry: "",
          otpCode: "",
        }))
      } else if (registrationType === "account") {
        setFormData((prev) => ({
          ...prev,
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          business: "",
        }))
      }

      // Reset registration status
      setRegistrationStatus("pending")
    }

    setStep((prev) => prev - 1)
  }

  const handleRegistrationTypeSelect = (type: "business" | "account") => {
    setDirection("left")
    setRegistrationType(type)
    setStep(1)
    setFormData((prev) => ({ ...prev, registerType: type }))
  }

  const toggleShowPassword = (checked: boolean) => {
    setShowPassword(checked)
  }

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    if (formData.otpCode.length === 6) {
      setRegistrationStatus("success")
    } else {
      setRegistrationStatus("error")
    }
  }

  const handleTryAgain = () => {
    // Reset OTP and status but stay on step 2
    setFormData((prev) => ({ ...prev, otpCode: "" }))
    setRegistrationStatus("pending")
  }

  const resetForm = () => {
    setStep(0)
    setRegistrationType(null)
    setRegistrationStatus("pending")
    setFormData({
      registerType: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      business_id: null,
      password: "",
      confirmPassword: "",
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      industry: "",
      otpCode: "",
    })
  }

  const getStepDescription = () => {
    if (step === 0) return "Select your registration type"

    if (registrationType === "account") {
      return step === 1 ? "Enter your personal information" : "Create a secure password"
    }

    if (registrationType === "business") {
      if (step === 1) return "Enter your business information"
      if (step === 2 && registrationStatus === "pending") return "Verify your business email"
      return registrationStatus === "success" ? "Registration successful" : "Registration failed"
    }

    return ""
  }

  // useEffect(()=>{
  //   console.log(formData);
  // },[formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(formData);
      axiosAuth.post('/register', formData)
        .then(res => {
          if(res.status === 200){
            toast.success("Register success!")
            
          }
        })
    } catch (error) {
      toast.error("Registration failed")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Register</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <RegistrationTypeSelection direction={direction} onSelect={handleRegistrationTypeSelect} />
                )}

                {registrationType === "account" && step === 1 && (
                  <AccountRegistrationForm
                    direction={direction}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onBack={handleBack}
                    step={1}
                  />
                )}

                {registrationType === "account" && step === 2 && (
                  <AccountRegistrationForm
                    direction={direction}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onBack={handleBack}
                    showPassword={showPassword}
                    onToggleShowPassword={toggleShowPassword}
                    step={2}
                  />
                )}

                {registrationType === "business" && (
                  <BusinessRegistrationForm
                    direction={direction}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onBack={handleBack}
                    step={step}
                    registrationStatus={registrationStatus}
                    onVerifyOTP={handleVerifyOTP}
                    onReset={resetForm}
                    onTryAgain={handleTryAgain}
                    onOTPChange={handleOTPChange}
                  />
                )}
              </AnimatePresence>
            </div>

            {step === 0 && (
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
