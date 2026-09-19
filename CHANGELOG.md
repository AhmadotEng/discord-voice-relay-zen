# Changelog

## 0.2.4 — 2026-09-19

- Replaced the external TURN-over-TCP/TLS design with an extension-owned loopback TURN bridge and direct UDP transport.
- Removed the external relay, saved provider credentials, native helper, WARP, proxy, and system-install requirements.
- Added two-destination STUN mapping consensus and fail-closed NAT/address checks.
- Added fresh-offer gating, generation/revision-bound route proof, and **Protected route verified** status.
- Added migration that removes version 0.1.0's saved TURN URL and credentials.
- Required Zen/Firefox 152 or newer for Mozilla's corrected ICE relay validation behavior.
- Added Firefox 156 packaged-script loader compatibility.
- Expanded the dependency-free automated suite to 111 tests.
- Validated a live Discord Web voice connection and incoming audio on macOS with Zen 1.22.2b / Firefox 156.

## 0.1.0 — 2026-09-15

- Initial preview using a user-supplied authenticated TURN server over TCP/TLS.
- Preserved as the immutable [`v0.1.0` tag](https://github.com/AhmadotEng/discord-voice-relay-zen/tree/v0.1.0) and [GitHub prerelease](https://github.com/AhmadotEng/discord-voice-relay-zen/releases/tag/v0.1.0).
- See [LEGACY-V0.1.0.md](LEGACY-V0.1.0.md) for the original setup and limitations.
