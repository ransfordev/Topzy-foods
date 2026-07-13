import React, { useState } from "react";
import { motion } from "motion/react";
import { CalendarClock, Send, CheckCircle2 } from "lucide-react";

export default function CalculatorAndReserve({ whatsappNumber = "233598404079" }: { whatsappNumber?: string }) {
  // Reservation States
  const [resName, setResName] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("");
  const [resGuests, setResGuests] = useState("2");
  const [resRequests, setResRequests] = useState("");
  const [reservationSent, setReservationSent] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(null);

  // Submit Table Reservation via WhatsApp
  const handleReserveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resPhone || !resDate || !resTime) {
      return;
    }

    // Format pre-filled WhatsApp message
    const message = `👋 Hello Topzy Foods! I'd like to book a table:

📅 *RESERVATION DETAILS:*
👤 Name: ${resName}
📞 Phone: ${resPhone}
📅 Date: ${resDate}
⏰ Time: ${resTime}
👥 Number of Guests: ${resGuests}
💬 Special Requests: ${resRequests ? resRequests : "None"}

Please confirm my booking. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    setSubmittedWhatsappUrl(whatsappUrl);
    setReservationSent(true);
  };

  return (
    <section id="reservation" className="py-24 bg-brand-cream/30 dark:bg-zinc-900/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Table Reservation Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-zinc-800 rounded-3xl p-8 sm:p-12 border border-zinc-100 dark:border-zinc-700/50 shadow-sm space-y-8"
        >
          {submittedWhatsappUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center max-w-md mx-auto py-6"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-black text-2xl text-zinc-900 dark:text-white">
                  Reservation Formed!
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Your reservation is drafted. Click the green button below to submit directly to our team via WhatsApp Chat to instantly secure your booking!
                </p>
              </div>

              {/* Detail summary */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Name:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{resName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date & Time:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{resDate} @ {resTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Guests:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{resGuests} Guests</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={submittedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setSubmittedWhatsappUrl(null);
                    setReservationSent(false);
                    // Reset fields
                    setResName("");
                    setResPhone("");
                    setResDate("");
                    setResTime("");
                    setResRequests("");
                  }}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer font-sans"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reservation via WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmittedWhatsappUrl(null);
                    setReservationSent(false);
                  }}
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Modify Reservation Details
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0">
                  <CalendarClock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-zinc-900 dark:text-white text-2xl sm:text-3xl">
                    Table Reservation
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                    Book a serene table instantly via WhatsApp confirmation
                  </p>
                </div>
              </div>

              <form onSubmit={handleReserveWhatsApp} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                      Full Name <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwabena Mensah"
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                      Phone Number <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +233 59 840 4079"
                      value={resPhone}
                      onChange={(e) => setResPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                      Date <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                      Time <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                      Number of Guests <span className="text-brand-orange">*</span>
                    </label>
                    <select
                      value={resGuests}
                      onChange={(e) => setResGuests(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6+">6+ Guests (Party)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Birthday setup, high-chair for a child, food allergies..."
                    value={resRequests}
                    onChange={(e) => setResRequests(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-orange hover:bg-brand-dark text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-brand-orange/10"
                >
                  <Send className="w-4 h-4" />
                  <span>Reserve via WhatsApp</span>
                </button>
              </form>
            </>
          )}

          {reservationSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-xl flex items-center gap-2.5 text-green-800 dark:text-green-300 text-xs font-medium"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span>Reservation sent successfully! You have been redirected to WhatsApp to finalize the booking with our team.</span>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
