const readline = require("readline");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "notes.json");

// Load notes from the JSON file
let notes = [];

if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, "utf8");
  notes = JSON.parse(data);
}

// Save notes to the JSON file
function saveNotes() {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\n===== CLI NOTES TOOL =====");
  console.log("1. Add Note");
  console.log("2. View Notes");
  console.log("3. Delete Note");
  console.log("4. Exit");

  rl.question("Choose an option: ", (choice) => {
    if (choice === "1") {
      addNote();
    } else if (choice === "2") {
      viewNotes();
    } else if (choice === "3") {
      deleteNote();
    } else if (choice === "4") {
      console.log("Goodbye!");
      rl.close();
    } else {
      console.log("Invalid option. Try again.");
      showMenu();
    }
  });
}

function addNote() {
  rl.question("Enter your note: ", (content) => {
    const note = {
      id: Date.now(),
      content: content,
    };

    notes.push(note);
    saveNotes();

    console.log("Note added and saved successfully!");
    showMenu();
  });
}

function viewNotes() {
  if (notes.length === 0) {
    console.log("No notes available.");
  } else {
    console.log("\n--- Your Notes ---");

    notes.forEach((note, index) => {
      console.log(`${index + 1}. ${note.content}`);
    });
  }

  showMenu();
}

function deleteNote() {
  viewNotesWithoutMenu();

  if (notes.length === 0) {
    showMenu();
    return;
  }

  rl.question("Enter the note number to delete: ", (number) => {
    const index = Number(number) - 1;

    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1);
      saveNotes();

      console.log("Note deleted and saved successfully!");
    } else {
      console.log("Invalid note number.");
    }

    showMenu();
  });
}

function viewNotesWithoutMenu() {
  if (notes.length === 0) {
    console.log("No notes available.");
  } else {
    console.log("\n--- Your Notes ---");

    notes.forEach((note, index) => {
      console.log(`${index + 1}. ${note.content}`);
    });
  }
}

showMenu();