import * as React from "react"
import { cn } from 'src/lib/utils'

const Alert = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full rounded-md border px-4 py-3 text-sm [&_svg]:absolute [&_svg]:left-4 [&_svg]:top-4 [&_svg:not([stroke~=destructive])]:text-foreground",
        variant === "destructive" &&
        "border-destructive/50 bg-destructive text-destructive",
        variant === "success" &&
        "border-success/50 bg-success text-success",
        variant === "warning" &&
        "border-warning/50 bg-warning text-warning",
        variant === "info" &&
        "border-info/50 bg-info text-info",
        className
      )}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
  React.ElementRef<"p">,
  React.ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm [&+div]:mt-2", className)}
    {...props}
  >
    {children}
  </p>
))
AlertDescription.displayName = "AlertDescription"

const AlertTitle = React.forwardRef<
  React.ElementRef<"p">,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

export {
  Alert,
  AlertDescription,
  AlertTitle,
}
