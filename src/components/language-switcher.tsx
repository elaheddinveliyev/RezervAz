"use client";

import { Languages } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";

type Language = "az" | "tr" | "en" | "ru";

const languages: { value: Language; label: string }[] = [
  { value: "az", label: "Azərbaycanca" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

const translations: Record<string, Record<Language, string>> = {
  "Admin login": { az: "Admin girişi", tr: "Yönetici girişi", en: "Admin login", ru: "Вход администратора" },
  "Reservation dashboard": { az: "Rezervasiya paneli", tr: "Rezervasyon paneli", en: "Reservation dashboard", ru: "Панель бронирований" },
  Dashboard: { az: "Panel", tr: "Panel", en: "Dashboard", ru: "Панель" },
  Reservations: { az: "Rezervasiyalar", tr: "Rezervasyonlar", en: "Reservations", ru: "Бронирования" },
  Calendar: { az: "Təqvim", tr: "Takvim", en: "Calendar", ru: "Календарь" },
  Staff: { az: "Personal", tr: "Personel", en: "Staff", ru: "Персонал" },
  Services: { az: "Xidmətlər", tr: "Hizmetler", en: "Services", ru: "Услуги" },
  Customers: { az: "Müştərilər", tr: "Müşteriler", en: "Customers", ru: "Клиенты" },
  Settings: { az: "Parametrlər", tr: "Ayarlar", en: "Settings", ru: "Настройки" },
  "Public Page": { az: "İctimai səhifə", tr: "Herkese açık sayfa", en: "Public Page", ru: "Публичная страница" },
  "Sign Out": { az: "Çıxış", tr: "Çıkış", en: "Sign Out", ru: "Выйти" },
  "Choose lounge reservation": { az: "Lounge rezervasiyası seçin", tr: "Lounge rezervasyonu seçin", en: "Choose lounge reservation", ru: "Выберите бронирование лаунжа" },
  "Choose appointment": { az: "Görüş seçin", tr: "Randevu seçin", en: "Choose appointment", ru: "Выберите приём" },
  "Choose gaming session": { az: "Oyun sessiyası seçin", tr: "Oyun oturumu seçin", en: "Choose gaming session", ru: "Выберите игровую сессию" },
  "Pick an experience, room or table, and date to see available time slots.": { az: "Mövcud vaxtları görmək üçün təcrübə, otaq və ya masa və tarix seçin.", tr: "Uygun saatları görmek için deneyim, oda veya masa ve tarih seçin.", en: "Pick an experience, room or table, and date to see available time slots.", ru: "Выберите услугу, комнату или стол и дату, чтобы увидеть свободное время." },
  "Pick a package, cabinet or room, and date to see available time slots.": { az: "Mövcud vaxtları görmək üçün paket, kabinet və ya otaq və tarix seçin.", tr: "Uygun saatları görmek için paket, kabin veya oda ve tarih seçin.", en: "Pick a package, cabinet or room, and date to see available time slots.", ru: "Выберите пакет, кабинет или комнату и дату, чтобы увидеть свободное время." },
  "Pick a service, provider, and date to see available time slots.": { az: "Mövcud vaxtları görmək üçün xidmət, əməkdaş və tarix seçin.", tr: "Uygun saatları görmek için hizmet, personel ve tarih seçin.", en: "Pick a service, provider, and date to see available time slots.", ru: "Выберите услугу, специалиста и дату, чтобы увидеть свободное время." },
  Room: { az: "Otaq", tr: "Oda", en: "Room", ru: "Комната" },
  "Room type": { az: "Otaq növü", tr: "Oda türü", en: "Room type", ru: "Тип комнаты" },
  "Room quality": { az: "Otaq seçimi", tr: "Oda seçimi", en: "Room quality", ru: "Выбор комнаты" },
  Standard: { az: "Standart", tr: "Standart", en: "Standard", ru: "Стандарт" },
  "1 hour:": { az: "1 saat:", tr: "1 saat:", en: "1 hour:", ru: "1 час:" },
  ". Choose Standard or PS5 above.": { az: ". Yuxarıdan Standart və ya PS5 seçin.", tr: ". Yukarıdan Standart veya PS5 seçin.", en: ". Choose Standard or PS5 above.", ru: ". Выберите выше Стандарт или PS5." },
  "How many hours": { az: "Neçə saat", tr: "Kaç saat", en: "How many hours", ru: "Количество часов" },
  "Enter 1 to 8 hours. The price is charged per hour.": { az: "1-dən 8-ə qədər saat yazın. Ödəniş saat hesablanır.", tr: "1 ile 8 saat arasında yazın. Ücret saat başına hesaplanır.", en: "Enter 1 to 8 hours. The price is charged per hour.", ru: "Введите от 1 до 8 часов. Оплата рассчитывается за час." },
  Date: { az: "Tarix", tr: "Tarih", en: "Date", ru: "Дата" },
  "Check availability": { az: "Mövcudluğu yoxla", tr: "Uygunluğu kontrol et", en: "Check availability", ru: "Проверить доступность" },
  "Book a time": { az: "Vaxt bron edin", tr: "Zaman ayırtın", en: "Book a time", ru: "Забронировать время" },
  "Available time": { az: "Mövcud vaxt", tr: "Uygun saat", en: "Available time", ru: "Доступное время" },
  "Full name": { az: "Ad və soyad", tr: "Ad soyad", en: "Full name", ru: "Полное имя" },
  "Phone number": { az: "Telefon nömrəsi", tr: "Telefon numarası", en: "Phone number", ru: "Номер телефона" },
  "Email optional": { az: "E-poçt (istəyə görə)", tr: "E-posta (isteğe bağlı)", en: "Email optional", ru: "Электронная почта (необязательно)" },
  "Submit Booking Request": { az: "Rezervasiya sorğusu göndər", tr: "Rezervasyon talebi gönder", en: "Submit Booking Request", ru: "Отправить запрос на бронирование" },
  "Your request will be sent as pending. The admin can confirm or cancel it.": { az: "Sorğunuz gözləmədə göndəriləcək. Admin onu təsdiq və ya ləğv edə bilər.", tr: "Talebiniz beklemede gönderilecek. Yönetici onaylayabilir veya iptal edebilir.", en: "Your request will be sent as pending. The admin can confirm or cancel it.", ru: "Ваш запрос будет отправлен на рассмотрение. Администратор может подтвердить или отменить его." },
  "Preview rooms": { az: "Otaqlara baxış", tr: "Oda önizlemesi", en: "Preview rooms", ru: "Просмотр комнат" },
  "This gallery previews 27 rooms automatically. The photo updates every few seconds.": { az: "Bu qalereya 27 otağı göstərir. Şəkil bir neçə saniyədən bir dəyişir.", tr: "Bu galeri 27 odayı gösterir. Fotoğraf birkaç saniyede bir değişir.", en: "This gallery previews 27 rooms automatically. The photo updates every few seconds.", ru: "В этой галерее показаны 27 комнат. Фотография меняется каждые несколько секунд." },
  "The photo changes automatically every 8 seconds. Use the arrows or dots to choose manually.": { az: "Şəkil hər 8 saniyədən bir avtomatik dəyişir. Oxlar və ya nöqtələrlə seçimi əl ilə edin.", tr: "Fotoğraf her 8 saniyede otomatik değişir. Okları veya noktaları kullanarak elle seçin.", en: "The photo changes automatically every 8 seconds. Use the arrows or dots to choose manually.", ru: "Фотография меняется каждые 8 секунд. Используйте стрелки или точки для выбора вручную." },
  "Weekly timetable": { az: "Həftəlik cədvəl", tr: "Haftalık zaman çizelgesi", en: "Weekly timetable", ru: "Недельное расписание" },
  Hour: { az: "Saat", tr: "Saat", en: "Hour", ru: "Час" },
  Free: { az: "Boş", tr: "Boş", en: "Free", ru: "Свободно" },
  Booked: { az: "Dolu", tr: "Dolu", en: "Booked", ru: "Занято" },
  "Phone not set": { az: "Telefon qeyd edilməyib", tr: "Telefon ayarlanmadı", en: "Phone not set", ru: "Телефон не указан" },
  "Address not set": { az: "Ünvan qeyd edilməyib", tr: "Adres ayarlanmadı", en: "Address not set", ru: "Адрес не указан" },
};

function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    if (node.parentElement?.tagName !== "SCRIPT" && node.parentElement?.tagName !== "STYLE") {
      nodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  for (const textNode of nodes) {
    const original = textNode.textContent ?? "";
    const trimmed = original.trim();
    const entry = Object.entries(translations).find(([, values]) =>
      Object.values(values).includes(trimmed),
    );

    if (!entry) {
      continue;
    }

    const translated = entry[1][language];
    if (translated === trimmed) {
      continue;
    }

    textNode.textContent = `${original.slice(0, original.indexOf(trimmed))}${translated}${original.slice(original.indexOf(trimmed) + trimmed.length)}`;
  }
}

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("az");
  const observerRef = useRef<MutationObserver | null>(null);
  const languageRef = useRef<Language>("az");

  useEffect(() => {
    const saved = window.localStorage.getItem("rezervaz-language") as Language | null;
    const initial = languages.some((item) => item.value === saved) ? saved! : "az";
    languageRef.current = initial;
    startTransition(() => setLanguage(initial));
    document.documentElement.lang = initial;
    translatePage(initial);

    observerRef.current = new MutationObserver(() => translatePage(languageRef.current));
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    return () => observerRef.current?.disconnect();
  }, []);

  function changeLanguage(nextLanguage: Language) {
    languageRef.current = nextLanguage;
    setLanguage(nextLanguage);
    window.localStorage.setItem("rezervaz-language", nextLanguage);
    document.cookie = `rezervaz-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLanguage;
    translatePage(nextLanguage);
  }

  return (
    <label className="language-switcher inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-secondary)]/40 bg-[color:var(--brand)]/12 px-3 py-2 text-xs font-semibold text-[color:var(--brand)] backdrop-blur">
      <Languages className="h-4 w-4 text-[color:var(--brand)]" aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        value={language}
        onChange={(event) => changeLanguage(event.target.value as Language)}
        className="max-w-[9rem] bg-transparent text-[color:var(--brand)] outline-none"
      >
        {languages.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
