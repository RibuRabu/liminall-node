const i18n = {
  fi: {
    pageTitle: "Node",
    nodeActivated: "Tunniste aktiivinen",
    defaultMessage: "Tämä tunniste on yhdistetty pysyvään digitaaliseen identiteettiobjektiin.",

    statusActive: "AKTIIVINEN",
    statusLost: "KADONNUT",
    statusUnknown: "TILA TUNTEMATON",

    primaryCall: "Soita omistajalle",
    primarySms: "Lähetä tekstiviesti",
    primaryWhatsapp: "Lähetä WhatsApp",
    primaryEmail: "Lähetä sähköposti",
    primaryFallback: "Ota yhteyttä omistajaan",

    call: "Soita",
    sms: "SMS",
    whatsapp: "WhatsApp",
    email: "Sähköposti",
    otherContactOptions: "Muut yhteystavat",

    contactDisclaimer: "Puhelut ja tekstiviestit avautuvat omalla puhelimella ja oman operaattorin palveluilla.",

    openMap: "Näytä sijainti kartalla →",

    reportTitle: "Ota yhteyttä omistajaan",
    reportSubtitleEnabled: "Lähetä viesti omistajalle julkisen sivun kautta.",
    reportSubtitleDisabled: "",

    finderName: "Nimesi",
    finderContact: "Yhteystietosi",
    reportMessage: "Viesti",
    reportLocation: "Sijainti",
    sendMessage: "Lähetä viesti",

    missingSlug: "Slug puuttuu URL-osoitteesta.",
    reportSent: "Viesti lähetetty.",
    reportFailed: "Lähetys epäonnistui.",
    reportError: "Virhe lähetyksessä.",
    nodeNotFound: "Nodea ei löytynyt.",
    loadFailed: "Lataus epäonnistui."
  },
  en: {
    pageTitle: "Node",
    nodeActivated: "Tag active",
    defaultMessage: "This tag is linked to a persistent digital identity object.",

    statusActive: "ACTIVE",
    statusLost: "LOST",
    statusUnknown: "STATUS UNKNOWN",

    primaryCall: "Call owner",
    primarySms: "Send SMS",
    primaryWhatsapp: "Message on WhatsApp",
    primaryEmail: "Send email",
    primaryFallback: "Contact owner",

    call: "Call",
    sms: "SMS",
    whatsapp: "WhatsApp",
    email: "Email",
    otherContactOptions: "Other contact options",

    contactDisclaimer: "Calls and text messages open through your own phone and mobile operator.",

    openMap: "Show location on map →",

    reportTitle: "Scanner messages",
    reportSubtitleEnabled: "Send a message to the owner through the public page.",
    reportSubtitleDisabled: "",

    finderName: "Your name",
    finderContact: "Your contact",
    reportMessage: "Message",
    reportLocation: "Location",
    sendMessage: "Send message",

    missingSlug: "Missing slug in URL.",
    reportSent: "Message sent.",
    reportFailed: "Send failed.",
    reportError: "Error sending message.",
    nodeNotFound: "Node not found.",
    loadFailed: "Load failed."
  }
};

let currentLang = "fi";
let currentNode = null;

const els = {
  langFi: document.getElementById("lang-fi"),
  langEn: document.getElementById("lang-en"),

  nodeActivation: document.getElementById("node-activation"),
  nodeName: document.getElementById("node-name"),
  nodeId: document.getElementById("node-id"),
  nodeMessage: document.getElementById("node-message"),

  nodeStatusWrap: document.getElementById("node-status-wrap"),
  nodeStatusBadge: document.getElementById("node-status-badge"),

  nodeImageSection: document.getElementById("node-image-section"),
  nodeImage: document.getElementById("node-image"),

  primaryActionSection: document.getElementById("node-primary-action-section"),
  primaryAction: document.getElementById("primary-action"),
  primaryActionIcon: document.getElementById("primary-action-icon"),
  primaryActionLabel: document.getElementById("primary-action-label"),

  secondaryActionsSection: document.getElementById("node-secondary-actions-section"),
  secondaryActionsTitle: document.getElementById("secondary-actions-title"),
  contactDisclaimer: document.getElementById("contact-disclaimer"),

  actionPhone: document.getElementById("action-phone"),
  actionSms: document.getElementById("action-sms"),
  actionWhatsapp: document.getElementById("action-whatsapp"),
  actionEmail: document.getElementById("action-email"),

  actionPhoneLabel: document.getElementById("action-phone-label"),
  actionSmsLabel: document.getElementById("action-sms-label"),
  actionWhatsappLabel: document.getElementById("action-whatsapp-label"),
  actionEmailLabel: document.getElementById("action-email-label"),

  nodeLocationSection: document.getElementById("node-location-section"),
  mapLink: document.getElementById("map-link"),

  reportSection: document.getElementById("report-section"),
  reportTitle: document.getElementById("report-title"),
  reportSubtitle: document.getElementById("report-subtitle"),

  labelFinderName: document.getElementById("label-finder-name"),
  labelFinderContact: document.getElementById("label-finder-contact"),
  labelReportMessage: document.getElementById("label-report-message"),
  labelReportLocation: document.getElementById("label-report-location"),

  finderName: document.getElementById("finder-name"),
  finderContact: document.getElementById("finder-contact"),
  reportMessage: document.getElementById("report-message"),
  reportLocation: document.getElementById("report-location"),
  reportSubmit: document.getElementById("report-submit"),
  reportForm: document.getElementById("report-form"),
  reportFeedback: document.getElementById("report-feedback")
};

function t(key) {
  return i18n[currentLang][key] || "";
}

function getSlug() {
  const url = new URL(window.location.href);
  const querySlug = (url.searchParams.get("slug") || "").trim();

  if (querySlug) {
    return querySlug;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && parts[0] === "n") {
    return decodeURIComponent(parts[1]);
  }

  return "";
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "fi";

  els.langFi.classList.toggle("active", currentLang === "fi");
  els.langEn.classList.toggle("active", currentLang === "en");

  els.nodeActivation.textContent = t("nodeActivated");
  els.actionPhoneLabel.textContent = t("call");
  els.actionSmsLabel.textContent = t("sms");
  els.actionWhatsappLabel.textContent = t("whatsapp");
  els.actionEmailLabel.textContent = t("email");
  els.secondaryActionsTitle.textContent = t("otherContactOptions");
  els.contactDisclaimer.textContent = t("contactDisclaimer");
  els.mapLink.textContent = t("openMap");
  els.reportTitle.textContent = t("reportTitle");
  els.labelFinderName.textContent = t("finderName");
  els.labelFinderContact.textContent = t("finderContact");
  els.labelReportMessage.textContent = t("reportMessage");
  els.labelReportLocation.textContent = t("reportLocation");
  els.reportSubmit.textContent = t("sendMessage");

  if (currentNode) {
    renderNode(currentNode);
  }
}

function setActionEnabled(el, href) {
  el.href = href;
  el.classList.remove("action-disabled");
  el.setAttribute("aria-disabled", "false");
}

function setActionDisabled(el) {
  el.href = "javascript:void(0)";
  el.classList.add("action-disabled");
  el.setAttribute("aria-disabled", "true");
}

function setActionVisible(el, isVisible) {
  el.style.display = isVisible ? "flex" : "none";
}

function isTruthy(value) {
  return value === 1 || value === true || value === "1";
}

function getTrimmedString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePhoneLike(value) {
  return getTrimmedString(value).replace(/[^\d+]/g, "");
}

function normalizeWhatsapp(value) {
  return normalizePhoneLike(value).replace(/^\+/, "");
}

function getPublicLocationLabel(node) {
  const lastRecoveryLabel = getTrimmedString(node.last_recovery_label);
  if (lastRecoveryLabel) return lastRecoveryLabel;

  const locationLabel = getTrimmedString(node.location_label);
  if (locationLabel) return locationLabel;

  const locationAddress = getTrimmedString(node.location_address);
  if (locationAddress) return locationAddress;

  return "";
}

function shouldShowPublicLocation(node) {
  if (Object.prototype.hasOwnProperty.call(node, "show_last_recovery_point")) {
    return isTruthy(node.show_last_recovery_point);
  }

  if (Object.prototype.hasOwnProperty.call(node, "show_location")) {
    return isTruthy(node.show_location);
  }

  return !!getPublicLocationLabel(node);
}

function buildMapHref(node) {
  const locationLabel = getPublicLocationLabel(node);
  if (!locationLabel) return "";
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(locationLabel);
}

function renderStatus(node) {
  const status = getTrimmedString(node.status).toLowerCase();

  if (!status) {
    els.nodeStatusWrap.style.display = "none";
    els.nodeStatusBadge.textContent = "";
    els.nodeStatusBadge.className = "node-status-badge";
    return;
  }

  els.nodeStatusWrap.style.display = "block";

  if (status === "active") {
    els.nodeStatusBadge.textContent = t("statusActive");
    els.nodeStatusBadge.className = "node-status-badge status-active";
    return;
  }

  if (status === "lost") {
    els.nodeStatusBadge.textContent = t("statusLost");
    els.nodeStatusBadge.className = "node-status-badge status-lost";
    return;
  }

  els.nodeStatusBadge.textContent = t("statusUnknown");
  els.nodeStatusBadge.className = "node-status-badge status-unknown";
}

function buildActions(node) {
  const rawPhone = getTrimmedString(node.contact_phone);
  const rawSms = getTrimmedString(node.contact_sms);
  const rawWhatsapp = getTrimmedString(node.contact_whatsapp);
  const rawEmail = getTrimmedString(node.contact_email);

  const normalizedPhone = normalizePhoneLike(rawPhone);
  const normalizedSms = normalizePhoneLike(rawSms);
  const normalizedWhatsapp = normalizeWhatsapp(rawWhatsapp);

  const actions = [];

  if (rawPhone && normalizedPhone) {
    actions.push({
      key: "phone",
      href: "tel:" + normalizedPhone,
      label: t("primaryCall"),
      icon: "📞"
    });
  }

  if (rawSms && normalizedSms) {
    actions.push({
      key: "sms",
      href: "sms:" + normalizedSms,
      label: t("primarySms"),
      icon: "✉"
    });
  }

  if (rawWhatsapp && normalizedWhatsapp) {
    actions.push({
      key: "whatsapp",
      href: "https://wa.me/" + normalizedWhatsapp,
      label: t("primaryWhatsapp"),
      icon: "💬"
    });
  }

  if (rawEmail) {
    actions.push({
      key: "email",
      href: "mailto:" + rawEmail,
      label: t("primaryEmail"),
      icon: "✉"
    });
  }

  return actions;
}

function getOrderedActions(node) {
  const actions = buildActions(node);
  const preferred = getTrimmedString(node.preferred_contact).toLowerCase();

  if (!preferred || preferred === "none") {
    return actions;
  }

  const preferredAction = actions.find((action) => action.key === preferred);
  if (!preferredAction) {
    return actions;
  }

  const remainingActions = actions.filter((action) => action.key !== preferred);
  return [preferredAction, ...remainingActions];
}

function resetSecondaryActions() {
  setActionVisible(els.actionPhone, false);
  setActionVisible(els.actionSms, false);
  setActionVisible(els.actionWhatsapp, false);
  setActionVisible(els.actionEmail, false);

  setActionDisabled(els.actionPhone);
  setActionDisabled(els.actionSms);
  setActionDisabled(els.actionWhatsapp);
  setActionDisabled(els.actionEmail);
}

function hideContactActions() {
  els.primaryActionSection.style.display = "none";
  els.secondaryActionsSection.style.display = "none";
  els.contactDisclaimer.style.display = "none";
  setActionDisabled(els.primaryAction);
  resetSecondaryActions();
}

function resetPublicPageState() {
  hideContactActions();
  els.reportSection.style.display = "none";
  els.reportForm.style.display = "none";
  els.reportSubtitle.textContent = "";
  els.reportFeedback.textContent = "";
}

function showPrimaryActionSection() {
  els.primaryActionSection.style.display = "block";
}

function renderPrimaryAndSecondaryActions(node) {
  const actions = getOrderedActions(node);

  resetSecondaryActions();

  els.contactDisclaimer.style.display = "none";
  els.contactDisclaimer.textContent = t("contactDisclaimer");

  if (actions.length === 0) {
    hideContactActions();
    return;
  }

  showPrimaryActionSection();

  const primary = actions[0];
  const secondary = actions.slice(1);

  els.primaryActionLabel.textContent = primary.label;
  els.primaryActionIcon.textContent = primary.icon;
  setActionEnabled(els.primaryAction, primary.href);

  const phoneAction = secondary.find((action) => action.key === "phone");
  const smsAction = secondary.find((action) => action.key === "sms");
  const whatsappAction = secondary.find((action) => action.key === "whatsapp");
  const emailAction = secondary.find((action) => action.key === "email");

  if (phoneAction) {
    setActionVisible(els.actionPhone, true);
    setActionEnabled(els.actionPhone, phoneAction.href);
  }

  if (smsAction) {
    setActionVisible(els.actionSms, true);
    setActionEnabled(els.actionSms, smsAction.href);
  }

  if (whatsappAction) {
    setActionVisible(els.actionWhatsapp, true);
    setActionEnabled(els.actionWhatsapp, whatsappAction.href);
  }

  if (emailAction) {
    setActionVisible(els.actionEmail, true);
    setActionEnabled(els.actionEmail, emailAction.href);
  }

  const hasSecondary = secondary.length > 0;
  const hasCallOrSms = actions.some((action) => action.key === "phone" || action.key === "sms");

  els.secondaryActionsSection.style.display = hasSecondary ? "block" : "none";

  if (hasCallOrSms) {
    els.contactDisclaimer.style.display = "block";

    if (!hasSecondary) {
      els.secondaryActionsSection.style.display = "block";
    }
  }
}

function renderReportSection(node) {
  const allowAnonymousReport = isTruthy(node.allow_anonymous_report);

  if (!allowAnonymousReport) {
    els.reportSection.style.display = "none";
    els.reportForm.style.display = "none";
    els.reportSubtitle.textContent = "";
    els.reportFeedback.textContent = "";
    return;
  }

  els.reportSection.style.display = "block";
  els.reportTitle.textContent = t("reportTitle");
  els.reportSubtitle.textContent = t("reportSubtitleEnabled");
  els.reportForm.style.display = "block";
  els.reportFeedback.textContent = "";
}

function renderNode(node) {
  currentNode = node;

  els.nodeName.textContent = getTrimmedString(node.name || t("pageTitle"));
  els.nodeId.textContent = getTrimmedString(node.identifier || "ID#");
  els.nodeMessage.textContent = getTrimmedString(node.message || t("defaultMessage"));

  renderStatus(node);

  const imageUrl = getTrimmedString(node.image_url);

  if (imageUrl) {
    const imageAlt = node.name || "Node image";
    els.nodeImage.src = imageUrl;
    els.nodeImage.alt = imageAlt;
    els.nodeImageSection.style.display = "block";
  } else {
    els.nodeImage.src = "";
    els.nodeImage.alt = "";
    els.nodeImageSection.style.display = "none";
  }

  renderPrimaryAndSecondaryActions(node);
  renderReportSection(node);

  const showLocation = shouldShowPublicLocation(node);
  const mapHref = buildMapHref(node);

  if (showLocation && mapHref) {
    els.mapLink.href = mapHref;
    els.mapLink.style.display = "inline-block";
    els.nodeLocationSection.style.display = "block";
  } else {
    els.mapLink.href = "#";
    els.mapLink.style.display = "none";
    els.nodeLocationSection.style.display = "none";
  }
}

async function loadNode() {
  const slug = getSlug();
  resetPublicPageState();

  if (!slug) {
    return;
  }

  try {
    const res = await fetch("/api/public/" + encodeURIComponent(slug), {
      headers: { Accept: "application/json" }
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    renderNode(data);
  } catch (error) {
    console.error(error);
  }
}

els.reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const slug = getSlug();
  if (!slug) {
    els.reportFeedback.textContent = t("missingSlug");
    return;
  }

  if (!currentNode || !isTruthy(currentNode.allow_anonymous_report)) {
    els.reportFeedback.textContent = t("reportFailed");
    return;
  }

  const payload = {
    name: els.finderName.value.trim(),
    contact: els.finderContact.value.trim(),
    message: els.reportMessage.value.trim(),
    location: els.reportLocation.value.trim()
  };

  try {
    const res = await fetch("/api/report/" + encodeURIComponent(slug), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      els.reportFeedback.textContent = t("reportSent");
      els.reportForm.reset();
    } else {
      els.reportFeedback.textContent = t("reportFailed");
    }
  } catch (error) {
    console.error(error);
    els.reportFeedback.textContent = t("reportError");
  }
});

els.langFi.addEventListener("click", () => setLanguage("fi"));
els.langEn.addEventListener("click", () => setLanguage("en"));

setLanguage("fi");
loadNode();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("node-activation-ready");
  }, 120);
});
