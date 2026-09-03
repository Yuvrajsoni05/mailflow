/* ==========================================================================
   MailFlow — app.js
   Minimal, dependency-free JS. Organized by feature so it's easy to lift
   individual sections out once Django views are wired up.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------------------
   * Sidebar (mobile toggle)
   * ------------------------------------------------------------------- */
  (function sidebarModule() {
    const sidebar = document.getElementById("mfSidebar");
    const backdrop = document.getElementById("mfSidebarBackdrop");
    const toggleBtn = document.getElementById("mfSidebarToggle");
    if (!sidebar || !toggleBtn) return;

    function openSidebar() {
      sidebar.classList.add("show");
      if (backdrop) backdrop.classList.add("show");
    }
    function closeSidebar() {
      sidebar.classList.remove("show");
      if (backdrop) backdrop.classList.remove("show");
    }
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.contains("show") ? closeSidebar() : openSidebar();
    });
    if (backdrop) backdrop.addEventListener("click", closeSidebar);
  })();

  /* ---------------------------------------------------------------------
   * Lead / row selection (leads table, campaign create)
   * ------------------------------------------------------------------- */
  (function selectionModule() {
    const selectAll = document.querySelectorAll("[data-select-all]");
    selectAll.forEach(function (allBox) {
      const groupName = allBox.getAttribute("data-select-all");
      const targets = document.querySelectorAll('[data-select-item="' + groupName + '"]');
      const counter = document.querySelector('[data-select-count="' + groupName + '"]');

      function updateCount() {
        const checked = document.querySelectorAll('[data-select-item="' + groupName + '"]:checked').length;
        if (counter) counter.textContent = checked;
        if (targets.length) {
          allBox.checked = checked === targets.length;
          allBox.indeterminate = checked > 0 && checked < targets.length;
        }
      }

      allBox.addEventListener("change", function () {
        targets.forEach(function (cb) { cb.checked = allBox.checked; });
        updateCount();
      });

      targets.forEach(function (cb) { cb.addEventListener("change", updateCount); });
      updateCount();
    });
  })();

  /* ---------------------------------------------------------------------
   * Template variable insertion (template_create.html)
   * ------------------------------------------------------------------- */
  (function templateVariablesModule() {
    const buttons = document.querySelectorAll("[data-insert-variable]");
    const target = document.getElementById("emailBody");
    if (!buttons.length || !target) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const variable = btn.getAttribute("data-insert-variable");
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const text = target.value;
        target.value = text.slice(0, start) + variable + text.slice(end);
        target.focus();
        target.selectionStart = target.selectionEnd = start + variable.length;
        updatePreview();
      });
    });

    const subjectInput = document.getElementById("templateSubject");
    const previewBox = document.getElementById("emailPreviewBody");
    const previewSubject = document.getElementById("emailPreviewSubject");

    const sampleData = {
      "{{first_name}}": "Yuvraj",
      "{{last_name}}": "Soni",
      "{{company}}": "ABC Technologies",
      "{{email}}": "yuvraj@example.com",
      "{{phone}}": "+91 98765 43210"
    };

    function fillSample(str) {
      let out = str;
      Object.keys(sampleData).forEach(function (key) {
        out = out.split(key).join(sampleData[key]);
      });
      return out;
    }

    function updatePreview() {
      if (previewBox) previewBox.textContent = fillSample(target.value);
      if (previewSubject && subjectInput) previewSubject.textContent = fillSample(subjectInput.value);
    }

    target.addEventListener("input", updatePreview);
    if (subjectInput) subjectInput.addEventListener("input", updatePreview);
    updatePreview();
  })();

  /* ---------------------------------------------------------------------
   * CSV preview (lead_upload.html)
   * ------------------------------------------------------------------- */
  (function csvPreviewModule() {
    const input = document.getElementById("csvFileInput");
    const fileName = document.getElementById("csvFileName");
    const previewWrap = document.getElementById("csvPreviewWrap");
    if (!input) return;

    input.addEventListener("change", function () {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      if (fileName) fileName.textContent = file.name;

      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        const rows = text.split(/\r?\n/).filter(Boolean).slice(0, 6);
        if (!previewWrap) return;

        let html = '<table class="table table-sm mf-table mb-0"><thead><tr>';
        const header = rows[0] ? rows[0].split(",") : [];
        header.forEach(function (col) { html += "<th>" + col.trim() + "</th>"; });
        html += "</tr></thead><tbody>";

        rows.slice(1).forEach(function (row) {
          html += "<tr>";
          row.split(",").forEach(function (cell) { html += "<td>" + cell.trim() + "</td>"; });
          html += "</tr>";
        });
        html += "</tbody></table>";

        previewWrap.innerHTML = html;
        previewWrap.classList.remove("d-none");
      };
      reader.readAsText(file);
    });
  })();

  /* ---------------------------------------------------------------------
   * Password show / hide (login, signup, reset password)
   * ------------------------------------------------------------------- */
  (function passwordToggleModule() {
    document.querySelectorAll("[data-password-toggle]").forEach(function (btn) {
      const targetId = btn.getAttribute("data-password-toggle");
      const input = document.getElementById(targetId);
      if (!input) return;
      btn.addEventListener("click", function () {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.toggle("bi-eye", !isHidden);
          icon.classList.toggle("bi-eye-slash", isHidden);
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
   * Delete confirmation (leads, campaigns, templates lists)
   * ------------------------------------------------------------------- */
  (function deleteConfirmModule() {
    document.querySelectorAll("[data-confirm-delete]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const label = btn.getAttribute("data-confirm-delete") || "this item";
        if (!window.confirm("Delete " + label + "? This can't be undone.")) {
          e.preventDefault();
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
   * Campaign send confirmation (campaign_send.html)
   * ------------------------------------------------------------------- */
  (function campaignSendModule() {
    const form = document.getElementById("campaignSendForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      if (!window.confirm("Send this campaign now? Emails will start going out immediately.")) {
        e.preventDefault();
      }
    });
  })();

  /* ---------------------------------------------------------------------
   * Dashboard chart (Chart.js — optional, only runs if canvas is present)
   * ------------------------------------------------------------------- */
  (function dashboardChartModule() {
    const canvas = document.getElementById("mfActivityChart");
    if (!canvas || typeof Chart === "undefined") return;

    new Chart(canvas, {
      type: "line",
      data: {
        labels: ["Mar 1", "Mar 5", "Mar 10", "Mar 15", "Mar 20", "Mar 25", "Mar 30"],
        datasets: [
          {
            label: "Sent",
            data: [420, 680, 540, 890, 760, 1020, 940],
            borderColor: "#3E4DE7",
            backgroundColor: "rgba(62,77,231,0.08)",
            tension: 0.35,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Opened",
            data: [180, 300, 250, 410, 360, 470, 430],
            borderColor: "#17A673",
            backgroundColor: "rgba(23,166,115,0.08)",
            tension: 0.35,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Clicked",
            data: [60, 110, 90, 160, 140, 190, 170],
            borderColor: "#D98A1F",
            backgroundColor: "rgba(217,138,31,0.08)",
            tension: 0.35,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } } },
        scales: {
          y: { grid: { color: "#EFEFF7" }, ticks: { color: "#8A8DA6" } },
          x: { grid: { display: false }, ticks: { color: "#8A8DA6" } }
        }
      }
    });
  })();

});
