// First, create an object that corresponds to the objects stored in userData.JSON so you can use it later.
const userData = {
  date: "",
  entry1: "",
  entry2: "",
  entry3: "",
};
const dateOptions = { year: "numeric", month: "long", day: "numeric" };

// Fetches JSON from userData.JSON, then calls fillEntries with the data.
function getPriorEntries() {
  fetch("userData.JSON")
    .then((response) => response.json())
    .then(fillEntries);
}

/*
If the JSON file data has not been loaded into the sessionStorage, then it stores each prior entry in the JSON
 file as elements in an array. This array is then saved to sessionStorage. Regardless whether the data was already
 in sessionStorage, fillEntries causes the page content to be updated.
*/
function fillEntries(data) {
  let userStorage = window.sessionStorage;
  if (!userStorage.hasOwnProperty("prev_loaded")) {
    let userLogs = JSON.parse(userStorage.getItem("JSON"));
    if (userLogs === null) {
      userLogs = [];
    }
    for (item of data) {
      userLogs.push(item);
    }
    userStorage.setItem("JSON", JSON.stringify(userLogs));
    userStorage.setItem("prev_loaded", true);
  }
  fillContent(); //This should be your last line of code in this method
}

/*
Helper function that converts from a new Date() to a string: Month Day, Year. 
Month should be represented by the word (e.g., January), not the number (e.g., 1).
Refer to https://www.w3schools.com/jsref/jsref_tolocalestring.asp
use options: month and "long"
*/
function formatDate(date) {
  return date.toLocaleDateString("en-US", dateOptions);
}

/*
This method causes the page content to be updated.
Fills in the date at the top of the page.
If the sessionStorage already has an entry for today, it shows the user the entry and allows them to edit the entry.
If the sessionStorage does not have an entry for today, it allows the user to fill in an entry.
*/
function fillContent() {
  const d = new Date();
  document.getElementById("date").innerHTML = formatDate(d);

  let userStorage = window.sessionStorage;
  if (userStorage.hasOwnProperty("JSON")) {
    let userLogs = JSON.parse(userStorage.getItem("JSON"));
    if (userLogs[0]["date"] === formatDate(d)) {
      document.getElementById("noEntryInstructions").classList.add("d-none");
      document.getElementById("entryInstructions").classList.remove("d-none");
      document.getElementById("entered1gt").value = userLogs[0]["entry1"];
      document.getElementById("entered2gt").value = userLogs[0]["entry2"];
      document.getElementById("entered3gt").value = userLogs[0]["entry3"];
    } else {
      document.getElementById("noEntryInstructions").classList.remove("d-none");
      document.getElementById("entryInstructions").classList.add("d-none");
    }
  }
}

/*
This method creates an entry object (referring to the top of the program), and fills in the properties
based on whether it is a new entry. It saves this new (or modifies the existing) entry for today's date 
in sessionStorage.
If the person modified their existing entry, they get a confirmation that the entry updated and the ability 
to edit should be removed.
Regardless whether it was a new entry, postTGTs causes the page content to be updated.
*/
function postTGTs(newPost) {
  const newEntry = Object.create(userData);
  let userStorage = window.sessionStorage;
  let userLogs = JSON.parse(userStorage.getItem("JSON"));
  newEntry.date = formatDate(new Date());
  if (newPost) {
    newEntry.entry1 = document.getElementById("1gt").value;
    newEntry.entry2 = document.getElementById("2gt").value;
    newEntry.entry3 = document.getElementById("3gt").value;
  } else {
    userLogs.shift();
    newEntry.entry1 = document.getElementById("entered1gt").value;
    newEntry.entry2 = document.getElementById("entered2gt").value;
    newEntry.entry3 = document.getElementById("entered3gt").value;
    document.getElementById("updatedAlert").classList.remove("d-none");
    resetEditor();
  }
  userLogs.unshift(newEntry);
  userStorage.setItem("JSON", JSON.stringify(userLogs));
  fillContent(); //This should be your last line of code in this method
  // document.getElementById("updatedAlert").classList.add("d-none");
}

/*
This method enables a person to edit today's entry.
*/
function enableEditing() {
  document.getElementById("editEntry").disabled = false;
}

/*
This method disables a person to edit today's entry. Unsaved changes are not preserved.
*/
function resetEditor() {
  let userStorage = window.sessionStorage;
  let userLogs = JSON.parse(userStorage.getItem("JSON"));
  document.getElementById("editEntry").disabled = true;
  document.getElementById("entered1gt").value = userLogs[0]["entry1"];
  document.getElementById("entered2gt").value = userLogs[0]["entry2"];
  document.getElementById("entered3gt").value = userLogs[0]["entry3"];
  // fillContent();
}
