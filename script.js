// ===================== التنقل بين الصفحات =====================
function showPage(pageId, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.side-link').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
}

// ===================== بيانات النظام =====================
let cases = [];
let summons = [];
let decisions = [];
let users = [];
let logs = [];

let editIndex = null;

// ===================== تحديث لوحة التحكم =====================
function updateDashboard() {
    document.getElementById("casesCount").textContent = cases.length;
    document.getElementById("openCases").textContent = cases.filter(c => c.status === "مفتوحة").length;
    document.getElementById("summonsCount").textContent = summons.length;
    document.getElementById("decisionsCount").textContent = decisions.length;

    renderCasesTable();
    renderUsers();
    renderLogs();
}

// ===================== القضايا =====================
function renderCasesTable() {
    const body = document.getElementById("casesTableBody");
    if (!body) return;
    body.innerHTML = "";

    cases.forEach((c, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${c.judge}</td>
            <td>${c.from}</td>
            <td>${c.against}</td>
            <td>${c.status}</td>
            <td>
                <button class="edit-btn" onclick="editCase(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteCase(${index})">حذف</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

function saveCase() {
    const judge = document.getElementById("caseJudge").value.trim();
    const from = document.getElementById("caseFrom").value.trim();
    const against = document.getElementById("caseAgainst").value.trim();
    const article = document.getElementById("caseArticle").value.trim();
    const reason = document.getElementById("caseReason").value.trim();
    const status = document.getElementById("caseStatus").value;

    if (!judge || !from || !against) {
        alert("الرجاء تعبئة الحقول الأساسية (القاضي، مقدم القضية، ضد).");
        return;
    }

    if (editIndex === null) {
        cases.push({ judge, from, against, article, reason, status });
        addLog("تم إضافة قضية جديدة");
    } else {
        cases[editIndex] = { judge, from, against, article, reason, status };
        editIndex = null;
        document.getElementById("caseFormTitle").textContent = "إضافة قضية جديدة";
        addLog("تم تعديل قضية");
    }

    resetCaseForm();
    updateDashboard();
}

function resetCaseForm() {
    document.getElementById("caseJudge").value = "";
    document.getElementById("caseFrom").value = "";
    document.getElementById("caseAgainst").value = "";
    document.getElementById("caseArticle").value = "";
    document.getElementById("caseReason").value = "";
    document.getElementById("caseStatus").value = "مفتوحة";
    editIndex = null;
    document.getElementById("caseFormTitle").textContent = "إضافة قضية جديدة";
}

function editCase(index) {
    const c = cases[index];
    editIndex = index;

    document.getElementById("caseJudge").value = c.judge;
    document.getElementById("caseFrom").value = c.from;
    document.getElementById("caseAgainst").value = c.against;
    document.getElementById("caseArticle").value = c.article;
    document.getElementById("caseReason").value = c.reason;
    document.getElementById("caseStatus").value = c.status;

    document.getElementById("caseFormTitle").textContent = "تعديل قضية";
    showPage('cases', document.querySelectorAll('.side-link')[1]);
}

function deleteCase(index) {
    if (confirm("هل أنت متأكد من حذف هذه القضية؟")) {
        cases.splice(index, 1);
        addLog("تم حذف قضية");
        updateDashboard();
    }
}

// ===================== المستخدمين =====================
function addUser() {
    let name = document.getElementById("userName").value.trim();
    let email = document.getElementById("userEmail").value.trim();
    let role = document.getElementById("userRole").value;

    if (!name || !email) {
        alert("الرجاء تعبئة اسم المستخدم والبريد.");
        return;
    }

    users.push({ name, email, role });
    addLog("تم إضافة مستخدم جديد");
    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
    renderUsers();
}

function renderUsers() {
    let body = document.getElementById("usersTable");
    if (!body) return;
    body.innerHTML = "";

    users.forEach((u, i) => {
        body.innerHTML += `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td><button class="delete-btn" onclick="deleteUser(${i})">حذف</button></td>
            </tr>
        `;
    });
}

function deleteUser(i) {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
        users.splice(i, 1);
        addLog("تم حذف مستخدم");
        renderUsers();
    }
}

// ===================== التقارير =====================
function generateReport() {
    let type = document.getElementById("reportType").value;
    let output = document.getElementById("reportOutput");
    if (!output) return;

    output.innerHTML = "";

    if (type === "cases") {
        output.innerHTML += `<tr><td>عدد القضايا</td><td>${cases.length}</td></tr>`;
        output.innerHTML += `<tr><td>القضايا المفتوحة</td><td>${cases.filter(c => c.status === "مفتوحة").length}</td></tr>`;
    }

    if (type === "summons") {
        output.innerHTML += `<tr><td>عدد الاستدعاءات</td><td>${summons.length}</td></tr>`;
    }

    if (type === "decisions") {
        output.innerHTML += `<tr><td>عدد القرارات</td><td>${decisions.length}</td></tr>`;
    }

    if (type === "users") {
        output.innerHTML += `<tr><td>عدد المستخدمين</td><td>${users.length}</td></tr>`;
    }

    addLog("تم إنشاء تقرير");
}

// ===================== السجلات =====================
function addLog(text) {
    logs.push({ text, date: new Date().toLocaleString() });
    renderLogs();
}

function renderLogs() {
    let body = document.getElementById("logsTable");
    if (!body) return;
    body.innerHTML = "";

    logs.forEach(l => {
        body.innerHTML += `
            <tr>
                <td>${l.text}</td>
                <td>${l.date}</td>
            </tr>
        `;
    });
}

// ===================== الإعدادات =====================
function saveSettings() {
    let name = document.getElementById("systemName").value;
    let lang = document.getElementById("systemLang").value;

    addLog("تم تغيير إعدادات النظام");
    alert("تم حفظ الإعدادات");
}

// تشغيل أولي
updateDashboard();