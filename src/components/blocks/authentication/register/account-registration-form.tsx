"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import type { FormData } from "./register-form"
import { useContext, useEffect, useState } from "react"
import { axiosPrivate } from "@/API/axios"
import { error } from "console"
import { toast } from "sonner"
import { BusinessGuideModal } from "./BusinessGuideModal"

type AccountRegistrationFormProps = {
    direction: "left" | "right"
    formData: FormData
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSelectChange: (name: string, value: string) => void
    onNext: () => void
    onBack: () => void
    step: number
    showPassword?: boolean
    onToggleShowPassword?: (checked: boolean) => void
}

export function AccountRegistrationForm({
    direction,
    formData,
    onInputChange,
    onSelectChange,
    onNext,
    onBack,
    step,
    showPassword = false,
    onToggleShowPassword,
}: AccountRegistrationFormProps) {
    if (step === 1) {
        return (
            <motion.div
                key="step1"
                initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={onInputChange}
                            placeholder="Nguyễn"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={onInputChange}
                            placeholder="Văn A"
                            required
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={onInputChange}
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Vai trò</Label>
                    <RadioGroup onValueChange={(value) => onSelectChange("role", value)} value={formData.role}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="marketing" />
                            <Label className="font-normal" htmlFor="marketing">Marketing Team</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="data" />
                            <Label className="font-normal" htmlFor="data">Data Team</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onBack} className="w-full">
                        Quay lại
                    </Button>
                    <Button type="button" onClick={onNext} className="w-full">
                        Tiếp tục
                    </Button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
        >
            <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={onInputChange}
                    required
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="showPassword"
                        checked={showPassword}
                        onCheckedChange={(checked) => onToggleShowPassword?.(checked as boolean)}
                    />
                    <label
                        htmlFor="showPassword"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Hiển thị mật khẩu
                    </label>
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onBack} className="w-full">
                    Back
                </Button>
                <Button type="submit" className="w-full">
                    Đăng ký
                </Button>
            </div>
        </motion.div>
    )
}
