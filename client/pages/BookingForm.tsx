import Layout from "@/components/Layout";

export default function BookingForm() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Booking Form</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Complete your event booking
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This page will include:
          </p>
          <ul className="text-muted-foreground mt-6 space-y-2">
            <li>• User name input</li>
            <li>• Email input with validation</li>
            <li>• Number of tickets selector</li>
            <li>• Booking summary card</li>
            <li>• Floating labels</li>
            <li>• Form validation messages</li>
            <li>• Success confirmation animation</li>
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
