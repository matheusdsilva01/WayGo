import React, { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const button = tv({
  base: "items-center justify-center bg-primary text-center font-medium text-white hover:bg-opacity-90",
  variants: {
    fullWidth: {
      true: "w-full",
    },
    rounded: {
      sm: "rounded-sm",
      none: "rounded-none",
      md: "rounded-md",
      full: "rounded-full",
    },
    size: {
      sm: "text-sm px-6 py-2 lg:px-4 xl:px-6",
      md: "text-base px-10 py-4 lg:px-8 xl:px-10",
      lg: "text-lg px-12 py-5 lg:px-10 xl:px-12",
    },
    variant: {
      outlined: "border !bg-transparent",
      contained: "bg-primary !text-white border-transparent",
    },
    color: {
      black:
        "bg-black text-black border-black dark:border-white dark:text-white",
      red: "bg-red text-red border-red dark:border-white dark:text-white",
      primary: "bg-primary !text-black border-primary",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    rounded: "md",
    variant: "contained",
    size: "md",
    color: "primary",
  },
})

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof button>

export const Button = ({
  className,
  fullWidth,
  variant,
  rounded,
  color,
  size,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={button({
        rounded,
        variant,
        className,
        color,
        size,
        fullWidth,
        disabled: props.disabled,
      })}
      {...props}
    />
  )
}
