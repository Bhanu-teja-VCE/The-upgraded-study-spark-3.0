import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
    attribute?: any
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme={defaultTheme}
            enableSystem
            storageKey={storageKey}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}
