import { AdminWordForm } from "@/components/admin/AdminWordForm";

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Admin Panel
                </h1>
                <p className="text-muted-foreground">Manage words for all departments.</p>
            </div>
            <AdminWordForm />
        </div>
    )
}
