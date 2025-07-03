import React from "react";
import SignInForm from "@/components/tail-admin/auth/SignInForm";
import SignUpForm from "@/components/tail-admin/auth/SignUpForm";
import Calendar from "@/components/tail-admin/calendar/Calendar";
import BasicTableOne from "@/components/tail-admin/tables/BasicTableOne";

export default function TailAdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">TailAdmin UI Kit Showcase</h1>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Authentication Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-2">Sign In</h3>
            <SignInForm />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Sign Up</h3>
            <SignUpForm />
          </div>
        </div>
      </section>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
        <Calendar />
      </section>



      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Basic Table</h2>
        <BasicTableOne />
      </section>
    </div>
  );
} 