import TopNav from "./TopNav";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">EventHub</h4>
              <p className="text-muted-foreground">
                Discover and book amazing events with ease.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Browse Events</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">My Bookings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Create Event</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-muted-foreground text-sm">
              &copy; 2024 EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
