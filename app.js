/* =========================================================
   SMS DAY 2026 POSTER VOTING
========================================================= */

const ADMIN_CODE = "998467";

let currentLanguage = "th";
let currentEmployeeID = "";
let selectedEmployeePosterID = "";
let selectedCommitteePosterID = "";
let committeeScores = {};
let thaiImageData = "";
let englishImageData = "";

let firebasePosters = [];


/* =========================================================
   TRANSLATION
========================================================= */

const translations = {

    th: {
        heroSlogan:
            "ร่วมโหวตโปสเตอร์<br>SMS DAY 2026",

        employeeLoginTitle:
            "Employee Voting",

        employeeLoginDescription:
            "กรอก Employee ID เพื่อเข้าร่วมโหวตโปสเตอร์ SMS DAY 2026",

        employeeIDLabel:
            "Employee ID",

        employeeContinue:
            "เข้าสู่การโหวต",

        employeeOnce:
            "Employee ID สามารถโหวตได้เพียง 1 ครั้ง",

        employeeVotingTitle:
            "เลือกโปสเตอร์ที่คุณชื่นชอบ",

        employeeVotingDescription:
            "ดูผลงานแต่ละแบบและเลือกโปสเตอร์ที่คุณชื่นชอบที่สุด 1 ผลงาน",

        employeeSubmit:
            "ยืนยันการโหวต",

        employeeSuccessTitle:
            "ขอบคุณสำหรับการโหวต",

        employeeSuccessText:
            "บันทึกผลโหวตของคุณเรียบร้อยแล้ว",

        committeeVotingTitle:
            "พิจารณาและเลือกโปสเตอร์",

        committeeVotingDescription:
            "ดูโปสเตอร์ Safety Message และ AI Prompt ก่อนเลือกผลงาน",

        committeeSubmit:
            "ยืนยันการโหวตกรรมการ",

        committeeSuccessTitle:
            "ขอบคุณสำหรับการโหวต",

        committeeSuccessText:
            "บันทึกผลโหวตของกรรมการเรียบร้อยแล้ว"
    },


    en: {
        heroSlogan:
            "Vote for your favorite<br>SMS DAY 2026 poster",

        employeeLoginTitle:
            "Employee Voting",

        employeeLoginDescription:
            "Enter your Employee ID to participate in SMS DAY Poster Voting.",

        employeeIDLabel:
            "Employee ID",

        employeeContinue:
            "Continue to Voting",

        employeeOnce:
            "One Employee ID can vote only once.",

        employeeVotingTitle:
            "Choose Your Favorite Poster",

        employeeVotingDescription:
            "Explore each design and select the poster you like the most.",

        employeeSubmit:
            "Submit My Vote",

        employeeSuccessTitle:
            "Thank You!",

        employeeSuccessText:
            "Your vote has been submitted successfully.",

        committeeVotingTitle:
            "Review & Select Poster",

        committeeVotingDescription:
            "Review each poster, Safety Message and AI Prompt before selecting your choice.",

        committeeSubmit:
            "Submit Committee Vote",

        committeeSuccessTitle:
            "Thank You!",

        committeeSuccessText:
            "Your Committee vote has been submitted successfully."
    }
};


/* =========================================================
   FIREBASE POSTERS
========================================================= */

function getPosters() {
    return firebasePosters;
}


async function loadPostersFromFirebase() {

    if (!window.FirebaseStore) {
        return;
    }

    try {

        firebasePosters =
            await window.FirebaseStore.getPosters();

        console.log(
            "Posters loaded from Firebase:",
            firebasePosters.length
        );


        renderEmployeePosters();
        renderCommitteePosters();

        if (
            document.getElementById(
                "adminPosterGrid"
            )
        ) {
            refreshAdmin();
            renderEmployeeResults();
            renderCommitteeResults();
            renderEmployeePollResults();
            renderCommitteePollResults();
        }

    } catch (error) {

        console.error(
            "Cannot load posters from Firebase:",
            error
        );
    }
}


window.addEventListener(
    "firebase-ready",
    loadPostersFromFirebase
);


if (window.FirebaseStore) {
    loadPostersFromFirebase();
}


/* =========================================================
   SAVE POSTERS TO FIREBASE
========================================================= */

async function savePosters(posters) {

    if (!window.FirebaseStore) {

        alert(
            "Firebase is not ready. Please refresh the page."
        );

        throw new Error(
            "Firebase is not ready"
        );
    }


    try {

        for (const poster of posters) {

            await window.FirebaseStore.savePoster(
                poster
            );
        }


        firebasePosters = posters;

        console.log(
            "Posters saved to Firebase"
        );


        return true;

    } catch (error) {

        console.error(
            "Cannot save posters:",
            error
        );


        alert(
            "Cannot save Poster to Firebase."
        );


        throw error;
    }
}


/* =========================================================
   FIREBASE VOTES
========================================================= */

let firebaseEmployeeVotes = {};
let firebaseCommitteeVotes = [];


/* =========================================================
   LOAD VOTES FROM FIREBASE
========================================================= */

async function loadVotesFromFirebase() {

    if (!window.FirebaseStore) {
        return;
    }

    try {

        firebaseEmployeeVotes =
            await window.FirebaseStore.getEmployeeVotes();

        firebaseCommitteeVotes =
            await window.FirebaseStore.getCommitteeVotes();

        console.log(
            "Employee Votes:",
            Object.keys(firebaseEmployeeVotes).length
        );

        console.log(
            "Committee Votes:",
            firebaseCommitteeVotes.length
        );


        // ถ้าอยู่หน้า Admin ให้อัปเดต Dashboard
        if (
            document.getElementById("adminDashboard")
        ) {
            refreshAdmin();

            renderEmployeeResults();
            renderCommitteeResults();
            renderEmployeePollResults();
            renderCommitteePollResults();
        }

    } catch (error) {

        console.error(
            "Cannot load votes from Firebase:",
            error
        );
    }
}


/* =========================================================
   GET VOTES
========================================================= */

function getEmployeeVotes() {
    return firebaseEmployeeVotes;
}


function getCommitteeVotes() {
    return firebaseCommitteeVotes;
}


/* =========================================================
   FIREBASE READY
========================================================= */

window.addEventListener(
    "firebase-ready",
    loadVotesFromFirebase
);


if (window.FirebaseStore) {
    loadVotesFromFirebase();
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin() {

    const input =
        document.getElementById("adminCode");

    const error =
        document.getElementById("adminLoginError");

    if (!input) {
        return;
    }

    const code =
        input.value.trim();

    if (error) {
        error.textContent = "";
    }

    if (code !== ADMIN_CODE) {

        if (error) {
            error.textContent =
                "Incorrect Admin Code.";
        }

        return;
    }

    hideElement("adminLoginPage");
    showElement("adminDashboard");

    refreshAdmin();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
window.adminLogin = adminLogin;
/* =========================================================
   LANGUAGE
========================================================= */

function changeLanguage(language) {

    currentLanguage = language;


    document
        .querySelectorAll(
            ".language-button"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.language === language
            );
        });


    const t =
        translations[language];


    setHTML(
        "heroSlogan",
        t.heroSlogan
    );

    setText(
        "employeeLoginTitle",
        t.employeeLoginTitle
    );

    setText(
        "employeeLoginDescription",
        t.employeeLoginDescription
    );

    setText(
        "employeeIDLabel",
        t.employeeIDLabel
    );

    setText(
        "employeeContinueText",
        t.employeeContinue
    );

    setText(
        "employeeOnceText",
        t.employeeOnce
    );

    setText(
        "employeeVotingTitle",
        t.employeeVotingTitle
    );

    setText(
        "employeeVotingDescription",
        t.employeeVotingDescription
    );

    setText(
        "employeeSubmitText",
        t.employeeSubmit
    );

    setText(
        "employeeSuccessTitle",
        t.employeeSuccessTitle
    );

    setText(
        "employeeSuccessText",
        t.employeeSuccessText
    );

    setText(
        "committeeVotingTitle",
        t.committeeVotingTitle
    );

    setText(
        "committeeVotingDescription",
        t.committeeVotingDescription
    );

    setText(
        "committeeSubmitText",
        t.committeeSubmit
    );

    setText(
        "committeeSuccessTitle",
        t.committeeSuccessTitle
    );

    setText(
        "committeeSuccessText",
        t.committeeSuccessText
    );


    renderEmployeePosters();
    renderCommitteePosters();
}


/* =========================================================
   EMPLOYEE LOGIN
========================================================= */

function employeeLogin() {

    const input =
        document.getElementById(
            "employeeID"
        );

    const error =
        document.getElementById(
            "employeeLoginError"
        );


    if (!input) {
        return;
    }


    const employeeID =
        input.value.trim();


    if (error) {
        error.textContent = "";
    }


    if (!/^\d{6}$/.test(employeeID)) {

        if (error) {

            error.textContent =
                currentLanguage === "th"
                    ? "กรุณากรอก Employee ID เป็นตัวเลข 6 หลัก"
                    : "Please enter a valid 6-digit Employee ID.";
        }

        return;
    }


    const votes =
        getEmployeeVotes();


    if (votes[employeeID]) {

        if (error) {

            error.textContent =
                currentLanguage === "th"
                    ? "Employee ID นี้ได้ทำการโหวตแล้ว"
                    : "This Employee ID has already voted.";
        }

        return;
    }


    currentEmployeeID =
        employeeID;

    selectedEmployeePosterID =
        "";


    hideElement(
        "employeeLoginPage"
    );

    showElement(
        "employeeVotingPage"
    );


    renderEmployeePosters();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   EMPLOYEE POSTERS
========================================================= */

function renderEmployeePosters() {

    const grid =
        document.getElementById(
            "employeePosterGrid"
        );


    if (!grid) {
        return;
    }


    const posters =
        getPosters();


    grid.innerHTML = "";


    if (posters.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                ${
                    currentLanguage === "th"
                        ? "ยังไม่มีโปสเตอร์ในระบบ"
                        : "No posters are available yet."
                }

            </div>
        `;

        return;
    }


    posters.forEach(
        (poster, index) => {

            const selected =
                selectedEmployeePosterID ===
                poster.id;


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                selected
                    ? "dual-poster-card selected"
                    : "dual-poster-card";


            card.innerHTML = `

                <div class="dual-card-header">

                    <div>

                        <div class="poster-number">
                            POSTER ${String(index + 1).padStart(2, "0")}
                        </div>

                        <h2>
                            ${escapeHTML(
                                poster.name ||
                                "Untitled Poster"
                            )}
                        </h2>

                    </div>

                </div>


                <div class="poster-two-language">


                    <div class="poster-version-box">

                        <div class="poster-version-title">

                            <span class="language-tag thai-tag">
                                TH
                            </span>

                            <span>
                                Thai Version
                            </span>

                        </div>


                        <button
                            type="button"
                            class="poster-preview-button"
                            onclick="openImageViewer('${poster.id}', 'th')">

                            ${
                                poster.thaiImage
                                    ? `
                                        <img
                                            src="${escapeHTML(poster.thaiImage)}"
                                            alt="Thai Version"
                                            loading="lazy"
                                            decoding="async">
                                      `
                                    : `
                                        <div class="poster-no-image">
                                            No Thai Image
                                        </div>
                                      `
                            }


                            ${
                                poster.thaiImage
                                    ? `
                                        <div class="poster-view-button">

                                            <span>⤢</span>

                                            ${
                                                currentLanguage === "th"
                                                    ? "ขยายดูรูป"
                                                    : "View Full Size"
                                            }

                                        </div>
                                      `
                                    : ""
                            }

                        </button>

                    </div>


                    <div class="poster-version-box">

                        <div class="poster-version-title">

                            <span class="language-tag english-tag">
                                EN
                            </span>

                            <span>
                                English Version
                            </span>

                        </div>


                        <button
                            type="button"
                            class="poster-preview-button"
                            onclick="openImageViewer('${poster.id}', 'en')">

                            ${
                                poster.englishImage
                                    ? `
                                        <img
                                            src="${escapeHTML(poster.englishImage)}"
                                            alt="English Version"
                                            loading="lazy"
                                            decoding="async">
                                      `
                                    : `
                                        <div class="poster-no-image">
                                            No English Image
                                        </div>
                                      `
                            }


                            ${
                                poster.englishImage
                                    ? `
                                        <div class="poster-view-button">

                                            <span>⤢</span>

                                            ${
                                                currentLanguage === "th"
                                                    ? "ขยายดูรูป"
                                                    : "View Full Size"
                                            }

                                        </div>
                                      `
                                    : ""
                            }

                        </button>

                    </div>


                </div>


                <div class="poster-detail-section">

                    <div class="poster-detail-label">
                        Safety Message
                    </div>

                    <div class="safety-message">
                        ${escapeHTML(
                            poster.keywords ||
                            "No Safety Message"
                        )}
                    </div>

                </div>


                <button
                    type="button"
                    class="poster-select-button ${selected ? "selected" : ""}"
                    onclick="selectEmployeePoster('${poster.id}')">

                    <span class="custom-radio">
                        ${selected ? "✓" : ""}
                    </span>

                    <span>

                        ${
                            selected
                                ? (
                                    currentLanguage === "th"
                                        ? "เลือกแล้ว"
                                        : "Selected"
                                )
                                : (
                                    currentLanguage === "th"
                                        ? "เลือกโปสเตอร์นี้"
                                        : "Select this poster"
                                )
                        }

                    </span>

                </button>
            `;


            grid.appendChild(card);
        }
    );
}


/* =========================================================
   SELECT EMPLOYEE
========================================================= */

function selectEmployeePoster(
    posterID
) {

    // ถ้ากดโปสเตอร์ที่เลือกอยู่แล้ว = ยกเลิกการเลือก
    if (selectedEmployeePosterID === posterID) {

        selectedEmployeePosterID = "";

    } else {

        // ถ้ายังไม่ได้เลือก หรือเลือกโปสเตอร์อื่น
        selectedEmployeePosterID = posterID;
    }


    const error =
        document.getElementById(
            "employeeVoteError"
        );


    if (error) {
        error.textContent = "";
    }


    renderEmployeePosters();
}


/* =========================================================
   SUBMIT EMPLOYEE
========================================================= */
async function submitEmployeeVote() {

    const error =
        document.getElementById(
            "employeeVoteError"
        );

    if (error) {
        error.textContent = "";
    }


    /* ==============================
       CHECK POSTER
    ============================== */

    if (!selectedEmployeePosterID) {

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "กรุณาเลือกโปสเตอร์ก่อนยืนยันการโหวต"
                    : "Please select a poster before submitting.";
        }

        return;
    }


    /* ==============================
       CHECK EMPLOYEE ID
    ============================== */

    if (!currentEmployeeID) {

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ไม่พบ Employee ID"
                    : "Employee ID not found.";
        }

        return;
    }


    /* ==============================
       CHECK FIREBASE
    ============================== */

    if (
        !window.FirebaseStore ||
        typeof window.FirebaseStore.getEmployeeVotes !== "function" ||
        typeof window.FirebaseStore.saveEmployeeVote !== "function"
    ) {

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ไม่สามารถเชื่อมต่อ Firebase ได้"
                    : "Cannot connect to Firebase.";
        }

        return;
    }


    try {

        /* ==============================
           LOAD LATEST VOTES
        ============================== */

        const latestVotes =
            await window.FirebaseStore
                .getEmployeeVotes();


        firebaseEmployeeVotes =
            latestVotes || {};


        /* ==============================
           CHECK DUPLICATE ID
        ============================== */

        if (
            firebaseEmployeeVotes[
                currentEmployeeID
            ]
        ) {

            if (error) {
                error.textContent =
                    currentLanguage === "th"
                        ? "Employee ID นี้ได้ทำการโหวตแล้ว"
                        : "This Employee ID has already voted.";
            }

            return;
        }


        /* ==============================
           CREATE VOTE
        ============================== */

        const vote = {

            employeeID:
                currentEmployeeID,

            posterID:
                selectedEmployeePosterID,

            submittedAt:
                new Date().toISOString()
        };


        /* ==============================
           SAVE TO FIREBASE
        ============================== */

        await window.FirebaseStore
            .saveEmployeeVote(
                currentEmployeeID,
                vote
            );


        /* ==============================
           RELOAD FIREBASE
        ============================== */

        firebaseEmployeeVotes =
            await window.FirebaseStore
                .getEmployeeVotes();


        console.log(
            "Employee Vote Saved:",
            vote
        );


        /* ==============================
           SUCCESS PAGE
        ============================== */

        hideElement(
            "employeeVotingPage"
        );

        showElement(
            "employeeSuccessPage"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (firebaseError) {

        console.error(
            "Employee vote error:",
            firebaseError
        );


        if (error) {

            error.textContent =
                currentLanguage === "th"
                    ? "เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองอีกครั้ง"
                    : "Unable to save your vote. Please try again.";
        }
    }
}

function finishEmployee() {

    currentEmployeeID = "";
    selectedEmployeePosterID = "";


    const input =
        document.getElementById(
            "employeeID"
        );


    if (input) {
        input.value = "";
    }


    hideElement(
        "employeeSuccessPage"
    );

    showElement(
        "employeeLoginPage"
    );
}


/* =========================================================
   COMMITTEE POSTERS
========================================================= */

function renderCommitteePosters() {

    const grid =
        document.getElementById(
            "committeePosterGrid"
        );

    if (!grid) {
        return;
    }

    const posters = getPosters();

    grid.innerHTML = "";

    if (posters.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                ${
                    currentLanguage === "th"
                        ? "ยังไม่มีโปสเตอร์ในระบบ"
                        : "No posters are available yet."
                }
            </div>
        `;

        return;
    }


    posters.forEach((poster, index) => {

        // สร้างพื้นที่เก็บคะแนนของ Poster นี้
        if (!committeeScores[poster.id]) {

            committeeScores[poster.id] = {
                sms: null,
                clarity: null,
                creativity: null,
                design: null,
                ai: null
            };
        }

        const scores = committeeScores[poster.id];

        const card =
            document.createElement("article");

        card.className =
            "dual-poster-card committee-card";

        card.innerHTML = `

            <div class="dual-card-header">

                <div>

                    <div class="poster-number committee-number">
                        POSTER ${String(index + 1).padStart(2, "0")}
                    </div>

                    <h2>
                        ${escapeHTML(
                            poster.name ||
                            "Untitled Poster"
                        )}
                    </h2>

                </div>

            </div>


            <!-- POSTER IMAGES -->

            <div class="poster-two-language">

                <div class="poster-version-box">

                    <div class="poster-version-title">

                        <span class="language-tag thai-tag">
                            TH
                        </span>

                        <span>
                            Thai Version
                        </span>

                    </div>

                    <button
                        type="button"
                        class="poster-preview-button"
                        onclick="openImageViewer('${poster.id}', 'th')">

                        ${
                            poster.thaiImage
                                ? `
                                    <img
                                        src="${escapeHTML(poster.thaiImage)}"
                                        alt="Thai Version"
                                        loading="lazy"
                                        decoding="async">
                                                                    `
                                : `
                                    <div class="poster-no-image">
                                        No Thai Image
                                    </div>
                                `
                        }

                        ${
                            poster.thaiImage
                                ? `
                                    <div class="poster-view-button">
                                        <span>⤢</span>
                                        ${
                                            currentLanguage === "th"
                                                ? "ขยายดูรูป"
                                                : "View Full Size"
                                        }
                                    </div>
                                `
                                : ""
                        }

                    </button>

                </div>


                <div class="poster-version-box">

                    <div class="poster-version-title">

                        <span class="language-tag english-tag">
                            EN
                        </span>

                        <span>
                            English Version
                        </span>

                    </div>

                    <button
                        type="button"
                        class="poster-preview-button"
                        onclick="openImageViewer('${poster.id}', 'en')">

                        ${
                            poster.englishImage
                                ? `
                                    <img
                                        src="${escapeHTML(poster.englishImage)}"
                                        alt="English Version">
                                        loading="lazy"
                                        decoding="async">
                                `
                                : `
                                    <div class="poster-no-image">
                                        No English Image
                                    </div>
                                `
                        }

                        ${
                            poster.englishImage
                                ? `
                                    <div class="poster-view-button">
                                        <span>⤢</span>
                                        ${
                                            currentLanguage === "th"
                                                ? "ขยายดูรูป"
                                                : "View Full Size"
                                        }
                                    </div>
                                `
                                : ""
                        }

                    </button>

                </div>

            </div>


            <!-- SAFETY MESSAGE -->

            <div class="poster-detail-section">

                <div class="poster-detail-label">
                    Safety Message
                </div>

                <div class="safety-message">
                    ${escapeHTML(
                        poster.keywords ||
                        "No Safety Message"
                    )}
                </div>

            </div>


            <!-- AI PROMPT -->

            <div class="poster-detail-section prompt-section">

                <div class="poster-detail-label">
                    AI PROMPT
                </div>

                <div class="prompt-language-buttons">

                    <button
                        type="button"
                        class="view-prompt-button"
                        onclick="openPromptViewer('${poster.id}')">

                        <span>
                            ${
                                currentLanguage === "th"
                                    ? "เปิดอ่าน AI Prompt"
                                    : "View AI Prompt"
                            }
                        </span>

                        <span>→</span>

                    </button>

                </div>

            </div>
            <!-- COMMITTEE SCORING -->

            <div class="committee-scoring">

                <div class="committee-scoring-header">

                    <div>
                        <span class="scoring-small">
                            COMMITTEE SCORING
                        </span>

                        <h3>
                            ${
                                currentLanguage === "th"
                                    ? "เกณฑ์การให้คะแนน"
                                    : "Evaluation Criteria"
                            }
                        </h3>
                    </div>

                    <div class="committee-total-score">

                        <span>
                            TOTAL SCORE
                        </span>

                        <strong id="score-${poster.id}">
                            ${calculateCommitteeScore(poster.id).toFixed(2)}%
                        </strong>

                    </div>

                </div>

                </div>


                <div class="committee-rating-scale">
                    ${
                        currentLanguage === "th"
                            ? "ระดับคะแนน: 0 = น้อยที่สุด → 5 = มากที่สุด"
                            : "Rating Scale: 0 = Lowest → 5 = Highest"
                    }
                </div>


                ${createScoreRow(
                    poster.id,
                    "sms",
                    currentLanguage === "th"
                        ? "ความสอดคล้องกับ SMS / ความปลอดภัยทางการบิน"
                        : "SMS / Aviation Safety Relevance",
                    30,
                    scores.sms
                )}


                ${createScoreRow(
                    poster.id,
                    "clarity",
                    currentLanguage === "th"
                        ? "ความชัดเจนของข้อความด้านความปลอดภัย"
                        : "Safety Message Clarity",
                    25,
                    scores.clarity
                )}


                ${createScoreRow(
                    poster.id,
                    "creativity",
                    currentLanguage === "th"
                        ? "ความคิดสร้างสรรค์และความแปลกใหม่"
                        : "Creativity & Originality",
                    20,
                    scores.creativity
                )}


                ${createScoreRow(
                    poster.id,
                    "design",
                    currentLanguage === "th"
                        ? "การออกแบบและการสื่อสารผ่านภาพ"
                        : "Design & Visual Communication",
                    15,
                    scores.design
                )}


                ${createScoreRow(
                    poster.id,
                    "ai",
                    currentLanguage === "th"
                        ? "การใช้ AI / Prompt อย่างมีประสิทธิภาพ"
                        : "Effective Use of AI / Prompt",
                    10,
                    scores.ai
                )}

            </div>
        `;

        grid.appendChild(card);
    });
}

/* =========================================================
   COMMITTEE SCORING
========================================================= */

function createScoreRow(
    posterID,
    criterion,
    title,
    weight,
    currentScore
) {

    let buttons = "";

    for (let score = 0; score <= 5; score++) {

        const active =
        currentScore !== null &&
        currentScore !== undefined &&
        Number(currentScore) === score
            ? "active"
            : "";

        buttons += `
            <button
                type="button"
                class="score-option ${active}"
                onclick="setCommitteeScore(
                    '${posterID}',
                    '${criterion}',
                    ${score}
                )">
                ${score}
            </button>
        `;
    }


    return `

        <div class="score-row">

            <div class="score-row-title">

                <div>
                    ${escapeHTML(title)}
                </div>

                <span>
                    ${weight}%
                </span>

            </div>


            <div class="score-options">
                ${buttons}
            </div>

        </div>
    `;
}


function setCommitteeScore(
    posterID,
    criterion,
    score
) {

    if (!committeeScores[posterID]) {

        committeeScores[posterID] = {
            sms: null,
            clarity: null,
            creativity: null,
            design: null,
            ai: null
        };
    }


    // กดคะแนนเดิมซ้ำ = ยกเลิกคะแนน
    if (
        committeeScores[posterID][criterion]
        === score
    ) {

        committeeScores[posterID][criterion] =
            null;

    } else {

        committeeScores[posterID][criterion] =
            score;
    }


    const error =
        document.getElementById(
            "committeeVoteError"
        );

    if (error) {
        error.textContent = "";
    }


    renderCommitteePosters();
}


function calculateCommitteeScore(
    posterID
) {

    const scores =
        committeeScores[posterID];

    if (!scores) {
        return 0;
    }


    const weights = {
        sms: 30,
        clarity: 25,
        creativity: 20,
        design: 15,
        ai: 10
    };


    let total = 0;


    Object.keys(weights)
        .forEach(criterion => {

            const score =
                scores[criterion];

            if (
                score !== null &&
                score !== undefined
            ) {

                total +=
                    (score / 5) *
                    weights[criterion];
            }
        });


    return total;
}
/* =========================================================
   SUBMIT COMMITTEE SCORES
========================================================= */

async function submitCommitteeVote() {

    const error =
        document.getElementById(
            "committeeVoteError"
        );

    const posters = getPosters();

    if (error) {
        error.textContent = "";
    }

    // ตรวจว่ามี Poster
    if (posters.length === 0) {

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ยังไม่มีโปสเตอร์สำหรับให้คะแนน"
                    : "No posters are available.";
        }

        return;
    }


    // ตรวจว่าให้คะแนนครบทุก Poster
    // คะแนน 0 ถือว่าเป็นคะแนนที่ถูกต้อง
    for (const poster of posters) {

        const scores =
            committeeScores[poster.id];

        if (
            !scores ||
            scores.sms === null ||
            scores.sms === undefined ||
            scores.clarity === null ||
            scores.clarity === undefined ||
            scores.creativity === null ||
            scores.creativity === undefined ||
            scores.design === null ||
            scores.design === undefined ||
            scores.ai === null ||
            scores.ai === undefined
        ) {

            if (error) {
                error.textContent =
                    currentLanguage === "th"
                        ? `กรุณาให้คะแนน "${poster.name}" ให้ครบทั้ง 5 เกณฑ์`
                        : `Please complete all 5 criteria for "${poster.name}".`;
            }

            return;
        }
    }


    // ตรวจ Firebase
    if (
        !window.FirebaseStore ||
        typeof window.FirebaseStore.getCommitteeVotes !== "function" ||
        typeof window.FirebaseStore.saveCommitteeVote !== "function"
    ) {

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ไม่สามารถเชื่อมต่อ Firebase ได้"
                    : "Cannot connect to Firebase.";
        }

        return;
    }


   


    // โหลดคะแนนล่าสุดจาก Firebase
    try {

        firebaseCommitteeVotes =
            await window.FirebaseStore
                .getCommitteeVotes();

    } catch (firebaseError) {

        console.error(
            "Cannot load Committee votes:",
            firebaseError
        );

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ไม่สามารถเชื่อมต่อ Firebase ได้"
                    : "Cannot connect to Firebase.";
        }

        return;
    }


  

    // เก็บคะแนนของ Poster ทุกใบ
    const posterScores =
        posters.map(poster => {

            return {

                posterID:
                    poster.id,

                scores: {
                    sms:
                        committeeScores[poster.id].sms,

                    clarity:
                        committeeScores[poster.id].clarity,

                    creativity:
                        committeeScores[poster.id].creativity,

                    design:
                        committeeScores[poster.id].design,

                    ai:
                        committeeScores[poster.id].ai
                },

                totalScore:
                    Number(
                        calculateCommitteeScore(
                            poster.id
                        ).toFixed(2)
                    )
            };
        });


    // สร้างข้อมูล Vote
    const vote = {

    voteID:
        "committee_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 7),

    posterScores:
        posterScores,

    submittedAt:
        new Date().toISOString()
};

    // บันทึกลง Firebase
    try {

        await window.FirebaseStore
            .saveCommitteeVote(vote);

        firebaseCommitteeVotes.push(
            vote
        );

        console.log(
            "Committee vote saved to Firebase"
        );

    } catch (firebaseError) {

        console.error(
            "Cannot save Committee vote:",
            firebaseError
        );

        if (error) {
            error.textContent =
                currentLanguage === "th"
                    ? "ไม่สามารถบันทึกคะแนนได้ กรุณาลองอีกครั้ง"
                    : "Cannot save scores. Please try again.";
        }

        return;
    }


    // แสดงหน้า Success
    hideElement(
        "committeeVotingPage"
    );

    showElement(
        "committeeSuccessPage"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
/* =========================================================
   POSTER MODAL - OPEN / CLOSE
========================================================= */

function openPosterModal() {

    const modal =
        document.getElementById("posterModal");

    if (!modal) {
        console.error("posterModal not found");
        return;
    }

    // ล้างค่า Edit ID
    setInputValue(
        [
            "editingPosterID",
            "editPosterID",
            "posterId"
        ],
        ""
    );

    // ล้างข้อมูลในฟอร์ม
    setInputValue(
        ["posterName"],
        ""
    );

    setInputValue(
        ["posterKeywords"],
        ""
    );

    setInputValue(
        ["posterPrompt"],
        ""
    );
    setInputValue(
        ["thaiImagePath"],
        ""
    );

    setInputValue(
        ["englishImagePath"],
        ""
    );

    // ล้างรูป Preview
    thaiImageData = "";
    englishImageData = "";

    updateAdminImagePreviews();

    // เปลี่ยนหัวข้อเป็น Add New Poster
    const title =
        document.getElementById(
            "posterModalTitle"
        );

    if (title) {
        title.textContent =
            "Add New Poster";
    }

    // เปิด Modal
    modal.classList.remove("hidden");

    document.body.style.overflow =
        "hidden";
}


function closePosterModal() {

    const modal =
        document.getElementById(
            "posterModal"
        );

    if (!modal) {
        return;
    }

    // ปิด Modal
    modal.classList.add("hidden");

    document.body.style.overflow = "";

    // ล้าง Edit ID
    setInputValue(
        [
            "editingPosterID",
            "editPosterID",
            "posterId"
        ],
        ""
    );

    // ล้างข้อมูล
    setInputValue(
        ["posterName"],
        ""
    );

    setInputValue(
        ["posterKeywords"],
        ""
    );

    setInputValue(
        ["posterPrompt"],
        ""
    );

    setInputValue(
        ["thaiImagePath"],
        ""
    );

    setInputValue(
        ["englishImagePath"],
        ""
    );

    thaiImageData = "";
    englishImageData = "";

    updateAdminImagePreviews();
}


/* =========================================================
   MAKE MODAL FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.openPosterModal =
    openPosterModal;

window.closePosterModal =
    closePosterModal;
/* =========================================================
   IMAGE PATH PREVIEW
========================================================= */

function previewImagePath(type) {

    const thaiInput =
        document.getElementById(
            "thaiImagePath"
        );

    const englishInput =
        document.getElementById(
            "englishImagePath"
        );


    if (type === "thai") {

        thaiImageData =
            thaiInput
                ? thaiInput.value.trim()
                : "";

    } else {

        englishImageData =
            englishInput
                ? englishInput.value.trim()
                : "";
    }


    updateAdminImagePreviews();
}


function updateAdminImagePreviews() {

    const thaiPreview =
        document.getElementById(
            "thaiImagePreview"
        );

    const englishPreview =
        document.getElementById(
            "englishImagePreview"
        );


    if (thaiPreview) {

        thaiPreview.innerHTML =
            thaiImageData
                ? `
                    <img
                        src="${escapeHTML(thaiImageData)}"
                        alt="Thai Preview">
                  `
                : `
                    <span>
                        Thai Poster Preview
                    </span>
                  `;
    }


    if (englishPreview) {

        englishPreview.innerHTML =
            englishImageData
                ? `
                    <img
                        src="${escapeHTML(englishImageData)}"
                        alt="English Preview">
                  `
                : `
                    <span>
                        English Poster Preview
                    </span>
                  `;
    }
}


/* =========================================================
   SAVE POSTER
========================================================= */

async function savePoster() {

    const nameElement =
        document.getElementById(
            "posterName"
        );

    const safetyElement =
        document.getElementById(
            "posterKeywords"
        );

    const promptElement =
    document.getElementById("posterPrompt");

    const thaiImageElement =
        document.getElementById(
            "thaiImagePath"
        );

    const englishImageElement =
        document.getElementById(
            "englishImagePath"
        );

    const editElement =
        getFirstElement([
            "editingPosterID",
            "editPosterID",
            "posterId"
        ]);


    if (!nameElement) {
        return;
    }


    const name =
        nameElement.value.trim();

    const keywords =
        safetyElement
            ? safetyElement.value.trim()
            : "";

    const prompt =
    promptElement
        ? promptElement.value.trim()
        : "";

    const editID =
        editElement
            ? editElement.value.trim()
            : "";


    thaiImageData =
        thaiImageElement
            ? thaiImageElement.value.trim()
            : "";


    englishImageData =
        englishImageElement
            ? englishImageElement.value.trim()
            : "";


    if (!name) {

        alert(
            "Please enter Poster Name."
        );

        return;
    }


    if (!thaiImageData) {

        alert(
            "Please enter Thai Image Path."
        );

        return;
    }


    if (!englishImageData) {

        alert(
            "Please enter English Image Path."
        );

        return;
    }


    const posters =
        getPosters();


    if (editID) {

        const poster =
            posters.find(
                item =>
                    item.id === editID
            );


        if (!poster) {

            alert(
                "Poster was not found."
            );

            return;
        }


        poster.name =
            name;

        poster.keywords =
            keywords;

        poster.prompt =
            prompt;

        delete poster.thaiPrompt;
        delete poster.englishPrompt;

        poster.thaiImage =
            thaiImageData;

        poster.englishImage =
            englishImageData;

        poster.updatedAt =
            new Date().toISOString();


    } else {

        posters.push({

            id:
                "poster_" +
                Date.now(),

            name:
                name,

            thaiImage:
                thaiImageData,

            englishImage:
                englishImageData,

            keywords:
                keywords,

            prompt:
                prompt,

            createdAt:
                new Date().toISOString()
        });
    }


    try {

        await savePosters(
            posters
        );

    } catch (error) {

        return;
    }


    closePosterModal();

    refreshAdmin();
}


/* =========================================================
   EDIT POSTER
========================================================= */

function editPoster(
    posterID
) {

    const poster =
        getPosters().find(
            item =>
                item.id === posterID
        );


    if (!poster) {
        return;
    }


    setInputValue(
        [
            "editingPosterID",
            "editPosterID",
            "posterId"
        ],
        poster.id
    );


    setInputValue(
        ["posterName"],
        poster.name || ""
    );


    setInputValue(
        ["posterKeywords"],
        poster.keywords || ""
    );


    setInputValue(
        ["posterPrompt"],
        poster.prompt ||
        poster.thaiPrompt ||
        poster.englishPrompt ||
        ""
    );


    setInputValue(
        ["thaiImagePath"],
        poster.thaiImage || ""
    );


    setInputValue(
        ["englishImagePath"],
        poster.englishImage || ""
    );


    thaiImageData =
        poster.thaiImage || "";

    englishImageData =
        poster.englishImage || "";


    updateAdminImagePreviews();


    const title =
        document.getElementById(
            "posterModalTitle"
        );


    if (title) {
        title.textContent =
            "Edit Poster";
    }


    const modal =
        document.getElementById(
            "posterModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";
    }
}


/* =========================================================
   DELETE POSTER
========================================================= */

async function deletePoster(
    posterID
) {

    const poster =
        getPosters().find(
            item =>
                item.id === posterID
        );


    if (!poster) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${poster.name}"?\n\nVotes for this poster will also be removed.`
        );


    if (!confirmed) {
        return;
    }


    try {

        if (!window.FirebaseStore) {

            throw new Error(
                "Firebase is not ready"
            );
        }


        await window.FirebaseStore
            .deletePoster(
                posterID
            );


        firebasePosters =
            firebasePosters.filter(
                item =>
                    item.id !== posterID
            );


    } catch (error) {

        console.error(
            "Cannot delete poster:",
            error
        );


        alert(
            "Cannot delete Poster from Firebase."
        );

        return;
    }


    const employeeVotes =
        getEmployeeVotes();


    Object.keys(
        employeeVotes
    ).forEach(
        employeeID => {

            if (
                employeeVotes[
                    employeeID
                ].posterID === posterID
            ) {

                delete employeeVotes[
                    employeeID
                ];
            }
        }
    );


    saveEmployeeVotes(
        employeeVotes
    );


    const committeeVotes =
        getCommitteeVotes()
            .filter(
                vote =>
                    vote.posterID !==
                    posterID
            );


    saveCommitteeVotes(
        committeeVotes
    );


    refreshAdmin();
}


/* =========================================================
   EMPLOYEE POLL RESULTS
========================================================= */

function renderEmployeePollResults() {

    const container =
        document.getElementById(
            "employeePollResults"
        );


    if (!container) {
        return;
    }


    const posters =
        getPosters();

    const employeeVotes =
        getEmployeeVotes();

    const votes =
        Object.values(
            employeeVotes
        );

    const totalVotes =
        votes.length;


    container.innerHTML = `

        <div class="poll-summary-header">

            <div>

                <span class="poll-summary-label">
                    VOTING SUMMARY
                </span>

                <h3>
                    Results by Poster
                </h3>

            </div>


            <div class="poll-total-box employee">

                <strong>
                    ${totalVotes}
                </strong>

                <span>
                    Total Votes
                </span>

            </div>

        </div>


        <div
            class="poll-chart"
            id="employeePollChart">
        </div>
    `;


    const chart =
        document.getElementById(
            "employeePollChart"
        );


    if (!chart) {
        return;
    }


    posters.forEach(
        (poster, index) => {

            const voteCount =
                votes.filter(
                    vote =>
                        vote.posterID ===
                        poster.id
                ).length;


            const percentage =
                totalVotes > 0
                    ? Math.round(
                        (
                            voteCount /
                            totalVotes
                        ) * 100
                    )
                    : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "result-poster-row";


            item.innerHTML = `

                <div class="result-poster-header">

                    <div class="result-poster-name">

                        <span class="result-poster-number">
                            POSTER ${String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>
                            ${escapeHTML(
                                poster.name ||
                                "Untitled Poster"
                            )}
                        </strong>

                    </div>


                    <div class="result-poster-score">

                        <strong>
                            ${voteCount}
                            ${voteCount === 1 ? "Vote" : "Votes"}
                        </strong>

                        <span>
                            ${percentage}%
                        </span>

                    </div>

                </div>


                <div class="result-progress">

                    <div
                        class="result-progress-fill employee-result-bar"
                        style="width:${percentage}%">
                    </div>

                </div>
            `;


            chart.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   COMMITTEE POLL RESULTS
========================================================= */

function renderCommitteePollResults() {

    const container =
        document.getElementById(
            "committeePollResults"
        );

    if (!container) {
        return;
    }


    const posters =
        getPosters();

    const votes =
        getCommitteeVotes();


    container.innerHTML = `

        <div class="poll-summary-header">

            <div>

                <span class="poll-summary-label">
                    COMMITTEE SCORING SUMMARY
                </span>

                <h3>
                    Average Score by Poster
                </h3>

            </div>


            <div class="poll-total-box committee">

                <strong>
                    ${votes.length}
                </strong>

                <span>
                    Committee Submissions
                </span>

            </div>

        </div>


        <div
            class="poll-chart"
            id="committeePollChart">
        </div>
    `;


    const chart =
        document.getElementById(
            "committeePollChart"
        );

    if (!chart) {
        return;
    }


    posters.forEach(
        (poster, index) => {

            const posterResults = [];


            votes.forEach(vote => {

                if (
                    !Array.isArray(
                        vote.posterScores
                    )
                ) {
                    return;
                }


                const result =
                    vote.posterScores.find(
                        item =>
                            item.posterID ===
                            poster.id
                    );


                if (
                    result &&
                    typeof result.totalScore ===
                    "number"
                ) {

                    posterResults.push(
                        result.totalScore
                    );
                }
            });


            const average =
                posterResults.length > 0
                    ? posterResults.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    ) / posterResults.length
                    : 0;


            const averageText =
                average.toFixed(2);


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "result-poster-row";


            item.innerHTML = `

                <div class="result-poster-header">

                    <div class="result-poster-name">

                        <span class="result-poster-number committee">
                            POSTER ${String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>
                            ${escapeHTML(
                                poster.name ||
                                "Untitled Poster"
                            )}
                        </strong>

                    </div>


                    <div class="result-poster-score">

                        <strong>
                            ${averageText}%
                        </strong>

                        <span>
                            ${posterResults.length}
                            ${
                                posterResults.length === 1
                                    ? "Judge"
                                    : "Judges"
                            }
                        </span>

                    </div>

                </div>


                <div class="result-progress">

                    <div
                        class="result-progress-fill committee-result-bar"
                        style="width:${average}%">
                    </div>

                </div>

            `;


            chart.appendChild(
                item
            );
        }
    );
}
/* =========================================================
   EMPLOYEE RESULT TABLE
========================================================= */

function renderEmployeeResults() {

    const rows =
        document.getElementById("employeeResultRows");

    if (!rows) return;

    const votes = getEmployeeVotes();
    const posters = getPosters();

    rows.innerHTML = "";

    const entries =
        Object.entries(votes || {});

    if (entries.length === 0) {

        rows.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#8292a7;
                    ">
                    No Employee votes yet.
                </td>
            </tr>
        `;

        return;
    }


    entries
        .sort((a, b) =>
            new Date(b[1]?.submittedAt || 0) -
            new Date(a[1]?.submittedAt || 0)
        )
        .forEach(([employeeID, vote]) => {

            const poster =
                posters.find(
                    item =>
                        String(item.id) ===
                        String(vote.posterID)
                );

            const posterIndex =
                posters.findIndex(
                    item =>
                        String(item.id) ===
                        String(vote.posterID)
                );

            const posterNumber =
                posterIndex >= 0
                    ? `Poster ${String(
                        posterIndex + 1
                    ).padStart(2, "0")}`
                    : "Unknown Poster";


            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    <strong>
                        ${escapeHTML(employeeID)}
                    </strong>
                </td>

                <td>
                    <strong>
                        ${posterNumber}
                    </strong>

                    <div style="
                        margin-top:4px;
                        color:#8292a7;
                        font-size:11px;
                    ">
                        ${
                            poster
                                ? escapeHTML(
                                    poster.name ||
                                    "Untitled Poster"
                                )
                                : "Deleted Poster"
                        }
                    </div>
                </td>

                <td>
                    ${formatDate(
                        vote.submittedAt
                    )}
                </td>

                <td>
                    <button
                        type="button"
                        class="vote-delete-button"
                        onclick="deleteEmployeeVote(
                            '${employeeID}'
                        )">
                        Delete
                    </button>
                </td>
            `;

            rows.appendChild(row);
        });
}
function renderAdminPosters() {

    const container =
        document.getElementById("adminPosterGrid");

    if (!container) {
        return;
    }

    const posters = getPosters();

    container.innerHTML = "";

    if (!posters || posters.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No posters have been added yet.
            </div>
        `;

        return;
    }

    posters.forEach((poster, index) => {

        const card =
            document.createElement("div");

        card.className =
            "admin-poster-card";

        card.innerHTML = `

            <div class="admin-poster-number">
                POSTER ${String(index + 1).padStart(2, "0")}
            </div>

            <h3>
                ${escapeHTML(poster.name || "Untitled Poster")}
            </h3>

            <div class="admin-poster-images">

                <div>
                    <div class="admin-image-label">
                        THAI
                    </div>

                    ${
                        poster.thaiImage
                            ? `
                                <img
                                    src="${poster.thaiImage}"
                                    alt="Thai Poster">
                              `
                            : `
                                <div class="admin-no-image">
                                    No Thai Image
                                </div>
                              `
                    }
                </div>


                <div>
                    <div class="admin-image-label">
                        ENGLISH
                    </div>

                    ${
                        poster.englishImage
                            ? `
                                <img
                                    src="${poster.englishImage}"
                                    alt="English Poster">
                              `
                            : `
                                <div class="admin-no-image">
                                    No English Image
                                </div>
                              `
                    }
                </div>

            </div>


            <div class="admin-poster-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="editPoster('${poster.id}')">
                    Edit
                </button>

                <button
                    type="button"
                    class="danger-button"
                    onclick="deletePoster('${poster.id}')">
                    Delete
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   COMMITTEE RESULT TABLE
========================================================= */

function renderCommitteeResults() {

    const rows =
        document.getElementById("committeeResultRows");

    if (!rows) {
        return;
    }

    const posters = getPosters();
    const votes = getCommitteeVotes();

    rows.innerHTML = "";

    if (!votes || votes.length === 0) {

        rows.innerHTML = `
            <tr>
                <td colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#8292a7;
                    ">
                    No Committee scores yet.
                </td>
            </tr>
        `;

        return;
    }


    /* =========================================
       CALCULATE SCORE BY POSTER
    ========================================= */

    posters.forEach((poster, posterIndex) => {

        const results = [];

        votes.forEach(vote => {

            if (!Array.isArray(vote.posterScores)) {
                return;
            }

            const result =
                vote.posterScores.find(
                    item =>
                        String(item.posterID) ===
                        String(poster.id)
                );

            if (result) {
                results.push(result);
            }
        });


        if (results.length === 0) {
            return;
        }


        let sms = 0;
        let clarity = 0;
        let creativity = 0;
        let design = 0;
        let ai = 0;


        results.forEach(result => {

            sms += Number(
                result.scores?.sms ?? 0
            );

            clarity += Number(
                result.scores?.clarity ?? 0
            );

            creativity += Number(
                result.scores?.creativity ?? 0
            );

            design += Number(
                result.scores?.design ?? 0
            );

            ai += Number(
                result.scores?.ai ?? 0
            );
        });


        const judgeCount =
            results.length;


        /* Average /5 */

        sms /= judgeCount;
        clarity /= judgeCount;
        creativity /= judgeCount;
        design /= judgeCount;
        ai /= judgeCount;


        /* =========================================
           CONVERT TO WEIGHTED SCORE
        ========================================= */

        const smsWeighted =
            (sms / 5) * 30;

        const clarityWeighted =
            (clarity / 5) * 25;

        const creativityWeighted =
            (creativity / 5) * 20;

        const designWeighted =
            (design / 5) * 15;

        const aiWeighted =
            (ai / 5) * 10;


        const total =
            smsWeighted +
            clarityWeighted +
            creativityWeighted +
            designWeighted +
            aiWeighted;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong>
                    Poster ${String(
                        posterIndex + 1
                    ).padStart(2, "0")}
                </strong>

                <div style="
                    margin-top:4px;
                    color:#7b8798;
                    font-size:11px;
                ">
                    ${escapeHTML(
                        poster.name ||
                        "Untitled Poster"
                    )}
                </div>

            </td>


            <td>
                <strong>
                    ${smsWeighted.toFixed(2)}
                </strong>
                / 30
            </td>


            <td>
                <strong>
                    ${clarityWeighted.toFixed(2)}
                </strong>
                / 25
            </td>


            <td>
                <strong>
                    ${creativityWeighted.toFixed(2)}
                </strong>
                / 20
            </td>


            <td>
                <strong>
                    ${designWeighted.toFixed(2)}
                </strong>
                / 15
            </td>


            <td>
                <strong>
                    ${aiWeighted.toFixed(2)}
                </strong>
                / 10
            </td>


            <td>

                <strong style="
                    color:#725bd4;
                    font-size:17px;
                ">
                    ${total.toFixed(2)}
                    / 100
                </strong>

                <div style="
                    margin-top:5px;
                    color:#8a96a8;
                    font-size:10px;
                ">
                    Based on ${judgeCount}
                    ${
                        judgeCount === 1
                            ? "Judge"
                            : "Judges"
                    }
                </div>

            </td>


            <td>
                Recorded
            </td>
        `;


        rows.appendChild(row);
    });


    /* =========================================
       COMMITTEE SUBMISSIONS
    ========================================= */

    const submissionTitle =
        document.createElement("tr");


    submissionTitle.innerHTML = `

        <td
            colspan="8"
            style="
                padding-top:30px;
                padding-bottom:12px;
                border-bottom:none;
            ">

            <strong style="
                color:#0b3768;
                font-size:14px;
            ">
                COMMITTEE SUBMISSIONS
            </strong>

            <div style="
                margin-top:4px;
                color:#8292a7;
                font-size:11px;
            ">
                Individual Committee voting records
            </div>

        </td>
    `;


    rows.appendChild(
        submissionTitle
    );


    [...votes]
        .sort(
            (a, b) =>
                new Date(
                    a.submittedAt || 0
                ) -
                new Date(
                    b.submittedAt || 0
                )
        )
        .forEach((vote, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <strong>
                        Judge ${String(
                            index + 1
                        ).padStart(2, "0")}
                    </strong>

                </td>


                <td colspan="4">

                    <span style="
                        color:#60738b;
                        font-size:12px;
                    ">
                        Committee Submission
                    </span>

                </td>


                <td colspan="2">

                    ${formatDate(
                        vote.submittedAt
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="vote-delete-button"
                        onclick="deleteCommitteeVote(
                            '${vote.voteID}'
                        )">

                        Delete

                    </button>

                </td>
            `;


            rows.appendChild(row);
        });
}

/* =========================================================
   DELETE VOTES
========================================================= */

async function deleteEmployeeVote(employeeID) {

    const confirmed = confirm(
        "Delete this Employee vote?"
    );

    if (!confirmed) {
        return;
    }

    try {

        if (
            !window.FirebaseStore ||
            !window.FirebaseStore.deleteEmployeeVote
        ) {
            throw new Error(
                "Firebase deleteEmployeeVote is not available."
            );
        }

        // ลบจาก Firebase
        await window.FirebaseStore.deleteEmployeeVote(
            employeeID
        );

        // ลบออกจากข้อมูลในหน้าเว็บทันที
        delete firebaseEmployeeVotes[
            String(employeeID)
        ];

        // อัปเดต Admin Dashboard
        refreshAdmin();

        console.log(
            "Employee vote deleted:",
            employeeID
        );

    } catch (error) {

        console.error(
            "Delete Employee Vote Error:",
            error
        );

        alert(
            "Cannot delete Employee vote. Please try again."
        );
    }
}

window.deleteEmployeeVote =
    deleteEmployeeVote;
async function deleteCommitteeVote(voteID) {

    const confirmed = confirm(
        "Delete this Committee vote?"
    );

    if (!confirmed) {
        return;
    }

    try {

        if (
            !window.FirebaseStore ||
            !window.FirebaseStore.deleteCommitteeVote
        ) {
            throw new Error(
                "Firebase deleteCommitteeVote is not available."
            );
        }

        // ลบจาก Firebase
        await window.FirebaseStore.deleteCommitteeVote(
            voteID
        );

        // ลบออกจากข้อมูลในหน้าเว็บทันที
        firebaseCommitteeVotes =
            firebaseCommitteeVotes.filter(
                vote =>
                    String(vote.voteID) !==
                    String(voteID)
            );

        // อัปเดต Admin Dashboard
        refreshAdmin();

        console.log(
            "Committee vote deleted:",
            voteID
        );

    } catch (error) {

        console.error(
            "Delete Committee Vote Error:",
            error
        );

        alert(
            "Cannot delete Committee vote. Please try again."
        );
    }
}

window.deleteCommitteeVote =
    deleteCommitteeVote;

/* =========================================================
   RESET VOTES
========================================================= */

function resetEmployeeVotes() {

    const votes =
        getEmployeeVotes();


    const count =
        Object.keys(
            votes
        ).length;


    if (count === 0) {

        alert(
            "There are no Employee votes."
        );

        return;
    }


    const confirmed =
        confirm(
            `Reset all ${count} Employee votes?\n\nAll Employee IDs will be able to vote again.`
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "smsday_employee_votes"
    );


    refreshAdmin();
}


function resetCommitteeVotes() {

    const votes =
        getCommitteeVotes();


    const count =
        votes.length;


    if (count === 0) {

        alert(
            "There are no Committee votes."
        );

        return;
    }


    const confirmed =
        confirm(
            `Reset all ${count} Committee votes?`
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "smsday_committee_votes"
    );


    localStorage.removeItem(
        "smsday_committee_device_token"
    );


    refreshAdmin();
}


/* =========================================================
   ADMIN TABS
========================================================= */

async function showAdminTab(
    tabName,
    button
) {

    document
        .querySelectorAll(".admin-section")
        .forEach(section =>
            section.classList.add("hidden")
        );

    document
        .querySelectorAll(".admin-tab")
        .forEach(tab =>
            tab.classList.remove("active")
        );

    if (button) {
        button.classList.add("active");
    }


    if (tabName === "posters") {

        showElement(
            "adminPostersSection"
        );
    }


    if (tabName === "employee") {

        showElement(
            "adminEmployeeSection"
        );
    }


    if (tabName === "committee") {

        showElement(
            "adminCommitteeSection"
        );

        /* โหลดคะแนน Committee ล่าสุดจาก Firebase */
        if (
            window.FirebaseStore &&
            typeof window.FirebaseStore.getCommitteeVotes === "function"
        ) {

            try {

                firebaseCommitteeVotes =
                    await window.FirebaseStore
                        .getCommitteeVotes();

                console.log(
                    "Latest Committee Votes:",
                    firebaseCommitteeVotes
                );

            } catch (error) {

                console.error(
                    "Cannot load Committee votes:",
                    error
                );
            }
        }
    }


    refreshAdmin();
}


/* =========================================================
   REFRESH ADMIN
========================================================= */

function refreshAdmin() {

    const posters =
        getPosters();

    const employeeVotes =
        getEmployeeVotes();

    const committeeVotes =
        getCommitteeVotes();


    setText(
        "totalPosterCount",
        posters.length
    );


    setText(
        "employeeVoteCount",
        Object.keys(
            employeeVotes
        ).length
    );


    setText(
        "committeeVoteCount",
        committeeVotes.length
    );


    renderAdminPosters();

    renderEmployeePollResults();

    renderCommitteePollResults();

    renderEmployeeResults();

    renderCommitteeResults();
}


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text == null
            ? ""
            : String(text);


    return div.innerHTML;
}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    const value =
        new Date(date);


    if (
        Number.isNaN(
            value.getTime()
        )
    ) {
        return "-";
    }


    return value.toLocaleString();
}


function setText(
    id,
    text
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.textContent =
            text;
    }
}


function setHTML(
    id,
    html
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.innerHTML =
            html;
    }
}


function showElement(id) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.classList.remove(
            "hidden"
        );
    }
}


function hideElement(id) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.classList.add(
            "hidden"
        );
    }
}


function getFirstElement(ids) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const element =
            document.getElementById(
                ids[i]
            );


        if (element) {
            return element;
        }
    }


    return null;
}


function setInputValue(
    ids,
    value
) {

    const element =
        getFirstElement(ids);


    if (element) {
        element.value =
            value;
    }
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

    changeLanguage(
        currentLanguage
    );

    function startFirebase() {

    // โหลด Posters
    loadPostersFromFirebase();

    // Employee Votes แบบ Real-time
    if (
        typeof window.FirebaseStore.listenEmployeeVotes === "function"
    ) {
        window.FirebaseStore.listenEmployeeVotes(
            function(votes) {

                firebaseEmployeeVotes = votes || {};

                console.log(
                    "Employee Votes Real-time:",
                    Object.keys(firebaseEmployeeVotes).length
                );

                if (
                    document.getElementById("adminDashboard")
                ) {
                    refreshAdmin();
                }
            }
        );
    }


    // Committee Votes แบบ Real-time
    if (
        typeof window.FirebaseStore.listenCommitteeVotes === "function"
    ) {
        window.FirebaseStore.listenCommitteeVotes(
            function(votes) {

                firebaseCommitteeVotes = votes || [];

                console.log(
                    "Committee Votes Real-time:",
                    firebaseCommitteeVotes.length
                );

                if (
                    document.getElementById("adminDashboard")
                ) {
                    refreshAdmin();
                }
            }
        );
    }
}


if (window.FirebaseStore) {

    startFirebase();

} else {

    window.addEventListener(
        "firebase-ready",
        startFirebase,
        { once: true }
    );
}
      const employeeInput =
            document.getElementById(
                "employeeID"
            );

        if (employeeInput) {

            employeeInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        employeeLogin();
                    }
                }
            );
        }


        const adminInput =
            document.getElementById(
                "adminCode"
            );


        if (adminInput) {

            adminInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        adminLogin();
                    }
                }
            );
        }
    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        closeImageViewer();

        closePromptViewer();


        const posterModal =
            document.getElementById(
                "posterModal"
            );


        if (
            posterModal &&
            !posterModal.classList.contains(
                "hidden"
            )
        ) {

            closePosterModal();
        }
    }
);
/* =========================================================
   AI PROMPT VIEWER
========================================================= */

function openPromptViewer(posterID) {

    const poster =
        getPosters().find(
            item => item.id === posterID
        );

    if (!poster) {
        return;
    }


    const viewer =
        document.getElementById("promptViewer");

    const title =
        document.getElementById("promptViewerTitle");

    const text =
        document.getElementById("promptViewerText");


    if (!viewer || !title || !text) {
        return;
    }


    // AI Prompt ช่องเดียว
    // รองรับข้อมูล Poster เก่าที่ยังเป็น Thai / English Prompt
    const promptText =
        poster.prompt ||
        poster.thaiPrompt ||
        poster.englishPrompt ||
        "";


    title.textContent =
        `${poster.name || "Poster"} • AI Prompt`;


    text.textContent =
        promptText ||
        (
            currentLanguage === "th"
                ? "ยังไม่มี AI Prompt สำหรับโปสเตอร์นี้"
                : "No AI Prompt is available for this poster."
        );


    viewer.classList.remove("hidden");

    document.body.style.overflow =
        "hidden";
}

function closePromptViewer() {

    const viewer =
        document.getElementById("promptViewer");

    if (!viewer) {
        return;
    }


    viewer.classList.add("hidden");

    document.body.style.overflow =
        "";
}


window.openPromptViewer =
    openPromptViewer;

window.closePromptViewer =
    closePromptViewer;
    /* =========================================================
   IMAGE VIEWER
========================================================= */

function openImageViewer(posterID, language) {

    const poster =
        getPosters().find(
            item => item.id === posterID
        );

    if (!poster) {
        return;
    }


    const viewer =
        document.getElementById("imageViewer");

    const viewerImage =
        document.getElementById("viewerImage");

    const viewerTitle =
        document.getElementById("viewerTitle");


    if (!viewer || !viewerImage) {
        return;
    }


    let imagePath = "";
    let languageName = "";


    if (language === "th") {

        imagePath =
            poster.thaiImage || "";

        languageName =
            currentLanguage === "th"
                ? "โปสเตอร์ภาษาไทย"
                : "Thai Version";

    } else {

        imagePath =
            poster.englishImage || "";

        languageName =
            currentLanguage === "th"
                ? "โปสเตอร์ภาษาอังกฤษ"
                : "English Version";
    }


    if (!imagePath) {
        return;
    }


    viewerImage.src =
        imagePath;

    viewerImage.alt =
        poster.name || "Poster";


    if (viewerTitle) {

        viewerTitle.textContent =
            `${poster.name || "Poster"} • ${languageName}`;
    }


    viewer.classList.remove("hidden");

    document.body.style.overflow =
        "hidden";
}


function closeImageViewer() {

    const viewer =
        document.getElementById("imageViewer");

    const viewerImage =
        document.getElementById("viewerImage");


    if (!viewer) {
        return;
    }


    viewer.classList.add("hidden");

    document.body.style.overflow =
        "";


    if (viewerImage) {
        viewerImage.src = "";
    }
}


window.openImageViewer =
    openImageViewer;

window.closeImageViewer =
    closeImageViewer;