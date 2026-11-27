"use client";

/**
 * Last-resort boundary for failures in the locale layout itself.
 *
 * It cannot rely on next-intl's provider or the app stylesheet, so it ships its
 * own document and the three supported languages in one compact fallback. Every
 * nested failure is handled by a localized `error.tsx` instead.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          color: "#171717",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "28rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
        >
          <strong style={{ color: "#166534" }}>IBNI</strong>
          <h1 style={{ fontSize: "1.5rem", margin: "1rem 0 0.5rem" }}>
            حدث خطأ ما / Something went wrong / Une erreur est survenue
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#4b5563" }}>
            أعد تحميل الصفحة. Please refresh the page. Veuillez actualiser la
            page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              borderRadius: "0.375rem",
              background: "#16a34a",
              color: "#ffffff",
              border: 0,
              padding: "0.625rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            إعادة المحاولة / Try again / Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
