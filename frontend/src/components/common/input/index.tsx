import { ComponentProps, forwardRef, useId } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { tv } from "tailwind-variants"

type InputProps = ComponentProps<"input"> & {
  label?: string
  register?: UseFormRegisterReturn<string>
  error?: boolean
  fullWidth?: boolean
}

const input = tv({
  base: "w-full rounded-md border border-zinc-800 bg-transparent px-5 py-3 text-white outline-none transition-all focus:border-primary active:border-primary",
  variants: {
    error: {
      true: "ring-2 ring-red-500 focus:border-red-500 active:border-red-500",
    },
  },
})
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, register, error, fullWidth, ...props },
  ref,
) {
  const id = useId()
  return (
    <div className={`mb-4.5 ${fullWidth ? "w-full" : ""}`}>
      {props.label && (
        <label
          htmlFor={id}
          className="mb-3 block text-sm font-medium text-black dark:text-white"
        >
          {props.label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={input({ className, error })}
        type="text"
        {...props}
        {...register}
      />
    </div>
  )
})
