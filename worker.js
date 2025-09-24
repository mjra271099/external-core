export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Cek hanya untuk file tertentu
    if (url.pathname === "/main-core-videy-cf.js") {
      const secFetchDest = request.headers.get("sec-fetch-dest") || ""
      const accept = request.headers.get("accept") || ""
      const secFetchMode = request.headers.get("sec-fetch-mode") || ""

      // Jika akses langsung (navigate/document), blok
      const looksLikeNavigation =
        secFetchDest.toLowerCase().includes("document") ||
        accept.toLowerCase().includes("text/html") ||
        secFetchMode.toLowerCase().includes("navigate")

      if (looksLikeNavigation) {
        return new Response("403 Forbidden", { status: 403 })
      }

      // Kalau lewat <script src>, izinkan (forward ke origin)
      return fetch(request)
    }

    // Default: teruskan request lain apa adanya
    return fetch(request)
  },
}
