import { ContactHero } from '@/components/aspire/Contact/ContactHero';
import { Footer } from '@/components/aspire/Footer';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Information Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Contact with Us
            </h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-orange-500" />
            <p className="text-lg text-[#697585]">
              Feel free to write us anytime
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Phone Card */}
            <div className="group rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 transition-colors duration-300 group-hover:bg-orange-500">
                <Phone className="h-8 w-8 text-orange-500 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#070b30]">Phone</h3>
              <a
                href="tel:+61452092360"
                className="text-lg text-[#697585] transition-colors hover:text-orange-500"
              >
                +61 452 092 360
              </a>
            </div>

            {/* Email Card */}
            <div className="group rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 transition-colors duration-300 group-hover:bg-orange-500">
                <Mail className="h-8 w-8 text-orange-500 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#070b30]">Email</h3>
              <a
                href="mailto:info@aspireacademics.au"
                className="text-lg text-[#697585] transition-colors hover:text-orange-500"
              >
                info@aspireacademics.au
              </a>
            </div>

            {/* Address Card */}
            <div className="group rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 transition-colors duration-300 group-hover:bg-orange-500">
                <MapPin className="h-8 w-8 text-orange-500 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#070b30]">Address</h3>
              <p className="text-lg text-[#697585]">
                Unit 15, 150 Palmers Road
                <br />
                Truganina 3029
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="mb-6 text-2xl font-bold text-[#070b30]">
            Follow Us on Social Media
          </h3>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.facebook.com/people/Aspire-Academics/100089732861302/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877f2] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Facebook className="h-7 w-7" />
            </a>
            <a
              href="https://www.instagram.com/aspire.academics/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Instagram className="h-7 w-7" />
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Find Us
            </h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-orange-500" />
            <p className="text-lg text-[#697585]">
              Visit us at our Truganina location
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.2897863746847!2d144.75362!3d-37.843629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad68251aab29f13%3A0x5f0c0a01b7f0a01b!2s15%2F150%20Palmers%20Rd%2C%20Truganina%20VIC%203029%2C%20Australia!5e0!3m2!1sen-GB!2sus!4v1234567890!5m2!1sen-GB!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aspire Academics Location"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Frequently Asked Question
            </h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-orange-500" />
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-bold text-[#070b30]">
                How can I enroll?
              </h3>
              <p className="leading-relaxed text-[#697585]">
                Please click on the{' '}
                <Link
                  href="/#form"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Book Free Trial
                </Link>{' '}
                button from the top menu and fill the consultation form. Once the
                form is submitted, our admin team will get in touch with you soon.
              </p>
            </div>

            <div className="mt-8 rounded-lg bg-orange-500/5 p-6">
              <p className="text-center text-[#697585]">
                Have more questions?{' '}
                <a
                  href="tel:+61452092360"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Call us at +61 452 092 360
                </a>{' '}
                or{' '}
                <a
                  href="mailto:info@aspireacademics.au"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  send us an email
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#070b30] to-[#0a1045] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Start Getting New Knowledge and Experience, Together!
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join hundreds of students who have achieved excellence with Aspire
            Academics
          </p>
          <a
            href="/#form"
            className="inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
          >
            Book Free Trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
