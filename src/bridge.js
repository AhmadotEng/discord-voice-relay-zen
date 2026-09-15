(function connectExtensionBridge() {
  "use strict";

  const CHANNEL = "discord-voice-relay-zen:v1";
  const DEFAULT_SETTINGS = {
    enabled: false,
    turnUrls: "",
    turnUsername: "",
    turnCredential: "",
    tcpOnly: true
  };

  let lastStatus = {
    phase: "waiting-for-page-hook",
    targetedConnections: 0,
    applied: false,
    relayCount: 0,
    error: null
  };

  function sendToPage(type, payload = {}) {
    window.postMessage({
      channel: CHANNEL,
      direction: "extension-to-page",
      type,
      ...payload
    }, window.location.origin);
  }

  async function sendSettings() {
    const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
    sendToPage("config", {
      settings: settings.enabled ? settings : {
        ...settings,
        turnUsername: "",
        turnCredential: ""
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin ||
        !event.data || event.data.channel !== CHANNEL ||
        event.data.direction !== "page-to-extension" || event.data.type !== "status") {
      return;
    }
    lastStatus = event.data.status;
  });

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      sendSettings().catch(() => {});
    }
  });

  browser.runtime.onMessage.addListener((message) => {
    if (!message || message.type !== "get-live-status") {
      return undefined;
    }
    sendToPage("get-status");
    return Promise.resolve(lastStatus);
  });

  sendSettings().catch((error) => {
    lastStatus = {
      ...lastStatus,
      phase: "bridge-error",
      error: String(error && error.message || error)
    };
  });
})();
