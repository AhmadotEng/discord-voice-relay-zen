# Security policy

## Supported version

Only the latest release is supported. Version 0.1.0 has been tested on macOS 15.6.1 on Apple silicon with Zen Browser 1.18.10b / Gecko 147.0.4.

## Reporting a vulnerability

Please use this repository's **Security** tab and submit a private vulnerability report. Do not include live TURN credentials, Discord tokens, `about:webrtc` dumps, IP addresses, or unrelated personal data. Avoid opening a public issue until a fix or coordinated disclosure plan is available.

Useful reports include the affected version, Zen/Gecko version, operating system, minimal reproduction steps, and security impact.

## Sensitive values

Only enter short-lived TURN client credentials or a dedicated limited Coturn account into the extension. Never enter a provider API token, credential-minting secret, Cloudflare TURN-key token, or Coturn shared secret. Never commit `deploy/coturn/.env`, certificates, or private keys.
