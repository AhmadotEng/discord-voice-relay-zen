# Validation results

Date: 2026-09-19

Platform: macOS 15.6.1 on Apple silicon

Zen: 1.22.2b / Firefox 156

Candidate: Discord Direct for Zen 0.2.4

## Completed automated checks

- 111/111 dependency-free Node tests passed.
- The suite is self-contained in this repository and does not read sibling work directories.
- Manifest permission and host boundaries passed.
- TURN codec, authentication, mapping-consensus, address-policy, lifecycle, migration, resource-limit, race, and fail-closed tests passed.
- Firefox 156's packaged-script loader requirement is covered by a regression test.
- The release XPI passed ZIP integrity and source/runtime-file comparison checks.
- Release XPI SHA-256: `3692a61e7d6e7caac98d5e698cf4f67d67b6e8b66cd2b326e4f4bc598d314c71`.

## Completed live checks

- The official notarized Zen 1.22.2b build loaded the privileged temporary extension.
- The backend reached Ready with two agreeing STUN mapping observations.
- A freshly loaded Discord Web page reported its hook ready.
- A new call selected the current local relay over UDP.
- The popup reached **Protected route verified**, requiring a matching backend generation/revision, a live allocation, and upstream/downstream packet evidence.
- Discord reported **Voice Connected** with measured latency between 110 and 165 ms during observation.
- The user confirmed that incoming voice audio from the other participant was audible.
- Automatic Zen updates were re-enabled after the browser upgrade.

## Still to validate

- Have the remote participant explicitly confirm microphone audio.
- Exercise mute/unmute, participant and channel changes, allocation refresh, and a call lasting at least ten minutes.
- Confirm fail-closed behavior by stopping the backend during a live call.
- Repeat on additional NAT types and on Windows/Linux.

The completed evidence validates this specific macOS, Zen, and network combination. It does not establish universal NAT or provider compatibility.
