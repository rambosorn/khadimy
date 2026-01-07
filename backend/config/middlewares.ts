export default ({ env }) => [
  {
    name: "strapi::cors",
    config: {
      origin: env('CORS_ORIGINS') ? env('CORS_ORIGINS').split(',') : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "https://dashing-longma-925d05.netlify.app",
        "https://khadimy.com",
        "https://www.khadimy.com"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type", "Authorization"],
    },
  },
  "strapi::errors",
  "strapi::security",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
