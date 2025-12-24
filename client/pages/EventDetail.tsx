import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Event Details Page</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Event ID: {id}
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This page will show complete event information including:
          </p>
          <ul className="text-muted-foreground mt-6 space-y-2">
            <li>• Large event banner image</li>
            <li>• Event title and description</li>
            <li>• Date, time, and location details</li>
            <li>• Organizer information</li>
            <li>• Available seats indicator</li>
            <li>• Book Now button</li>
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
