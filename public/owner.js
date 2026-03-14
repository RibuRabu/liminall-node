const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const i18n = {
  fi: {
    page_title: "Node-hallinta",
    page_subtitle: "Hallitse tunnisteen näkyvyyttä, yhteystapoja ja tapahtumahistoriaa.",
    node_card_title: "Node-linkki",
    controls_card_title: "Tunnisteen asetukset",
    controls_card_intro: "Hallinta ja julkisen sivun tiedot.",
    timeline_title: "Tapahtumahistoria",

    identity_section_title: "Tunniste",
    profile_name_label: "Tunnisteen otsikko",
    public_message_label: "Julkinen viesti",
    save_identity: "Tallenna tunniste",

    status_section_title: "Tila",

    contact_section_title: "Yhteystavat",
    contact_section_intro: "Määritä mitä yhteystapoja käytetään, mitkä niistä lisätään Node-sivulle ja mikä niistä on ensisijainen.",
    phone_label: "Puhelin",
    sms_label: "SMS",
    whatsapp_label: "WhatsApp",
    email_label: "Sähköposti",
    show_phone_label: "Lisää Node-sivulle",
    show_sms_label: "Lisää Node-sivulle",
    show_whatsapp_label: "Lisää Node-sivulle",
    show_email_label: "Lisää Node-sivulle",
    preferred_contact_label: "Ensisijainen yhteystapa",
    preferred_contact_hint: "Ensisijainen tapa näkyy julkisella sivulla päätoimintona, jos se on käytettävissä.",
    preferred_contact_phone: "Puhelu",
    preferred_contact_sms: "SMS",
    preferred_contact_whatsapp: "WhatsApp",
    preferred_contact_email: "Sähköposti",
    preferred_contact_none: "Automaattinen",
    preferred_contact_hidden_hint: "Ensisijainen yhteystapa tulee näkyviin vasta kun vähintään yksi yhteystieto on lisätty.",
    save_contact_settings: "Tallenna yhteystavat",

    location_section_title: "Sijainti",
    location_section_intro: "Syötä sijainti tekstinä. Tämä voi olla osoite, paikan nimi tai viimeisin tunnettu sijainti.",
    location_label: "Sijainti / osoite / paikan nimi",
    location_hint: "Esimerkki: Helsinki, Tammisto, Rautatieasema tai Aleksanterinkatu 12, Helsinki",
    show_location_label: "Lisää Node-sivulle",
    save_location: "Tallenna sijainti",

    scanner_messages_section_title: "Lähetä viesti omistajalle",
    scanner_messages_intro: "Salli tai estä viestilomake henkilölle, joka avaa tämän Noden julkisen sivun skannaamalla tunnisteen.",
    enable_reports: "Salli viestilomake skannaajalle",
    disable_reports: "Estä viestilomake skannaajalta",

    carrier_section_title: "Pyyntö tunnisteen vaihtoon",
    carrier_reason_label: "Syy",
    carrier_notes_label: "Lisähuomiot",

    node_image_input_label: "Valitse kuva",
    node_image_hint: "Sallitut muodot: PNG, JPG, WEBP tai GIF. Maksimikoko 5 MB.",
    node_image_empty_title: "Ei kuvaa",
    node_image_empty_text: "Tähän näkyy nykyinen Node-kuva.",
    save_node_image: "Tallenna kuva",
    clear_node_image_selection: "Tyhjennä valinta",
    remove_node_image: "Poista kuva",
    image_selected_ready: "Kuva valittu. Voit nyt tallentaa sen.",
    image_selection_cleared: "Kuvavalinta tyhjennetty.",
    image_upload_success: "Node-kuva tallennettu.",
    image_delete_success: "Node-kuva poistettu.",
    image_delete_failed: "Node-kuvan poisto epäonnistui",
    image_upload_failed: "Node-kuvan tallennus epäonnistui",
    image_missing_selection: "Valitse kuva ennen tallennusta.",
    image_invalid_type: "Tiedostotyyppi ei ole sallittu. Käytä PNG-, JPG-, WEBP- tai GIF-kuvaa.",
    image_too_large: "Kuva on liian suuri. Maksimikoko on 5 MB.",
    image_remove_confirm: "Poistetaanko nykyinen Node-kuva?",
    image_uploading: "Tallennetaan kuvaa…",
    image_deleting: "Poistetaan kuvaa…",

    set_active: "Aseta aktiiviseksi",
    set_lost: "Aseta kadonneeksi",
    replace_carrier: "Lähetä pyyntö",
    open_public_page: "Avaa Node",

    status: "Tila",
    slug: "Slug",
    finder_messages_status: "Skannaajan viestit",
    finder_messages_enabled: "Sallittu",
    finder_messages_disabled: "Estetty",
    preferred_contact_status: "Ensisijainen yhteystapa",
    location_status: "Sijainti",
    location_visible: "Näkyy julkisesti",
    location_hidden: "Ei näy julkisesti",
    location_empty: "Ei asetettu",
    identifier: "Tunniste",
    dashboard_status: "Yleistila",

    empty_timeline: "Ei tapahtumia vielä.",
    missing_token: "Owner-token puuttuu",
    pin_prompt: "Syötä PIN",
    pin_required: "PIN vaaditaan.",
    pin_verify_failed: "PIN-vahvistus epäonnistui",
    session_check_failed: "Istunnon tarkistus epäonnistui",
    load_owner_failed: "Node-datan lataus epäonnistui",
    load_timeline_failed: "Tapahtumahistorian lataus epäonnistui",
    save_success: "Tallennus onnistui.",
    carrier_success: "Pyyntö kirjattu.",
    update_failed: "Päivitys epäonnistui",
    carrier_failed: "Pyynnön kirjaus epäonnistui",
    timeline_payload_prefix: "Payload",

    event_NODE_CREATED: "Node luotu",
    event_PROFILE_UPDATED: "Profiilia päivitetty",
    event_STATUS_CHANGED: "Tila muuttunut",
    event_VISIBILITY_UPDATED: "Näkyvyysasetuksia päivitetty",
    event_RECOVERY_LOCATION_UPDATED: "Sijaintia päivitetty",
    event_ANONYMOUS_REPORT_CREATED: "Skannaajan viesti vastaanotettu",
    event_CARRIER_REPLACED: "Tunniste vaihdettu",
    event_OWNER_TOKEN_REISSUED: "Omistajan linkki uusittu",

    confirm_set_active: "Asetetaanko Node aktiiviseksi?",
    confirm_set_lost: "Asetetaanko Node kadonneeksi?",
    confirm_enable_reports: "Sallitaanko viestilomake skannaajalle?",
    confirm_disable_reports: "Estetäänkö viestilomake skannaajalta?",
    confirm_replace_carrier: "Kirjataanko pyyntö tunnisteen vaihtoon Node-historiaan?"
  },
  en: {
    page_title: "Node management",
    page_subtitle: "Manage visibility, contact methods, and event history.",
    node_card_title: "Node link",
    controls_card_title: "Tag settings",
    controls_card_intro: "Management and public page details.",
    timeline_title: "Timeline",

    identity_section_title: "Tag",
    profile_name_label: "Tag title",
    public_message_label: "Public message",
    save_identity: "Save tag",

    status_section_title: "Status",

    contact_section_title: "Contact methods",
    contact_section_intro: "Define which contact methods are used, which ones are added to the Node page, and which one is primary.",
    phone_label: "Phone",
    sms_label: "SMS",
    whatsapp_label: "WhatsApp",
    email_label: "Email",
    show_phone_label: "Add to Node page",
    show_sms_label: "Add to Node page",
    show_whatsapp_label: "Add to Node page",
    show_email_label: "Add to Node page",
    preferred_contact_label: "Primary contact method",
    preferred_contact_hint: "The primary method becomes the main action on the public page when available.",
    preferred_contact_phone: "Phone call",
    preferred_contact_sms: "SMS",
    preferred_contact_whatsapp: "WhatsApp",
    preferred_contact_email: "Email",
    preferred_contact_none: "Automatic",
    preferred_contact_hidden_hint: "Primary contact appears after at least one contact method has been added.",
    save_contact_settings: "Save contact methods",

    location_section_title: "Location",
    location_section_intro: "Enter location as text. This can be an address, place name, or last known location.",
    location_label: "Location / address / place name",
    location_hint: "Example: Helsinki, Tammisto, Railway Station, or Aleksanterinkatu 12, Helsinki",
    show_location_label: "Add to Node page",
    save_location: "Save location",

    scanner_messages_section_title: "Send message to owner",
    scanner_messages_intro: "Allow or block the message form for a person who opens this Node’s public page by scanning the tag.",
    enable_reports: "Allow scanner message form",
    disable_reports: "Block scanner message form",

    carrier_section_title: "Request tag replacement",
    carrier_reason_label: "Reason",
    carrier_notes_label: "Notes",

    node_image_input_label: "Choose image",
    node_image_hint: "Allowed formats: PNG, JPG, WEBP, or GIF. Maximum size 5 MB.",
    node_image_empty_title: "No image",
    node_image_empty_text: "The current Node image appears here.",
    save_node_image: "Save image",
    clear_node_image_selection: "Clear selection",
    remove_node_image: "Remove image",
    image_selected_ready: "Image selected. You can now save it.",
    image_selection_cleared: "Image selection cleared.",
    image_upload_success: "Node image saved.",
    image_delete_success: "Node image removed.",
    image_delete_failed: "Failed to remove Node image",
    image_upload_failed: "Failed to save Node image",
    image_missing_selection: "Choose an image before saving.",
    image_invalid_type: "File type is not allowed. Use PNG, JPG, WEBP, or GIF.",
    image_too_large: "Image is too large. Maximum size is 5 MB.",
    image_remove_confirm: "Remove the current Node image?",
    image_uploading: "Uploading image…",
    image_deleting: "Removing image…",

    set_active: "Set active",
    set_lost: "Set lost",
    replace_carrier: "Submit request",
    open_public_page: "Open Node",

    status: "Status",
    slug: "Slug",
    finder_messages_status: "Scanner messages",
    finder_messages_enabled: "Enabled",
    finder_messages_disabled: "Blocked",
    preferred_contact_status: "Primary contact method",
    location_status: "Location",
    location_visible: "Visible on public page",
    location_hidden: "Hidden from public page",
    location_empty: "Not set",
    identifier: "Identifier",
    dashboard_status: "Overview",

    empty_timeline: "No events yet.",
    missing_token: "Missing owner token",
    pin_prompt: "Enter PIN",
    pin_required: "PIN required.",
    pin_verify_failed: "PIN verification failed",
    session_check_failed: "Session check failed",
    load_owner_failed: "Failed to load owner node",
    load_timeline_failed: "Failed to load timeline",
    save_success: "Saved successfully.",
    carrier_success: "Request recorded.",
    update_failed: "Update failed",
    carrier_failed: "Failed to record request",
    timeline_payload_prefix: "Payload",

    event_NODE_CREATED: "Node created",
    event_PROFILE_UPDATED: "Profile updated",
    event_STATUS_CHANGED: "Status changed",
    event_VISIBILITY_UPDATED: "Visibility updated",
    event_RECOVERY_LOCATION_UPDATED: "Location updated",
    event_ANONYMOUS_REPORT_CREATED: "Scanner message received",
    event_CARRIER_REPLACED: "Carrier replaced",
    event_OWNER_TOKEN_REISSUED: "Owner link reissued",

    confirm_set_active: "Set this Node active?",
    confirm_set_lost: "Set this Node lost?",
    confirm_enable_reports: "Allow the scanner message form?",
    confirm_disable_reports: "Block the scanner message form?",
    confirm_replace_carrier: "Record a tag replacement request in Node history?"
  }
};

let currentLang = "fi";
let bootstrapToken = null;
let currentNode = null;
let currentEvents = [];
let selectedImageFile = null;
let selectedImagePreviewUrl = null;
let imageOperationInFlight = false;

function getBootstrapToken() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const parts = path.split("/");

  if (parts.length >= 3 && parts[1] === "o") {
    return parts[2];
  }

  return null;
}

function getLanguage() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");

  if (lang === "en") return "en";
  if (lang === "fi") return "fi";

  return "fi";
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "fi";

  const url = new URL(window.location.href);
  url.searchParams.set("lang", currentLang);
  window.history.replaceState({}, "", url.toString());

  renderStaticTexts();
  renderNode();
  renderTimeline();
  updateLanguageButtons();
  renderNodeImagePanel();
}

function updateLanguageButtons() {
  document.getElementById("langFi").classList.toggle("active", currentLang === "fi");
  document.getElementById("langEn").classList.toggle("active", currentLang === "en");
}

function t(key) {
  return i18n[currentLang][key] || key;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isTruthyDbValue(value) {
  return value === 1 || value === true || value === "1";
}

function formatStatus(status) {
  if (currentLang === "fi") {
    if (status === "active") return "aktiivinen";
    if (status === "lost") return "kadonnut";
  }

  return status || "";
}

function getTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getAvailableContactMethodsFromValues(values) {
  const methods = [];

  if (getTrimmedString(values.phone)) methods.push("phone");
  if (getTrimmedString(values.sms)) methods.push("sms");
  if (getTrimmedString(values.whatsapp)) methods.push("whatsapp");
  if (getTrimmedString(values.email)) methods.push("email");

  return methods;
}

function getAvailableContactMethodsFromInputs() {
  return getAvailableContactMethodsFromValues({
    phone: document.getElementById("phoneInput").value,
    sms: document.getElementById("smsInput").value,
    whatsapp: document.getElementById("whatsappInput").value,
    email: document.getElementById("emailInput").value
  });
}

function getPreferredContactFieldWrap() {
  const label = document.getElementById("preferredContactLabel");
  return label ? label.closest(".field") : null;
}

function syncPreferredContactUI() {
  const select = document.getElementById("preferredContact");
  const hint = document.getElementById("preferredContactHint");
  const wrap = getPreferredContactFieldWrap();

  if (!select || !hint || !wrap) {
    return;
  }

  const availableMethods = getAvailableContactMethodsFromInputs();
  const availableSet = new Set(availableMethods);

  for (const option of Array.from(select.options)) {
    const value = getTrimmedString(option.value).toLowerCase();

    if (value === "none") {
      option.hidden = true;
      option.disabled = true;
      continue;
    }

    const isAvailable = availableSet.has(value);
    option.hidden = !isAvailable;
    option.disabled = !isAvailable;
  }

  if (availableMethods.length === 0) {
    wrap.style.display = "none";
    hint.textContent = t("preferred_contact_hidden_hint");
    select.value = "none";
    return;
  }

  wrap.style.display = "";
  hint.textContent = t("preferred_contact_hint");

  const currentValue = getTrimmedString(select.value).toLowerCase();
  const currentIsAvailable = availableSet.has(currentValue);

  if (!currentIsAvailable) {
    select.value = availableMethods[0];
  }
}

function formatPreferredContact(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (normalized === "phone") return t("preferred_contact_phone");
  if (normalized === "sms") return t("preferred_contact_sms");
  if (normalized === "whatsapp") return t("preferred_contact_whatsapp");
  if (normalized === "email") return t("preferred_contact_email");

  return t("preferred_contact_none");
}

function translateEventType(type) {
  return t(`event_${type}`) || type;
}

function updatePublicPageButton() {
  const link = document.getElementById("openPublicPageButton");

  if (!currentNode || !currentNode.public_slug) {
    link.href = "#";
    link.classList.add("disabled");
    return;
  }

  link.href = `/n/${encodeURIComponent(currentNode.public_slug)}`;
  link.classList.remove("disabled");
  link.textContent = t("open_public_page");
}

function revokeSelectedImagePreviewUrl() {
  if (selectedImagePreviewUrl) {
    URL.revokeObjectURL(selectedImagePreviewUrl);
    selectedImagePreviewUrl = null;
  }
}

function getCurrentImageUrl() {
  if (!currentNode || typeof currentNode.profile_image_url !== "string") {
    return "";
  }

  return currentNode.profile_image_url.trim();
}

function clearSelectedImage() {
  selectedImageFile = null;
  revokeSelectedImagePreviewUrl();

  const input = document.getElementById("nodeImageInput");
  if (input) {
    input.value = "";
  }
}

function setImageButtonsDisabledState() {
  const saveButton = document.getElementById("saveNodeImageButton");
  const clearButton = document.getElementById("clearNodeImageSelectionButton");
  const removeButton = document.getElementById("removeNodeImageButton");

  const hasCurrentImage = getCurrentImageUrl() !== "";
  const hasSelectedImage = !!selectedImageFile;

  saveButton.disabled = imageOperationInFlight || !hasSelectedImage;
  clearButton.disabled = imageOperationInFlight || !hasSelectedImage;
  removeButton.disabled = imageOperationInFlight || !hasCurrentImage;
}

function renderNodeImagePanel() {
  const preview = document.getElementById("nodeImagePreview");
  const currentImageUrl = getCurrentImageUrl();
  const hasSelectedPreview = !!selectedImagePreviewUrl;
  const hasCurrentImage = currentImageUrl !== "";

  if (hasSelectedPreview) {
    preview.className = "node-image-preview has-image";
    preview.innerHTML = `
      <img src="${escapeHtml(selectedImagePreviewUrl)}" alt="${escapeHtml(t("node_card_title"))}" />
    `;
  } else if (hasCurrentImage) {
    preview.className = "node-image-preview has-image";
    preview.innerHTML = `
      <img src="${escapeHtml(currentImageUrl)}" alt="${escapeHtml(t("node_card_title"))}" />
    `;
  } else {
    preview.className = "node-image-preview empty";
    preview.innerHTML = `
      <div class="node-image-empty">
        <div class="node-image-empty-badge">${escapeHtml(t("node_image_empty_title"))}</div>
        <div class="node-image-empty-text">${escapeHtml(t("node_image_empty_text"))}</div>
      </div>
    `;
  }

  setImageButtonsDisabledState();
}

function renderStaticTexts() {
  document.documentElement.lang = currentLang;

  document.getElementById("pageTitle").textContent = t("page_title");
  document.getElementById("pageSubtitle").textContent = t("page_subtitle");
  document.getElementById("nodeCardTitle").textContent = t("node_card_title");
  document.getElementById("controlsCardTitle").textContent = t("controls_card_title");
  document.getElementById("controlsCardIntro").textContent = t("controls_card_intro");
  document.getElementById("timelineTitle").textContent = t("timeline_title");
  document.getElementById("openPublicPageButton").textContent = t("open_public_page");

  document.getElementById("identitySectionTitle").textContent = t("identity_section_title");
  document.getElementById("profileNameLabel").textContent = t("profile_name_label");
  document.getElementById("publicMessageLabel").textContent = t("public_message_label");
  document.getElementById("saveIdentityButton").textContent = t("save_identity");

  document.getElementById("statusSectionTitle").textContent = t("status_section_title");

  document.getElementById("contactSectionTitle").textContent = t("contact_section_title");
  document.getElementById("contactSectionIntro").textContent = t("contact_section_intro");
  document.getElementById("phoneLabel").textContent = t("phone_label");
  document.getElementById("smsLabel").textContent = t("sms_label");
  document.getElementById("whatsappLabel").textContent = t("whatsapp_label");
  document.getElementById("emailLabel").textContent = t("email_label");
  document.getElementById("showPhoneLabel").textContent = t("show_phone_label");
  document.getElementById("showSmsLabel").textContent = t("show_sms_label");
  document.getElementById("showWhatsappLabel").textContent = t("show_whatsapp_label");
  document.getElementById("showEmailLabel").textContent = t("show_email_label");
  document.getElementById("preferredContactLabel").textContent = t("preferred_contact_label");
  document.getElementById("preferredContactHint").textContent = t("preferred_contact_hint");

  document.getElementById("locationSectionTitle").textContent = t("location_section_title");
  document.getElementById("locationSectionIntro").textContent = t("location_section_intro");
  document.getElementById("locationLabel").textContent = t("location_label");
  document.getElementById("locationHint").textContent = t("location_hint");
  document.getElementById("showLocationLabel").textContent = t("show_location_label");
  document.getElementById("saveLocationButton").textContent = t("save_location");

  document.getElementById("scannerMessagesSectionTitle").textContent = t("scanner_messages_section_title");
  document.getElementById("scannerMessagesIntro").textContent = t("scanner_messages_intro");

  document.getElementById("carrierSectionTitle").textContent = t("carrier_section_title");
  document.getElementById("carrierReasonLabel").textContent = t("carrier_reason_label");
  document.getElementById("carrierNotesLabel").textContent = t("carrier_notes_label");

  document.getElementById("nodeImageInputLabel").textContent = t("node_image_input_label");
  document.getElementById("nodeImageHint").textContent = t("node_image_hint");
  document.getElementById("saveNodeImageButton").textContent = t("save_node_image");
  document.getElementById("clearNodeImageSelectionButton").textContent = t("clear_node_image_selection");
  document.getElementById("removeNodeImageButton").textContent = t("remove_node_image");

  document.getElementById("setActiveButton").textContent = t("set_active");
  document.getElementById("setLostButton").textContent = t("set_lost");
  document.getElementById("replaceCarrierButton").textContent = t("replace_carrier");
  document.getElementById("saveContactSettingsButton").textContent = t("save_contact_settings");

  document.getElementById("profileName").placeholder = t("profile_name_label");
  document.getElementById("phoneInput").placeholder = t("phone_label");
  document.getElementById("smsInput").placeholder = t("sms_label");
  document.getElementById("whatsappInput").placeholder = t("whatsapp_label");
  document.getElementById("emailInput").placeholder = t("email_label");
  document.getElementById("locationInput").placeholder = t("location_label");

  const preferredContactSelect = document.getElementById("preferredContact");
  preferredContactSelect.options[0].text = t("preferred_contact_none");
  preferredContactSelect.options[1].text = t("preferred_contact_phone");
  preferredContactSelect.options[2].text = t("preferred_contact_sms");
  preferredContactSelect.options[3].text = t("preferred_contact_whatsapp");
  preferredContactSelect.options[4].text = t("preferred_contact_email");

  updatePublicPageButton();
  renderNodeImagePanel();
  syncPreferredContactUI();
}

function renderHeroSummary() {
  if (!currentNode) return;

  const reportsEnabled = isTruthyDbValue(currentNode.allow_anonymous_report);
  const locationVisible = isTruthyDbValue(currentNode.show_last_recovery_point);
  const locationText = currentNode.last_recovery_label ?? "";

  const heroSummary = document.getElementById("heroSummary");

  heroSummary.innerHTML = `
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("identifier"))}</div>
      <div class="hero-chip-value">${escapeHtml(currentNode.public_identifier ?? "—")}</div>
    </div>
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("dashboard_status"))}</div>
      <div class="hero-chip-value">${escapeHtml(formatStatus(currentNode.status) || "—")}</div>
    </div>
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("preferred_contact_status"))}</div>
      <div class="hero-chip-value">${escapeHtml(formatPreferredContact(currentNode.preferred_contact))}</div>
    </div>
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("location_status"))}</div>
      <div class="hero-chip-value">${escapeHtml(locationText || t("location_empty"))} · ${escapeHtml(locationVisible ? t("location_visible") : t("location_hidden"))}</div>
    </div>
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("finder_messages_status"))}</div>
      <div class="hero-chip-value">${escapeHtml(reportsEnabled ? t("finder_messages_enabled") : t("finder_messages_disabled"))}</div>
    </div>
    <div class="hero-chip">
      <div class="hero-chip-label">${escapeHtml(t("slug"))}</div>
      <div class="hero-chip-value">${escapeHtml(currentNode.public_slug ?? "—")}</div>
    </div>
  `;
}

function renderNode() {
  if (!currentNode) return;

  const reportsEnabled = isTruthyDbValue(currentNode.allow_anonymous_report);
  const locationVisible = isTruthyDbValue(currentNode.show_last_recovery_point);
  const locationText = currentNode.last_recovery_label ?? "";
  const nodeInfo = document.getElementById("nodeInfo");

  renderHeroSummary();
  updatePublicPageButton();

  document.getElementById("nodePanelTitle").textContent = currentNode.profile_name?.trim() || "Node";

  nodeInfo.innerHTML = `
    <div class="identifier">${escapeHtml(currentNode.public_identifier ?? "")}</div>
    <div class="meta">
      <div class="meta-row">
        <span class="meta-label">${escapeHtml(t("status"))}</span>
        <div class="status-badge">${escapeHtml(formatStatus(currentNode.status))}</div>
      </div>
      <div class="meta-row">
        <span class="meta-label">${escapeHtml(t("slug"))}</span>
        <div>${escapeHtml(currentNode.public_slug ?? "")}</div>
      </div>
      <div class="meta-row">
        <span class="meta-label">${escapeHtml(t("finder_messages_status"))}</span>
        <div>${escapeHtml(reportsEnabled ? t("finder_messages_enabled") : t("finder_messages_disabled"))}</div>
      </div>
      <div class="meta-row">
        <span class="meta-label">${escapeHtml(t("preferred_contact_status"))}</span>
        <div>${escapeHtml(formatPreferredContact(currentNode.preferred_contact))}</div>
      </div>
      <div class="meta-row">
        <span class="meta-label">${escapeHtml(t("location_status"))}</span>
        <div>${escapeHtml(locationText || t("location_empty"))}</div>
        <div class="muted small" style="margin-top: 6px;">${escapeHtml(locationVisible ? t("location_visible") : t("location_hidden"))}</div>
      </div>
    </div>
  `;

  document.getElementById("toggleReportsButton").textContent = reportsEnabled
    ? t("disable_reports")
    : t("enable_reports");

  document.getElementById("profileName").value = currentNode.profile_name ?? "";
  document.getElementById("publicMessage").value = currentNode.public_message ?? "";

  document.getElementById("phoneInput").value = currentNode.phone ?? "";
  document.getElementById("smsInput").value = currentNode.sms ?? "";
  document.getElementById("whatsappInput").value = currentNode.whatsapp ?? "";
  document.getElementById("emailInput").value = currentNode.email ?? "";

  document.getElementById("showPhoneInput").checked = isTruthyDbValue(currentNode.show_phone);
  document.getElementById("showSmsInput").checked = isTruthyDbValue(currentNode.show_sms);
  document.getElementById("showWhatsappInput").checked = isTruthyDbValue(currentNode.show_whatsapp);
  document.getElementById("showEmailInput").checked = isTruthyDbValue(currentNode.show_email);

  document.getElementById("preferredContact").value = (currentNode.preferred_contact || "none").toLowerCase();

  document.getElementById("locationInput").value = currentNode.last_recovery_label ?? "";
  document.getElementById("showLocationInput").checked = isTruthyDbValue(currentNode.show_last_recovery_point);

  syncPreferredContactUI();
  renderNodeImagePanel();
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  if (!currentEvents.length) {
    timeline.innerHTML = `<div class="muted">${escapeHtml(t("empty_timeline"))}</div>`;
    return;
  }

  for (const event of currentEvents) {
    const wrapper = document.createElement("div");
    wrapper.className = "event";

    const payloadText = event.payload
      ? `${t("timeline_payload_prefix")}: ${JSON.stringify(event.payload, null, 2)}`
      : "";

    wrapper.innerHTML = `
      <div class="event-type">${escapeHtml(translateEventType(event.event_type))}</div>
      <div class="event-time">${escapeHtml(new Date(event.created_at).toLocaleString(currentLang === "fi" ? "fi-FI" : "en-US"))}</div>
      ${payloadText ? `<div class="event-payload">${escapeHtml(payloadText)}</div>` : ""}
    `;

    timeline.appendChild(wrapper);
  }
}

async function fetchOwnerNode() {
  const res = await fetch("/api/owner");

  if (!res.ok) {
    throw new Error(t("load_owner_failed"));
  }

  currentNode = await res.json();
}

async function fetchTimeline() {
  if (!bootstrapToken) {
    currentEvents = [];
    return;
  }

  const res = await fetch(`/api/owner/${bootstrapToken}/events`);

  if (!res.ok) {
    throw new Error(t("load_timeline_failed"));
  }

  const data = await res.json();
  currentEvents = data.events || [];
}

async function refreshAll() {
  await fetchOwnerNode();
  await fetchTimeline();
  renderNode();
  renderTimeline();
}

function setActionStatus(message, type) {
  const el = document.getElementById("actionStatus");
  el.className = `hero-notice ${type === "error" ? "error" : "success"}`;
  el.textContent = message;
}

function clearActionStatus() {
  const el = document.getElementById("actionStatus");
  el.className = "hero-notice";
  el.textContent = "";
}

async function postOwnerUpdate(payload) {
  const res = await fetch(`/api/owner/${bootstrapToken}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || t("update_failed"));
  }

  currentNode = await res.json();
  await fetchTimeline();
  renderNode();
  renderTimeline();
  setActionStatus(t("save_success"), "success");
}

function validateSelectedImage(file) {
  if (!file) {
    throw new Error(t("image_missing_selection"));
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(t("image_invalid_type"));
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(t("image_too_large"));
  }
}

async function handleImageInputChange(event) {
  const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;

  clearActionStatus();

  if (!file) {
    clearSelectedImage();
    renderNodeImagePanel();
    return;
  }

  try {
    validateSelectedImage(file);

    selectedImageFile = file;
    revokeSelectedImagePreviewUrl();
    selectedImagePreviewUrl = URL.createObjectURL(file);

    renderNodeImagePanel();
    setActionStatus(t("image_selected_ready"), "success");
  } catch (error) {
    clearSelectedImage();
    renderNodeImagePanel();
    setActionStatus(error.message || t("image_upload_failed"), "error");
  }
}

function handleClearNodeImageSelection() {
  clearActionStatus();
  clearSelectedImage();
  renderNodeImagePanel();
  setActionStatus(t("image_selection_cleared"), "success");
}

async function handleSaveNodeImage() {
  clearActionStatus();

  try {
    validateSelectedImage(selectedImageFile);
  } catch (error) {
    setActionStatus(error.message || t("image_upload_failed"), "error");
    return;
  }

  imageOperationInFlight = true;
  setImageButtonsDisabledState();
  setActionStatus(t("image_uploading"), "success");

  try {
    const formData = new FormData();
    formData.append("image", selectedImageFile);

    const res = await fetch(`/api/owner/${bootstrapToken}/image`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || t("image_upload_failed"));
    }

    clearSelectedImage();
    await refreshAll();
    setActionStatus(t("image_upload_success"), "success");
  } catch (error) {
    setActionStatus(error.message || t("image_upload_failed"), "error");
  } finally {
    imageOperationInFlight = false;
    setImageButtonsDisabledState();
  }
}

async function handleRemoveNodeImage() {
  if (!getCurrentImageUrl()) {
    setActionStatus(t("image_delete_failed"), "error");
    return;
  }

  if (!window.confirm(t("image_remove_confirm"))) {
    return;
  }

  clearActionStatus();
  imageOperationInFlight = true;
  setImageButtonsDisabledState();
  setActionStatus(t("image_deleting"), "success");

  try {
    const res = await fetch(`/api/owner/${bootstrapToken}/image`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || t("image_delete_failed"));
    }

    clearSelectedImage();
    await refreshAll();
    setActionStatus(t("image_delete_success"), "success");
  } catch (error) {
    setActionStatus(error.message || t("image_delete_failed"), "error");
  } finally {
    imageOperationInFlight = false;
    setImageButtonsDisabledState();
  }
}

async function handleSetStatus(nextStatus) {
  const confirmText = nextStatus === "active" ? t("confirm_set_active") : t("confirm_set_lost");

  if (!window.confirm(confirmText)) {
    return;
  }

  clearActionStatus();

  try {
    await postOwnerUpdate({ status: nextStatus });
  } catch (error) {
    setActionStatus(error.message || t("update_failed"), "error");
  }
}

async function handleToggleReports() {
  const nextValue = isTruthyDbValue(currentNode.allow_anonymous_report) ? 0 : 1;
  const confirmText = nextValue === 1 ? t("confirm_enable_reports") : t("confirm_disable_reports");

  if (!window.confirm(confirmText)) {
    return;
  }

  clearActionStatus();

  try {
    await postOwnerUpdate({ allow_anonymous_report: nextValue });
  } catch (error) {
    setActionStatus(error.message || t("update_failed"), "error");
  }
}

async function handleSaveIdentity() {
  clearActionStatus();

  try {
    const payload = {
      profile_name: document.getElementById("profileName").value,
      public_message: document.getElementById("publicMessage").value
    };

    await postOwnerUpdate(payload);
  } catch (error) {
    setActionStatus(error.message || t("update_failed"), "error");
  }
}

async function handleSaveContactSettings() {
  clearActionStatus();

  try {
    const availableMethods = getAvailableContactMethodsFromInputs();
    const preferredContactValue = availableMethods.length > 0
      ? document.getElementById("preferredContact").value
      : "none";

    const payload = {
      phone: document.getElementById("phoneInput").value,
      sms: document.getElementById("smsInput").value,
      whatsapp: document.getElementById("whatsappInput").value,
      email: document.getElementById("emailInput").value,
      show_phone: document.getElementById("showPhoneInput").checked ? 1 : 0,
      show_sms: document.getElementById("showSmsInput").checked ? 1 : 0,
      show_whatsapp: document.getElementById("showWhatsappInput").checked ? 1 : 0,
      show_email: document.getElementById("showEmailInput").checked ? 1 : 0,
      preferred_contact: preferredContactValue
    };

    await postOwnerUpdate(payload);
  } catch (error) {
    setActionStatus(error.message || t("update_failed"), "error");
  }
}

async function handleSaveLocation() {
  clearActionStatus();

  try {
    const payload = {
      last_recovery_label: document.getElementById("locationInput").value,
      show_last_recovery_point: document.getElementById("showLocationInput").checked ? 1 : 0
    };

    await postOwnerUpdate(payload);
  } catch (error) {
    setActionStatus(error.message || t("update_failed"), "error");
  }
}

async function handleReplaceCarrier() {
  if (!window.confirm(t("confirm_replace_carrier"))) {
    return;
  }

  clearActionStatus();

  const reason = document.getElementById("carrierReason").value;
  const notes = document.getElementById("carrierNotes").value;

  try {
    const res = await fetch(`/api/owner/${bootstrapToken}/carrier`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ reason, notes })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || t("carrier_failed"));
    }

    document.getElementById("carrierReason").value = "";
    document.getElementById("carrierNotes").value = "";

    await fetchTimeline();
    renderTimeline();
    setActionStatus(t("carrier_success"), "success");
  } catch (error) {
    setActionStatus(error.message || t("carrier_failed"), "error");
  }
}

function bindEvents() {
  document.getElementById("langFi").addEventListener("click", () => setLanguage("fi"));
  document.getElementById("langEn").addEventListener("click", () => setLanguage("en"));

  document.getElementById("setActiveButton").addEventListener("click", () => handleSetStatus("active"));
  document.getElementById("setLostButton").addEventListener("click", () => handleSetStatus("lost"));
  document.getElementById("toggleReportsButton").addEventListener("click", handleToggleReports);
  document.getElementById("saveIdentityButton").addEventListener("click", handleSaveIdentity);
  document.getElementById("saveContactSettingsButton").addEventListener("click", handleSaveContactSettings);
  document.getElementById("saveLocationButton").addEventListener("click", handleSaveLocation);
  document.getElementById("replaceCarrierButton").addEventListener("click", handleReplaceCarrier);

  document.getElementById("nodeImageInput").addEventListener("change", handleImageInputChange);
  document.getElementById("saveNodeImageButton").addEventListener("click", handleSaveNodeImage);
  document.getElementById("clearNodeImageSelectionButton").addEventListener("click", handleClearNodeImageSelection);
  document.getElementById("removeNodeImageButton").addEventListener("click", handleRemoveNodeImage);

  document.getElementById("phoneInput").addEventListener("input", syncPreferredContactUI);
  document.getElementById("smsInput").addEventListener("input", syncPreferredContactUI);
  document.getElementById("whatsappInput").addEventListener("input", syncPreferredContactUI);
  document.getElementById("emailInput").addEventListener("input", syncPreferredContactUI);
}

async function fetchOwnerAuthState() {
  if (bootstrapToken) {
    const res = await fetch(`/api/owner/${bootstrapToken}/auth-state`);

    if (!res.ok) {
      throw new Error(t("session_check_failed"));
    }

    return res.json();
  }

  const res = await fetch("/api/owner/auth-state");

  if (res.status === 401) {
    return { state: "pin_required" };
  }

  if (!res.ok) {
    throw new Error(t("session_check_failed"));
  }

  return res.json();
}

async function verifyBootstrapPin(pin) {
  if (!bootstrapToken) {
    throw new Error(t("missing_token"));
  }

  const res = await fetch(`/api/owner/${bootstrapToken}/verify-pin`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ pin })
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || data.state !== "session_valid") {
    throw new Error(t("pin_verify_failed"));
  }
}

async function setupBootstrapPin(pin) {
  if (!bootstrapToken) {
    throw new Error(t("missing_token"));
  }

  const res = await fetch(`/api/owner/${bootstrapToken}/set-pin`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ pin })
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new Error(t("pin_verify_failed"));
  }
}

function redirectToOwnerDashboard() {
  const url = new URL("/owner", window.location.origin);
  url.searchParams.set("lang", currentLang);
  window.location.replace(url.toString());
}

async function handlePinRequired(state) {
  if (!bootstrapToken) {
    document.body.innerHTML = `<p class="error">${escapeHtml(t("pin_required"))}</p>`;
    return;
  }

  const pin = window.prompt(t("pin_prompt"));

  if (!pin) {
    document.body.innerHTML = `<p class="error">${escapeHtml(t("pin_required"))}</p>`;
    return;
  }

  if (state === "pin_not_set") {
    await setupBootstrapPin(pin);
  }

  await verifyBootstrapPin(pin);
  redirectToOwnerDashboard();
}

async function init() {
  bootstrapToken = getBootstrapToken();
  currentLang = getLanguage();

  renderStaticTexts();
  updateLanguageButtons();
  bindEvents();

  try {
    const authState = await fetchOwnerAuthState();

    if (authState.state === "session_valid") {
      await refreshAll();
      return;
    }

    if (authState.state === "pin_not_set" || authState.state === "pin_required") {
      await handlePinRequired(authState.state);
      return;
    }

    document.body.innerHTML = `<p class="error">${escapeHtml(t("session_check_failed"))}</p>`;
  } catch (error) {
    document.body.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
  }
}

window.addEventListener("beforeunload", () => {
  revokeSelectedImagePreviewUrl();
});

init();
