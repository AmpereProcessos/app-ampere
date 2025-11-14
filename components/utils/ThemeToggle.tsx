"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

type ThemeToggleProps = {
	className?: string;
};
export const ThemeToggle = ({ className }: ThemeToggleProps) => {
	const { theme, setTheme } = useTheme();

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<Button variant="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")} size={"fit"} className="p-1 lg:p-2">
				{theme === "light" ? <SunIcon className="h-4 w-4 lg:h-5 lg:w-5" /> : <MoonIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
			</Button>
		</div>
	);
};
