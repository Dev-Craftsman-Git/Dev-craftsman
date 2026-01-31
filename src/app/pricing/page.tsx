import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/sections/Footer";
import { getSectionVisibility } from "@/lib/db-queries";
import { redirect } from "next/navigation";

export default async function PricingPage() {
    const isVisible = await getSectionVisibility('home', 'pricing');

    if (!isVisible) {
        redirect('/');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-12">
                <Pricing />
            </div>
            <Footer />
        </div>
    );
}
