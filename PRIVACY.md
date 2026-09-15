# Privacy disclosure

Discord Voice Relay for Zen has no developer-operated service, analytics, advertising, or telemetry. It does not read Discord tokens, text messages, guilds, contacts, or decoded call audio.

When you explicitly enable the relay, the extension supplies the TURN URL, username, and credential you entered to `discord.com`'s WebRTC context. The browser then transmits that authentication information to your chosen TURN server and routes encrypted Discord call traffic through that server. This is why the Firefox manifest declares required transmission of **authentication information** and **personal communications**.

## Where data goes

- TURN settings are kept in Zen's local extension storage until you change them or remove the extension.
- While enabled, page scripts on `https://discord.com` can technically inspect the TURN client credential through the page's WebRTC configuration. The extension therefore expects a short-lived client credential or a dedicated, tightly limited Coturn account—never a provider API token or shared credential-minting secret.
- The chosen TURN operator can observe network metadata such as your IP address, Discord's media endpoint, timing, and traffic volume. Discord/WebRTC media remains encrypted in transit, but you should use a relay operator you trust.
- When the toggle is off, the bridge does not send the stored username or credential into the page. An already-open relayed peer connection can retain its earlier WebRTC configuration until you disconnect or reload Discord.

## Your controls

Disable the toggle and reconnect Discord voice to stop using the relay. Clear the saved fields to remove the credential from extension storage, or remove the extension from Zen to delete its local storage. Temporary installations are also removed when Zen exits.

The popup's status is a convenience diagnostic, not a security boundary: code running on the Discord page shares the main-world WebRTC context. For an independent check, inspect the selected candidate in `about:webrtc` and look for candidate type `relay` and relay protocol `tls` or `tcp`.
