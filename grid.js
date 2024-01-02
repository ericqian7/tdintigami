// layout for the grid
const layout = {
    width: 1300,
    height: 700,
    xaxis: {     title: {
      text: 'QB Passing TD in a Season',
      font: {
        family: 'Arvo',
        size: 20,
        color: 'purple'
      }
    }, fixedrange: true, hovertemplate: 'Touchdowns %{x}',mirror:true,
    ticks:'outside',
    showline:true},
    yaxis: {     title: {
      text: 'QB INT in a Season',
      font: {
        family: 'Arvo',
        size: 20,
        color: 'purple'
      }
    }, fixedrange: true,mirror:true,
    ticks:'outside',
    showline:true },
    annotations: [
      {
          x: 1, // X position of the legend
          y: 1.1, // Y position of the legend
          xref: 'paper', // Use 'paper' as a reference for x-coordinate
          yref: 'paper', // Use 'paper' as a reference for y-coordinate
          text: '* Selected to Pro Bowl, + First-Team AP All-Pro', // Your key descriptions
          showarrow: false,
          font: {
              family: 'Arial',
              size: 30,
              color: 'black'
          }
      }
  ]
};



let teamsSelected = "all";
processDataAndPlot(["", [teamsSelected], ""]);
toggleSwitch();


// read/interpret csv file. Entire program lives here to ensure csv file is properly read before displaying data.
function processDataAndPlot(filter) {
    // 56 by 43 grid (touchdown by interception).
  // Grid is to be displayed and tdint_info contains players,year,starts for each ratio
  var grid = new Array(43).fill(0).map(() => new Array(56).fill(0));
  var tdint_info = [];
  for (let i = 0; i < 43; i++) {
      tdint_info.push(Array(56).fill(""));
  }

  fetch('statigami.csv')
      .then(response => response.text())
      .then(csvData => {       
          const rows = csvData.split('\n'); // Split the CSV data into rows
          const headers = rows[0].split(',').map(header => header.trim()); // Extract column headers
          let allRows = [];
          for (let i = 1; i < rows.length; i++) { // i = 1 to skip header row
              const columns = rows[i].split(',');           
              const rowData = {};
              for (let j = 0; j < headers.length; j++) {
                  rowData[headers[j]] = columns[j]; // each header will have corresponding value, i.e rowData[player] = 'Josh Allen'
              }
              
              allRows.push(rowData);
          }
          const combinedData = combineStats(allRows); // if a player started on 2+ teams in a given year, their stats will be combined
          for (const entry of combinedData) {
            if (entry.player.includes(filter[0])) {
              if (filter[1].includes("all")) {
                // Handle the case when 'all' is selected
                grid[entry.int][entry.td] += 1;
                tdint_info[entry.int][entry.td] += entry.player + "," + entry.team + "," + entry.year + "," + entry.starts + '\n';
              } else {
                // Loop through selected teams if 'all' is not selected
                for (const selectedTeam of filter[1]) {
                  console.log(selectedTeam);
                  if (entry.team.includes(selectedTeam)) {
                    grid[entry.int][entry.td] += 1;
                    tdint_info[entry.int][entry.td] += entry.player + "," + entry.team + "," + entry.year + "," + entry.starts + '\n';
                  }
                }
              }
            }
          }
          
                      
                                  

        
          // Create data for Plotly only after processing the CSV data
          var data = [{
              z: grid,
              type: 'heatmap',
              colorscale: [
                [0, 'white'],
                [0.05, 'purple'],
                [0.1, 'blue'],
                [0.2, 'green'],
                [0.3, 'yellow'],
                [0.4, 'orange'],
                [1, 'red']
              ],
              hovertemplate: 'TD: %{x}<br>INT: %{y}<br>Players: %{z}<extra></extra>'

          }];
          var config = { displayModeBar: true};
          // Create the Plotly graph after processing CSV data
          Plotly.newPlot('plot', data, layout, config);

          var plot = document.getElementById('plot'); // Get the Plotly plot element
          plot.on('plotly_click', function(data) {
            if (data.points) {
                const clickedPoint = data.points[0];
                const rowIndex = clickedPoint.y;
                const colIndex = clickedPoint.x;
                const info = tdint_info[rowIndex][colIndex];
                if (grid[rowIndex][colIndex] > 0) {
                  
              // Split the string into individual entries
              console.log("info is " + info);
              const entries = info.split('\n');
              console.log("entries is " + entries);
              // Construct a table with each entry as a row
              let tableContent = '<table class="table"><thead><tr><th>Player Name</th><th>Team</th><th>Year</th><th>Starts</th></tr></thead><tbody>';
              for (let i = 0; i < entries.length - 1; i++) {
                const entry = entries[i];
                const [playerName, team, year, starts] = entry.split(',');
                tableContent += `<tr><td>${playerName}</td><td>${team}</td><td>${year}</td><td>${starts}</td></tr>`;
            }
            
              tableContent += '</tbody></table>';
                console.log(tableContent);
                $('#infoModal').find('.modal-body').html(tableContent);
                if (colIndex == 1) {
                  pluralTD = "Touchdown"
                }
                else {
                  pluralTD = "Touchdowns"
                }
                if (rowIndex == 1) {
                  pluralInt = "Interception"
                }
                else {
                  pluralInt = "Interceptions"
                }
                if (grid[rowIndex][colIndex] == 1) {
                  pluralPlayer= "Player"
                }
                else {
                  pluralPlayer = "Players"
                }
                $('#infoModal').find('#infoModalLabel').html(colIndex + " " +pluralTD + " and " + rowIndex + " " + pluralInt + " ("+ grid[rowIndex][colIndex] + " " + pluralPlayer + ")");

                // Show the modal
                $('#infoModal').modal('show');
              
            }
          }
        });
      })
      .catch(error => console.error('Error fetching the CSV file:', error));

  }
// Function to combine TD/INT/team/starts for same player in a given year (happens if player started on 2 teams in a season)
function combineStats(data) {
  const combinedStats = {};

  // Iterate through the data and combine TD/INT/team/starts for each player in a year
  data.forEach(entry => {
      const key = `${entry.player}_${entry.year}`; // Use a unique key for each player in each year
      if (!combinedStats[key]) {
          combinedStats[key] = { player: entry.player, team: entry.team, td: +entry.td, int: +entry.int, year: entry.year, starts: +entry.starts };
      } else {
          combinedStats[key].td += +entry.td; // use of + to ensure integer addition, not string concat.
          combinedStats[key].int += +entry.int;
          combinedStats[key].team += "/" + entry.team;
          combinedStats[key].starts += +entry.starts;
      }
  });
  // Convert the combinedStats object back to an array of objects
  return Object.values(combinedStats);
}
function toggleSwitch() {
  


  fetch('sorted_teams.csv')
  .then(response => response.text())
  .then(csvData => {
    const switchStatusPro = document.getElementById('switch1').checked;
  const switchProBowl = document.getElementById('switch2').checked;

  const filterCriteria = ['', [''], '']; // first index for probowl/all pro, second for team name, third for decade
  if (switchProBowl) {
    filterCriteria[0] += '*';
  }
  if (switchStatusPro) {
    filterCriteria[0] += '+';
  }
    const lines = csvData.split('\n');

    const dropdown = document.getElementById('carFilter');

    lines.forEach(line => {
      const teamName = line.trim();
      const option = document.createElement('option');
      option.value = teamName;
      option.textContent = teamName;
      dropdown.appendChild(option);
    });

    // Chosen.js initialization for the carFilter select element
    $(document).ready(function(){
      $('#carFilter').chosen({
        placeholder_text_multiple: "Select team(s)",
        width: "45%"
      });
      $(".search-field").css('font-size','17px');
      $(".chosen-results").css('font-size','20px');
      $(".chosen-choices").css('font-size','20px');

      $('#carFilter').on('change', function() {
        const selectedTeams = $(this).val();
        
        if (selectedTeams == null || selectedTeams.length === 0) {
          teamsSelected = "all";
        } else {
          teamsSelected = selectedTeams;
        }
        filterCriteria[1] = teamsSelected;
        console.log(teamsSelected);
        processDataAndPlot(filterCriteria);
      });
    });
    
    filterCriteria[1] = teamsSelected;
    processDataAndPlot(filterCriteria); // Call processDataAndPlot inside the click event

  })
  .catch(error => console.error('Error:', error));

  
}

