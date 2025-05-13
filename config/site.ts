export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  apiBaseUrl: process.env.API_URL,
  name: "Viansa Backoffice",
  description: "Viansa tools for administration and management",
  navItems: [
    {
      label: "Home",
      href: "/home",
    },
    {
      label: "User",
      href: "/home/users",
    },
    {
      label: "Plants",
      href: "/home/plants",
    },
    {
      label: "Stock",
      href: "/home/stock",
    },
    {
      label: "Client",
      href: "/home/clients",
    },
  ],
};
