import Link from "next/link";
import {
  CalendarCheck,
  ShieldCheck,
  Zap,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Gamepad2,
  Stethoscope,
  Scissors,
  Compass,
  Building2,
  Globe2,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  const solutions = [
    {
      title: "Lounge & Game Centers",
      desc: "Otaqlar, VIP kabinetlər, PS5 və saatlıq tariflər üçün xüsusi cədvəl.",
      icon: Gamepad2,
      badge: "LaLiga Lounge Demo",
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    {
      title: "Klinika & Tibb Mərkəzləri",
      desc: "Həkim qəbulları, stomatologiya və müayinə vaxtlarının dəqiq bölgüsü.",
      icon: Stethoscope,
      badge: "Klinika Demo",
      color: "bg-teal-500/10 text-teal-600 border-teal-200",
    },
    {
      title: "Gözəllik & Spa Salonları",
      desc: "Usta seçimi, xidmət müddətləri və avtomatik saatlıq rezervasiya.",
      icon: Scissors,
      badge: "Salon Demo",
      color: "bg-pink-500/10 text-pink-600 border-pink-200",
    },
    {
      title: "Turizm & Bələdçi Turları",
      desc: "Şəhər turları, qrup ekskursiyaları və aqro-turizm paketləri.",
      icon: Compass,
      badge: "Turlar Demo",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "0% İkiqat Rezervasiya",
      desc: "Ağıllı alqoritm eyni otaq və ya işçiyə üst-üstə düşən vaxtlarda təkrar rezervasiyanın qarşısını 100% alır.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp İnteqrasiyası",
      desc: "Müştəriyə tək kliklə fərdiləşdirilmiş təsdiq və xatırlatma mesajı göndərin.",
    },
    {
      icon: Zap,
      title: "Real-Vaxt Cədvəli",
      desc: "Həftəlik və günlük interaktiv cədvəl ilə bütün otaqların və əməkdaşların doluluğunu izləyin.",
    },
    {
      icon: Globe2,
      title: "White-Label Brendinq",
      desc: "Öz loqonuz, rəngləriniz, unikal keçid linkiniz və domeninizlə tam fərdiləşdirilə bilən sistem.",
    },
    {
      icon: Clock,
      title: "Xidmət Müddəti Hesablanması",
      desc: "Paketin və ya xidmətin müddətinə uyğun olaraq bitmə vaxtı avtomatik hesablanır.",
    },
    {
      icon: Users,
      title: "Müştəri və Maliyyə İdarəsi",
      desc: "Daimi müştəri bazası, qeydlər və təxmini gəlir hesabatları vahid idarəetmə panelində.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20">
              <CalendarCheck className="h-6 w-6 font-bold" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Rezerv<span className="text-teal-400">AZ</span>
              </span>
              <span className="ml-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                MVP v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 sm:inline-flex"
            >
              Canlı Rezervasiya Səhifəsi
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-teal-500/20 transition hover:bg-teal-400"
              >
                <span>Panelə Keç</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-teal-500/20 transition hover:bg-teal-400"
              >
                <span>Admin Girişi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(20,184,166,0.25),rgba(255,255,255,0))]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Azərbaycan Xidmət Sektoru Üçün Vahid Rezervasiya Sistemi</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Müştəriləriniz üçün rahat, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
              biznesiniz üçün qüsursuz idarəetmə.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Otaqlar, həkimlər, ustalar və xidmətlər üzrə onlayn rezervasiya qəbul edin. İkiqat rezervasiyanın qarşısını alın, WhatsApp xatırlatmaları göndərin və qrafiki vahid paneldən idarə edin.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-6 text-base font-bold text-slate-950 shadow-xl shadow-teal-500/25 transition hover:brightness-110 sm:w-auto"
            >
              <CalendarCheck className="h-5 w-5" />
              <span>Canlı Demo Rezervasiya Et</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 text-base font-semibold text-slate-100 backdrop-blur transition hover:bg-slate-800 sm:w-auto"
            >
              <Building2 className="h-5 w-5 text-teal-400" />
              <span>İdarəetmə Panelinə Bax</span>
            </Link>
          </div>

          {/* Quick Metrics Badge */}
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur sm:grid-cols-4 sm:p-6">
            <div>
              <p className="text-2xl font-bold text-teal-400">100%</p>
              <p className="mt-1 text-xs text-slate-400">İkiqat Rezervasiya Bloklanması</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">4 Dildə</p>
              <p className="mt-1 text-xs text-slate-400">AZ • TR • EN • RU Dəstəyi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-400">Tək Kliklə</p>
              <p className="mt-1 text-xs text-slate-400">WhatsApp Xatırlatma Mesajı</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">Vercel & Supabase</p>
              <p className="mt-1 text-xs text-slate-400">Hazır İstehsalat Arxitekturası</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="border-t border-slate-900 bg-slate-900/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400">
              Hər Biznes Növünə Uyğunlaşan Həll
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              İstənilən Xidmət Sahəsi Üçün Hazır
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              RezervAZ sistemi istənilən vaxt təyin edilən biznesə saniyələr içində fərdiləşdirilə bilər.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700 hover:bg-slate-800/80"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`mt-4 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${item.color}`}>
                      {item.badge}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 transition hover:text-teal-300"
                    >
                      <span>Rezervasiyanı sına</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400">
              Güclü İmkanlar
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Niyə RezervAZ?
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur transition hover:border-teal-500/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            RezervAZ ilə dərhal başlamağa hazırsınız?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Aktiv demo rejimində sistemi yoxlayın və ya öz biznesiniz üçün Vercel-də saniyələr içində yayımlayın.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-bold text-slate-950 transition hover:bg-teal-400"
            >
              <span>İctimai Rezervasiya Səhifəsi</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <span>İdarəetmə Panelinə Giriş</span>
            </Link>
          </div>
          <p className="mt-12 text-xs text-slate-600">
            © {new Date().getFullYear()} RezervAZ. Bütün hüquqlar qorunur. Made with ❤️ for Azerbaijan&apos;s appointment-based businesses.
          </p>
        </div>
      </section>
    </div>
  );
}

