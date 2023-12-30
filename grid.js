// 56 by 43 grid (touchdown by interception).
// Grid is to be displayed and tdint_info contains players,year,starts for each ratio
var grid = new Array(43).fill(0).map(() => new Array(56).fill(0));
var tdint_info = [];
for (let i = 0; i < 43; i++) {
    tdint_info.push(Array(56).fill(""));
}

// layout for the grid
var layout = {
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

// read/interpret csv file. Entire program lives here to ensure csv file is properly read before displaying data.
fetch('igami.csv')
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

        for (const entry of combinedData) { // iterate through each entry
            grid[entry.int][entry.td] += 1;
               /* switch (entry.team) {
                  case "buf":
                    entry.team = "Buffalo Bills";
                    break;
                  case "mia":
                    entry.team = "Miami Dolphins";
                    break;
                  case "kan":
                    rowData.team = "Kansas City Chiefs";
                    break;
                  case "nyj":
                    rowData.team = "New York Jets";
                    break;
                    case "den":
                      rowData.team = "Denver Broncos";
                      break;
                    case "rav":
                      rowData.team = "Baltimore Ravens";
                      break;
                    case "cle":
                      rowData.team = "Cleveland Browns";
                      break;
                    case "cin":
                      rowData.team = "Cincinnati Bengals";
                      break;
                      case "pit":
                        rowData.team = "Pittsburgh Steelers";
                        break;
                        case "htx":
                          rowData.team = "Houston Texans";
                          break;
                        case "jax":
                          rowData.team = "Jacksonville Jaguars";
                          break;
                        case "dal":
                          rowData.team = "Dallas Cowboys";
                          break;
                          case "phi":
                            rowData.team = "Philadelphia Eagles";
                            break;
                          case "nyg":
                            rowData.team = "New York Giants";
                            break;
                          case "tam":
                            rowData.team = "Tampa Bay Buccaneers";
                            break;
                          case "nor":
                            rowData.team = "New Orleans Saints";
                            break;
                            case "atl":
                              rowData.team = "Atlanta Falcons";
                              break;
                              case "car":
                                rowData.team = "Carolina Panthers";
                                break;
                              case "det":
                                rowData.team = "Detroit Lions";
                                break;
                              case "min":
                                rowData.team = "Minnesota Vikings";
                                break;
                              case "gnb":
                                rowData.team = "Green Bay Packers";
                                break;
                                case "chi":
                                  rowData.team = "Chicago Bears";
                                  break;
                                  case "sfo":
                                    rowData.team = "San Francisco 49ers";
                                    break;
                                  case "sea":
                                    rowData.team = "Seattle Seahawks";
                                    break;
                                  case "gnb":
                                    rowData.team = "Green Bay Packers";
                                    break;
                                    case "chi":
                                      rowData.team = "Chicago Bears";
                                      break;                                  
                } */
            tdint_info[entry.int][entry.td] += entry.player + ","  + entry.team + "," + entry.year + "," + entry.starts + '\n'
                    

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
        var config = { displayModeBar: false};
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

    