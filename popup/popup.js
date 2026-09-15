(function runPopup() {
  "use strict";

  const tools = globalThis.__discordVoiceRelayTools;
  const elements = {
    form: document.querySelector("#settings-form"),
    enabled: document.querySelector("#enabled"),
    turnUrls: document.querySelector("#turn-urls"),
    turnUsername: document.querySelector("#turn-username"),
    turnCredential: document.querySelector("#turn-credential"),
    tcpOnly: document.querySelector("#tcp-only"),
    validation: document.querySelector("#validation"),
    save: document.querySelector("#save"),
    statusDot: document.querySelector("#status-dot"),
    statusTitle: document.querySelector("#status-title"),
    statusDetail: document.querySelector("#status-detail")
  };

  function formSettings() {
    return {
      enabled: elements.enabled.checked,
      turnUrls: elements.turnUrls.value,
      turnUsername: elements.turnUsername.value.trim(),
      turnCredential: elements.turnCredential.value,
      tcpOnly: elements.tcpOnly.checked
    };
  }

  function showValidation(errors) {
    elements.validation.hidden = errors.length === 0;
    elements.validation.textContent = errors.join(" ");
  }

  function setStatus(kind, title, detail) {
    elements.statusDot.className = `dot ${kind}`;
    elements.statusTitle.textContent = title;
    elements.statusDetail.textContent = detail;
  }

  function describeStatus(status, enabled) {
    if (!enabled) {
      setStatus("idle", "Relay is off", "Enable it, save, then reconnect Discord voice.");
      return;
    }
    if (!status) {
      setStatus("warn", "No Discord page detected", "Open or reload discord.com/app in this tab.");
      return;
    }
    if (status.error) {
      setStatus("bad", "Relay needs attention", status.error);
      return;
    }
    if (status.connectionState === "failed" || status.iceConnectionState === "failed") {
      setStatus("bad", "Relay connection failed", "Check the TURN address and credential, then reconnect voice.");
      return;
    }
    if (status.connectionState === "closed" || status.iceConnectionState === "closed") {
      setStatus("idle", "Voice connection closed", "Join or reconnect Discord voice to use the relay.");
      return;
    }
    if (status.connectionState === "disconnected" || status.iceConnectionState === "disconnected") {
      setStatus("warn", "Relay connection interrupted", "Wait briefly, or reconnect Discord voice if it does not recover.");
      return;
    }
    const connected = status.connectionState === "connected" ||
      status.iceConnectionState === "connected" || status.iceConnectionState === "completed";
    if (connected && status.selectedCandidate && status.selectedCandidate.type === "relay") {
      const transport = status.selectedCandidate.relayProtocol ||
        status.selectedCandidate.protocol || "relay";
      setStatus("good", "Voice is using the relay", `Selected relay candidate over ${transport.toUpperCase()}.`);
      return;
    }
    if (status.applied) {
      setStatus("warn", "Relay enforced—not connected yet", `Waiting for ICE; ${status.relayCount} TURN URL(s) active.`);
      return;
    }
    if (status.phase === "ready" || status.phase === "configured") {
      setStatus("warn", "Ready for a new voice connection", "Disconnect/reconnect the call so Discord creates a relayed connection.");
      return;
    }
    setStatus("warn", "Waiting for Discord voice", `Hook state: ${status.phase || "unknown"}.`);
  }

  async function activeDiscordStatus() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab || !/^https:\/\/discord\.com\//iu.test(tab.url || "")) {
      return null;
    }
    try {
      return await browser.tabs.sendMessage(tab.id, { type: "get-live-status" });
    } catch (_error) {
      return null;
    }
  }

  async function load() {
    const settings = await browser.storage.local.get(tools.DEFAULT_SETTINGS);
    elements.enabled.checked = Boolean(settings.enabled);
    elements.turnUrls.value = settings.turnUrls;
    elements.turnUsername.value = settings.turnUsername;
    elements.turnCredential.value = settings.turnCredential;
    elements.tcpOnly.checked = Boolean(settings.tcpOnly);
    const status = await activeDiscordStatus();
    describeStatus(status, elements.enabled.checked);
  }

  elements.enabled.addEventListener("change", () => {
    const validation = tools.validateSettings(formSettings());
    showValidation(validation.errors);
    if (!elements.enabled.checked) {
      setStatus("idle", "Relay is off", "Save to stop changing new Discord voice connections.");
    }
  });

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validation = tools.validateSettings(formSettings());
    showValidation(validation.errors);
    if (validation.errors.length > 0) {
      return;
    }

    elements.save.disabled = true;
    elements.save.textContent = "Saving…";
    try {
      await browser.storage.local.set(validation.settings);
      setStatus(
        validation.settings.enabled ? "warn" : "idle",
        validation.settings.enabled ? "Saved—reconnect voice" : "Relay is off",
        validation.settings.enabled
          ? "Leave and rejoin the call, then verify that this panel says Voice is using the relay."
          : "New Discord voice connections will use their normal route."
      );
      elements.save.textContent = "Saved";
      setTimeout(() => { elements.save.textContent = "Save and reconnect voice"; }, 900);
    } finally {
      elements.save.disabled = false;
    }
  });

  load().catch((error) => {
    setStatus("bad", "Extension error", String(error && error.message || error));
  });
})();
