import Layout from "@/components/Layout";

export default function Browse() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Browse Events</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore all available events
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This page will include advanced filtering and search options for browsing all events with category filters, date ranges, and location-based search.
          </p>
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
