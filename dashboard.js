/* ===============================
   DASHBOARD.JS – CLEAN VERSION
   =============================== */

let currentUser = null;

/* -------------------------------
   TAB SWITCH
-------------------------------- */
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

tabLogin.onclick = () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
};

tabSignup.onclick = () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

/* -------------------------------
   LOGIN
-------------------------------- */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  loginBtn.disabled = true;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    currentUser = data.user;
    showToast("Login success", "success");
    showDashboard(currentUser);

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    loginBtn.disabled = false;
  }
});

/* -------------------------------
   SIGNUP (FIXED)
-------------------------------- */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = signupName.value.trim();
  const phone = signupPhone.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (password.length < 6) {
    showToast("Password minimum 6 chars", "error");
    return;
  }

  signupBtn.disabled = true;

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name } }
    });

    if (error) throw error;

    if (data.user) {
      await supabaseClient.from("profiles").upsert({
        id: data.user.id,
        full_name,
        phone
      });
    }

    showToast("Account created. Verify email.", "success");
    signupForm.reset();
    tabLogin.click();

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    signupBtn.disabled = false;
  }
});

/* -------------------------------
   SHOW DASHBOARD
-------------------------------- */
async function showDashboard(user) {
  currentUser = user;

  loginContainer.classList.add("hidden");
  dashboardContainer.classList.remove("hidden");

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  userName.textContent =
    profile?.full_name || user.email.split("@")[0];

  membershipType.textContent = profile?.plan || "Free";
  downloadCount.textContent = profile?.download_count || 0;
  referralEarnings.textContent = "₹" + (profile?.referral_earnings || 0);

  const refCode =
    profile?.referral_code || user.id.substring(0, 8).toUpperCase();
  referralLink.value = `https://caretechmobile.com/ref/${refCode}`;

  loadServices();
  loadMyRequests();
}

/* -------------------------------
   LOGOUT
-------------------------------- */
logoutBtn.onclick = async () => {
  await supabaseClient.auth.signOut();
  dashboardContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  showToast("Logged out", "info");
};

/* -------------------------------
   LOAD SERVICES
-------------------------------- */
async function loadServices() {
  const select = serviceSelect;
  select.innerHTML = `<option value="">-- Select Service --</option>`;

  const { data, error } = await supabaseClient
    .from("services")
    .select("id, service_name, price")
    .order("service_name");

  if (!error && data) {
    data.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.service_name} - ₹${s.price}`;
      select.appendChild(opt);
    });
  }
}

/* -------------------------------
   SUBMIT SERVICE REQUEST
-------------------------------- */
serviceRequestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!serviceSelect.value) {
    showToast("Select service", "error");
    return;
  }

  submitServiceBtn.disabled = true;

  try {
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", currentUser.id)
      .single();

    await supabaseClient.from("service_requests").insert({
      user_id: currentUser.id,
      service_id: serviceSelect.value,
      description: issueDescription.value.trim(),
      priority: prioritySelect.value,
      status: "pending",
      customer_name: profile?.full_name || "",
      customer_phone: profile?.phone || "",
      customer_email: currentUser.email
    });

    showToast("Request submitted", "success");
    issueDescription.value = "";
    serviceSelect.selectedIndex = 0;
    loadMyRequests();

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    submitServiceBtn.disabled = false;
  }
});

/* -------------------------------
   LOAD MY REQUESTS
-------------------------------- */
async function loadMyRequests() {
  requestsList.innerHTML =
    `<div class="request-item loading-state">Loading...</div>`;

  const { data, error } = await supabaseClient
    .from("service_requests")
    .select(`
      id,
      description,
      status,
      created_at,
      services:service_id (service_name)
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error || !data.length) {
    requestsList.innerHTML =
      `<div class="request-item empty-state">No requests</div>`;
    requestCount.textContent = 0;
    return;
  }

  requestCount.textContent = data.length;

  requestsList.innerHTML = data
    .map((r) => {
      const statusClass = r.status.replace("-", "_");
      const date = new Date(r.created_at).toLocaleDateString("en-IN");

      return `
        <div class="request-item">
          <div class="request-icon"><i class="fas fa-wrench"></i></div>
          <div class="request-info">
            <h4>${r.services?.service_name || "Service"}</h4>
            <p>${r.description.slice(0, 40)}...</p>
          </div>
          <div class="request-status">
            <span class="status-badge ${statusClass}">${r.status}</span>
            <p class="request-date">${date}</p>
          </div>
        </div>`;
    })
    .join("");
}

/* -------------------------------
   AUTH CHECK ON LOAD
-------------------------------- */
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session?.user) {
    showDashboard(data.session.user);
  }
})();

/* -------------------------------
   UTIL
-------------------------------- */
copyRefBtn.onclick = () => {
  navigator.clipboard.writeText(referralLink.value);
  showToast("Copied", "success");
};

refreshRequests.onclick = (e) => {
  e.preventDefault();
  loadMyRequests();
};
