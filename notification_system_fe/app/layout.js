import ThemeRegistry from "./themeRegistry";

export const metadata = {
    title: "Campus Notification System",
    description: "Notification Platform"
};

export default function RootLayout({ children }) {

    return (

        <html lang="en">

            <body>

                <ThemeRegistry>
                    {children}
                </ThemeRegistry>

            </body>

        </html>
    );
}