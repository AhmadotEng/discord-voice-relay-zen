# Testing Discord Voice Relay for Zen

## Automated checks

From the repository root:

```sh
node --test tests/*.test.js
npx --yes web-ext@8.10.0 lint --source-dir . --ignore-files 'tests/**' 'deploy/**' 'dist/**' 'scripts/**'
```

The tests cover settings validation, TURN URL restrictions, Discord peer-connection selection, constructor and `setConfiguration()` wrapping, page/extension bridging, popup state, and status redaction.

## Temporary load on macOS

1. Open `about:debugging#/runtime/this-firefox` in Zen.
2. Load the release XPI, or select this repository's `manifest.json` for unpacked source.
3. Open `https://discord.com/app` and confirm the extension's page hook initializes.
4. Open the popup, save a syntactically valid test configuration, and confirm no raw credential appears in diagnostics or logs.

No `extensions.experiments.enabled` change is required.

## Authenticated end-to-end test

Use a dedicated or short-lived credential from a TURN service you control or trust:

1. Configure `turns:HOST:443?transport=tcp`, the client username, and client credential.
2. Enable and save the extension.
3. Reload Discord, join a voice channel, then leave and rejoin once.
4. Confirm two-way audio for several minutes.
5. Open `about:webrtc` and verify the selected local candidate is type `relay` with `relayProtocol` equal to `tls` or `tcp`.
6. Confirm no host candidate was selected for the targeted external connection.
7. Disable the extension, reconnect, and confirm the saved TURN server is no longer supplied.

Do not publish `about:webrtc` output. Redact IP addresses, usernames, credentials, SDP, and candidate details from bug reports.

## Failure cases

- Expired or incorrect credentials should fail closed at ICE rather than silently selecting a direct candidate while `iceTransportPolicy` is `relay`.
- A TURN URL without `transport=tcp`, a non-TURN URL, or an invalid port must be rejected by the settings validator.
- Discord's no-argument audio loopback `RTCPeerConnection` must remain untouched.
- A later targeted `setConfiguration()` must retain the configured relay and relay-only policy.
