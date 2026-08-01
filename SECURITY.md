# Security Policy

## Supported Versions

We release patches for security vulnerabilities. The following versions are currently supported:

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainers at: security@rezervaz.example.com (or create a private security advisory on GitHub)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will:
- Acknowledge receipt within 48 hours
- Provide a timeline for fix
- Credit you in the fix (if desired)

## Security Considerations

### Authentication & Authorization
- All dashboard routes are protected via Supabase Auth
- Row Level Security (RLS) policies on all database tables
- Admin/staff roles enforced server-side
- Magic link authentication supported

### Data Protection
- No sensitive data in client-side code
- Environment variables for secrets
- HTTPS enforced in production (Vercel default)
- No paid APIs or external data sharing

### Demo Mode
- In-memory demo store (no persistence)
- Demo passwords only work when `DEMO_LOGIN_ENABLED=true`
- `DEMO_DATA_ENABLED=true` isolates demo data from Supabase

### Dependencies
- Regular `npm audit` in CI
- Dependencies updated via Dependabot
- Only necessary dependencies included

## Best Practices for Deployments

1. **Never commit `.env.local` or secrets**
2. Use Vercel environment variables for production
3. Set `DEMO_LOGIN_ENABLED=false` in production
4. Set `DEMO_DATA_ENABLED=false` in production
5. Use strong Supabase JWT secrets
6. Enable RLS on all tables
7. Regularly rotate Supabase keys

## Known Limitations

- No rate limiting on public booking (add via middleware if needed)
- No CAPTCHA on public forms (consider for high-traffic deployments)
- WhatsApp reminders are copy-only (no automation)

## Security Updates

Security patches will be released as patch versions. Subscribe to GitHub releases for notifications.