import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata : Metadata = {
    title: "Tetris Online",
    applicationName: "Luca Mawyin Portfolio",
    category: "technology",
    icons: {
        icon: [
            {
                url: "/favicon.png",
                type: "image/png",
            },
        ],
    },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
                <NotificationProvider>
                    <main className="
                        flex 
                        min-h-screen
                        min-w-full
                        justify-center
                        items-center
                    ">
                        {children}
                    </main>                    
                </NotificationProvider>
            </body>
		</html>
	);
}
