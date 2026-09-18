export const SITE = {
  name: "Ranbhoomi Fitness Club",
  short: "Ranbhoomi",
  phone: "+917668237889",
  phoneDisplay: "+91 76682 37889",
  email: "Ranbhoomi.fit@gmail.com",
  instagram: "https://www.instagram.com/ranbhoomi.fit/",
  facebook: "https://www.facebook.com/1158698163995374",
  addressLines: [
    "2nd Floor, Usha Colony, Sahastradhara Road",
    "Above SBI Bank, Kulhan, Kirsali",
    "Dehradun 248001",
  ],
  address: "2nd Floor, Usha Colony, Sahastradhara Road, Above SBI Bank, Kulhan, Kirsali, Dehradun 248001",
  mapsEmbed:
    "https://maps.google.com/maps?q=Ranbhoomi%20Fitness%20Club%20RFC%20Kirsali%20Dehradun&z=16&output=embed",
  mapsLink: "https://maps.google.com/?q=Ranbhoomi+Fitness+Club+RFC+Kirsali+Dehradun",
} as const;

export const telHref = `tel:${SITE.phone}`;
export const waHref = `https://wa.me/${SITE.phone.replace("+", "")}`;
export const mailHref = `mailto:${SITE.email}`;

export const NAV = [
  { href: "/#train", label: "Train" },
  { href: "/#timings", label: "Timings" },
  { href: "/#announcements", label: "Announcements" },
  { href: "/#coaches", label: "Coaches" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#find-us", label: "Find us" },
] as const;
