import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		const scriptPolicy =
			process.env.NODE_ENV === "development"
				? "'self' 'unsafe-inline' 'unsafe-eval'"
				: "'self' 'unsafe-inline'";
		const headers = [
			{ key: "Content-Security-Policy", value: `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src ${scriptPolicy}; connect-src 'self' https://*.supabase.co wss://*.supabase.co; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` },
			{ key: "X-Frame-Options", value: "DENY" },
			{ key: "X-Content-Type-Options", value: "nosniff" },
			{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
			{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
		];

		if (process.env.NODE_ENV === "production") {
			headers.push({
				key: "Strict-Transport-Security",
				value: "max-age=31536000; includeSubDomains",
			});
		}

		return [{ source: "/(.*)", headers }];
	},
};

export default nextConfig;
