import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav>共享占位</nav>
        {children}
    </section>
}