# Validation results

Date: 2026-09-15  
Platform: macOS 15.6.1 on Apple silicon  
Zen: 1.18.10b / Gecko 147.0.4  
Candidate: version 0.1.0

## Completed checks

- 16/16 Node unit tests passed.
- `web-ext lint` completed with zero errors and zero warnings.
- The XPI passed ZIP integrity testing.
- SHA-256 of the repository-built XPI: `4d3a4040fa884dc6b10afc87799367bf46343b2fd007154481c63b573afdb6d3`.
- The repository-built XPI temporarily installed and initialized in Zen on macOS.
- A live page-hook smoke test on `discord.com` confirmed that a targeted peer connection received the configured synthetic TURN server and `iceTransportPolicy: "relay"`; an invalid-port configuration was not applied.
- A current Discord Web asset inspection found the `plan-b`, `unified-plan`, and `max-bundle` configuration markers targeted by the selection logic.

## Remaining validation

- Complete an authenticated end-to-end Discord voice call through a real TURN-over-TCP/TLS service.
- Verify two-way audio stability and reconnection.
- Confirm the selected candidate independently in `about:webrtc`.
- Repeat installation and live-call testing on Windows and Linux.

The completed checks establish source behavior, packaging, temporary Zen compatibility, and current hook-signature compatibility. They do not yet establish that a particular TURN provider or live Discord call succeeds.
