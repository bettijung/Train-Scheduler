
// Initialize Firebase
var config = {
apiKey: "AIzaSyAqiGphnLfCessqLlqaQHVzYTDm8CkZTps",
authDomain: "train-scheduler-app-b9568.firebaseapp.com",
databaseURL: "https://train-scheduler-app-b9568.firebaseio.com",
projectId: "train-scheduler-app-b9568",
storageBucket: "",
messagingSenderId: "261979040305"
};

firebase.initializeApp(config);

const dbRef = firebase.database().ref('TrainSchedule/trains');

// =========================================================
// =========================================================

// Button for adding trains
$("#add-train-btn").click(function(event) { 
	event.preventDefault();

	const newTrain = {
    	trainName: $("#train-name-input").val().trim(),
    	destination: $("#destination-input").val().trim(),
    	direction: $("#direction-input").val().trim(),
    	firstTrainTime: moment($("#first-train-input").val().trim(), "HH:mm").format("X"),
    	frequency: $("#frequency-input").val().trim()
  	};

	dbRef.push(newTrain);
	// console.log(newTrain);
	resetInputs();
});

// =========================================================

// Firebase event for adding train to the database and a row when a user adds an entry
dbRef.on("child_added", function(childSnapshot, prevChildKey) {

	// Train Info
	const newTrain = childSnapshot.val();
	// console.log(newTrain);
  
	// Calculate the next train
		const tFrequency = $("#frequency-input").val().trim();
		const firstTime = moment($("#first-train-input").val().trim(), "HH:mm");
		const firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
		// console.log(firstTimeConverted);
		const currentTime = moment();
		// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
		const diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		// console.log("DIFFERENCE IN TIME: " + diffTime);
		const tRemainder = diffTime % tFrequency;
		// console.log(tRemainder);

		// Minute Until Train
		const tMinutesTillTrain = tFrequency - tRemainder;
		// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

		// Next Train
		const nextTrain = moment().add(tMinutesTillTrain, "minutes");
		// const nextTrainNewTime = nextTrain.format("hh:mm tt");
		// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

	newTrain.nextArrival = nextTrain;
  	console.log(newTrain.nextArrival);

	// Calculate minutes away
	newTrain.minAway = tMinutesTillTrain;
	console.log(newTrain.minAway);

	// Determine which table to put new train info in
	if (newTrain.direction === "Northbound") {
		$("#nb-train-table > tbody").append(createTrainRow(newTrain));
	}
	else {
		$("#sb-train-table > tbody").append(createTrainRow(newTrain));
	}

});

// =========================================================

// Function to add New Train row to table
function createTrainRow(tra) {
	const trow = $('<tr>');
	trow.append(`<td>${tra.trainName}</td>`)
    	.append(`<td>${tra.destination}</td>`)
    	.append(`<td>${tra.frequency}</td>`)
    	.append(`<td>${tra.nextArrival}</td>`)
    	.append(`<td>${tra.minAway}</td>`)

	return trow;
}

// =========================================================

// Function to reset form inputs
function resetInputs() {
	$("form input:not([submit])").val('');
	$("#train-name-input").focus();
}

