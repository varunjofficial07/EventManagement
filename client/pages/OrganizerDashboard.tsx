import Layout from "@/components/Layout";

export default function OrganizerDashboard() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Organizer Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Manage your events and bookings
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This page will include:
          </p>
          <ul className="text-muted-foreground mt-6 space-y-2">
            <li>• Sidebar navigation layout</li>
            <li>• Dashboard Overview section</li>
            <li>• Statistics cards (Total events, Total bookings)</li>
            <li>• Upcoming events list</li>
            <li>• Event performance charts</li>
            <li>• Data tables with bookings</li>
            <li>• Icons for each menu item</li>
          </ul>
          <div className="mt-12">
            <p className="text-sm text-muted-foreground">
              Continue interacting with the app to fill in this page content.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
