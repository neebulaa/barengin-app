import NavbarAuth from '@/Components/NavbarAuth';
import NavbarGuest from '@/Components/NavbarGuest';
import Footer from '@/Components/Footer';

import { Head, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { url, props } = usePage();
    const {
        auth: { user },
    } = props;

    const hideLayout =
        url.startsWith("/reset-password") ||
        ["/login", "/sign-up", "/onboarding", "/forgot-password"].includes(url);

    return (
        <>
            <Head>
                <title>Barengin App</title>

                <meta
                    name="description"
                    content="Platform social-travel untuk hemat biaya perjalanan melalui fitur patungan kursi, jastip, dan open trip berbasis komunitas."
                />
                <meta
                    name="keywords"
                    content="Barengin App, social travel, budget travel, ride-sharing, shopping assistance, open trip"
                />
                <meta name="author" content="Barengin App" />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <link rel="icon" href="/assets/logo/logo-transparent.png" />
            </Head>

            {!hideLayout &&
                (user ? <NavbarAuth user={user} /> : <NavbarGuest />)}

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </div>

            {!hideLayout && <Footer />}
        </>
    );
}
