document.addEventListener("DOMContentLoaded", function() {
  var socket = io();
  let characterIndex = 0; // index to control the character display
  let latestLabels = { wheel1: "", wheel2: "" };
  let received = { wheel1: false, wheel2: false };

  // for the background label animations
  const labelsPerRow = Math.ceil(window.innerWidth / 200) + 1;
  const labelsContainer = document.getElementById('labelsContainer');
  const container = document.getElementById('backgroundLabelsContainer');

  // initialize with default text
  const defaultLabel = document.createElement('div');
  defaultLabel.classList.add('label');
  defaultLabel.textContent = "Who are you when no one's around?";
  labelsContainer.appendChild(defaultLabel);

  // socket event listener for wheel 1
  socket.on('Wheel1', function(data) {
      latestLabels.wheel1 = data.focusedLabel1; // receives newest socket data of label
      received.wheel1 = true;
      if (received.wheel1 && received.wheel2) {
          updateLabels();
          received.wheel1 = false;
          received.wheel2 = false;
      }
      // updating background labels as well based on socket data of label
      if (latestLabels.wheel1 && latestLabels.wheel2) {
        updateBackgroundLabels(latestLabels.wheel1, latestLabels.wheel2);
      }
  });

  // socket event listener for wheel 2
  socket.on('Wheel2', function(data) {
      latestLabels.wheel2 = data.label.focusedLabel2; // receives newest socket data of label
      received.wheel2 = true;
      if (received.wheel1 && received.wheel2) {
          updateLabels();
          received.wheel1 = false;
          received.wheel2 = false;
      } 

      // updating text colours of the labels based on socket data
      if (labelsContainer) {
        console.log("Updating color to:", data.color); // Debug color update
        Array.from(labelsContainer.getElementsByClassName('label')).forEach(label => {
          label.style.color = data.color;
        }); 
      }

      //   if (backgroundLabelsContainer) {
      //     let backgroundLabelColor = data.color === "#04cdf5" ? "#06135c7e" : "#5c06177e";
      //     // let backgroundLabels = backgroundLabelsContainer.getElementsByClassName('backgroundLabel');
      //     // for (let q = 0; q < backgroundLabels.length(); i++) {
      //     //   backgroundLabels[i].style.color = backgroundLabelColor;
      //     // }
      //     // backgroundLabelsContainer.getElementsByClassName('backgroundLabel').forEach((backgroundLabel) => {
      //     //     backgroundLabel.style.color = backgroundLabelColor;
      //     // });
      // }

      // updating background labels as well based on socket data of label
      if (latestLabels.wheel1 && latestLabels.wheel2) {
        updateBackgroundLabels(latestLabels.wheel1, latestLabels.wheel2);
      }
  });


  // update labels in the labelsContainer HTML id element
  function updateLabels() {
    // change 'label' class to 'secondarylabel'
    Array.from(labelsContainer.getElementsByClassName('label')).forEach(label => {
      label.classList.remove('label');
      label.classList.add('secondarylabel');
    });
  
    // create new primary label element from the new incoming labels
    const labelElement = document.createElement('div');
    labelElement.classList.add('label');
    labelElement.textContent = `${latestLabels.wheel1} ${latestLabels.wheel2},`;
  
    // insert new label at the beginning of the container
    labelsContainer.insertBefore(labelElement, labelsContainer.firstChild);
  
    // limit to 4 labels in container at a time
    while (labelsContainer.childNodes.length > 4) {
      labelsContainer.removeChild(labelsContainer.lastChild);
    }
  }
  
  // background labels 
  function updateBackgroundLabels(wheel1Label, wheel2Label) {
    container.innerHTML = ''; // clear existing labels
  
    // new labels 
    const newLabel = `${wheel1Label} ${wheel2Label}`;
    const totalRows = 50;
  
    // populate container with labels
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < labelsPerRow; col++) {
        const labelElement = document.createElement('div');
        labelElement.classList.add('backgroundLabel');
        labelElement.textContent = newLabel;
        labelElement.style.opacity = '0'; // initially hide the text
        container.appendChild(labelElement);
      }
    }
  }

  // animating the background labels
  function animateLabels() {
    const labels = document.querySelectorAll('.backgroundLabel');
    if (labels.length === 0) {
      console.error('No labels found for animation.');
      return;
    }
  
    // iterating over every label
    labels.forEach((label, index) => {
      const adjustedIndex = index % labelsPerRow; // index within the current row
  
      // show character if index is within the current character index
      if (adjustedIndex === characterIndex) {
        label.style.opacity = '1';
      } else {
        label.style.opacity = '0';
      }
    });

    // increment to ensure index loops around all labels in row
    characterIndex = (characterIndex + 1) % labelsPerRow; 
  }
  
  // call animateLabels every 200ms to update the labels
  setInterval(animateLabels, 200);
});

// for fullscreening HTML
document.getElementById('fullscreen').addEventListener('click', function() {
  if (!document.fullscreenElement) {
    // if not currently in fullscreen, enter it
    document.documentElement.requestFullscreen().catch((err) => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    // if we are in fullscreen, exit it
    document.exitFullscreen();
  }
});
