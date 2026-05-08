import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Eye, EyeClosed, ArrowRight } from "@phosphor-icons/react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <Card className="w-full max-w-[420px] rounded-[24px] border-none shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-2 sm:p-6">
        <CardHeader className="text-center pb-8 pt-6">
          <CardTitle className="text-[28px] font-bold text-slate-800 tracking-tight">Login</CardTitle>
          <CardDescription className="text-sm text-slate-400 mt-2 font-medium">
            Access your financial dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel className="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1 mb-1">
                Email or Username
              </FieldLabel>
              <InputGroup className="h-[52px] rounded-2xl border-0 bg-[#f4f6fb] px-1">
                <InputGroupInput 
                  placeholder="architect@quickpay.com" 
                  className="px-4 text-[15px] font-medium text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1 mb-1 mt-2">
                Password
              </FieldLabel>
              <InputGroup className="h-[52px] rounded-2xl border-0 bg-[#f4f6fb] px-1">
                <InputGroupInput 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••" 
                  className="px-4 text-[15px] font-medium text-slate-700 tracking-[0.2em] placeholder:text-slate-300 placeholder:font-normal"
                />
                <InputGroupAddon align="inline-end" className="pr-3">
                  <InputGroupButton 
                    variant="ghost" 
                    size="icon-sm" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-300 hover:text-slate-500 hover:bg-transparent transition-colors"
                  >
                    {showPassword ? <EyeClosed weight="bold" className="size-5" /> : <Eye weight="bold" className="size-5" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Button className="w-full h-[52px] mt-6 rounded-2xl bg-[#0084ff] hover:bg-[#0073e6] text-white font-semibold text-[16px] shadow-[0_4px_14px_rgba(0,132,255,0.39)] transition-all active:scale-[0.98]">
              Login
              <ArrowRight weight="bold" className="ml-2 size-[18px]" />
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
