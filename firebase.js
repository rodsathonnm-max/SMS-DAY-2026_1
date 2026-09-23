/* =========================================================
   SMS DAY 2026 - FIREBASE
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyBN_y7TMFSU0mAGDoyz8HVdcFgGDe-1OHU",

    authDomain: "sms-day-2026.firebaseapp.com",

    projectId: "sms-day-2026",

    storageBucket: "sms-day-2026.firebasestorage.app",

    messagingSenderId: "505479014643",

    appId: "1:505479014643:web:ccf332e9aeedfad0e6af86",

    measurementId: "G-RLGV8DTKKX"
};


const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   POSTERS
========================================================= */

async function getPostersFromFirebase() {

    const snapshot =
        await getDocs(
            collection(db, "posters")
        );

    const posters = [];

    snapshot.forEach(document => {

        posters.push({
            id: document.id,
            ...document.data()
        });

    });

    return posters;
}


async function savePosterToFirebase(poster) {

    if (!poster.id) {
        throw new Error(
            "Poster ID is required"
        );
    }

    await setDoc(
        doc(
            db,
            "posters",
            String(poster.id)
        ),
        poster
    );
}


async function deletePosterFromFirebase(
    posterID
) {

    await deleteDoc(
        doc(
            db,
            "posters",
            String(posterID)
        )
    );
}


/* =========================================================
   EMPLOYEE VOTES
========================================================= */

async function getEmployeeVotesFromFirebase() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "employeeVotes"
            )
        );

    const votes = {};

    snapshot.forEach(document => {

        votes[document.id] =
            document.data();

    });

    return votes;
}


async function getEmployeeVoteFromFirebase(
    employeeID
) {

    const reference =
        doc(
            db,
            "employeeVotes",
            String(employeeID)
        );

    const snapshot =
        await getDoc(reference);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data();
}


async function saveEmployeeVoteToFirebase(
    employeeID,
    vote
) {

    await setDoc(
        doc(
            db,
            "employeeVotes",
            String(employeeID)
        ),
        vote
    );
}


async function deleteEmployeeVoteFromFirebase(
    employeeID
) {

    await deleteDoc(
        doc(
            db,
            "employeeVotes",
            String(employeeID)
        )
    );
}


/* =========================================================
   COMMITTEE VOTES
========================================================= */

async function getCommitteeVotesFromFirebase() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "committeeVotes"
            )
        );

    const votes = [];

    snapshot.forEach(document => {

        votes.push({
            voteID: document.id,
            ...document.data()
        });

    });

    return votes;
}


async function saveCommitteeVoteToFirebase(
    vote
) {

    if (!vote.voteID) {
        throw new Error(
            "Committee Vote ID is required"
        );
    }

    await setDoc(
        doc(
            db,
            "committeeVotes",
            String(vote.voteID)
        ),
        vote
    );
}


async function deleteCommitteeVoteFromFirebase(
    voteID
) {

    await deleteDoc(
        doc(
            db,
            "committeeVotes",
            String(voteID)
        )
    );
}
/* =========================================================
   REAL-TIME LISTENERS
========================================================= */

function listenEmployeeVotes(callback) {

    return onSnapshot(
        collection(db, "employeeVotes"),

        snapshot => {

            const votes = {};

            snapshot.forEach(document => {

                votes[document.id] = {
                    ...document.data()
                };

            });

            callback(votes);
        },

        error => {
            console.error(
                "Employee votes listener error:",
                error
            );
        }
    );
}


function listenCommitteeVotes(callback) {

    return onSnapshot(
        collection(db, "committeeVotes"),

        snapshot => {

            const votes = [];

            snapshot.forEach(document => {

                votes.push({
                    voteID: document.id,
                    ...document.data()
                });

            });

            callback(votes);
        },

        error => {
            console.error(
                "Committee votes listener error:",
                error
            );
        }
    );
}

/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO APP.JS
========================================================= */

window.FirebaseStore = {

    db,

    // Posters
    getPosters:
        getPostersFromFirebase,

    savePoster:
        savePosterToFirebase,

    deletePoster:
        deletePosterFromFirebase,


    // Employee Votes
    getEmployeeVotes:
        getEmployeeVotesFromFirebase,

    getEmployeeVote:
        getEmployeeVoteFromFirebase,

    saveEmployeeVote:
        saveEmployeeVoteToFirebase,

    deleteEmployeeVote:
        deleteEmployeeVoteFromFirebase,


    // Committee Votes
    getCommitteeVotes:
        getCommitteeVotesFromFirebase,

    saveCommitteeVote:
        saveCommitteeVoteToFirebase,

    deleteCommitteeVote:
        deleteCommitteeVoteFromFirebase,


    // Real-time
    listenEmployeeVotes:
        listenEmployeeVotes,

    listenCommitteeVotes:
        listenCommitteeVotes

    };


window.dispatchEvent(
    new Event("firebase-ready")
);

console.log("Firebase ready");