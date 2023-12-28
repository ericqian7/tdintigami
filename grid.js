// Your Plotly visualization code in JavaScript
var grid = new Array(36).fill(0).map(() => new Array(56).fill(0));
var tdint_info = [];
for (let i = 0; i < 36; i++) {
    tdint_info.push(Array(56).fill(""));
}var layout = {
    width: 1300,
    height: 700,
    xaxis: {     title: {
      text: 'QB Passing TD in a Season',
      font: {
        family: 'Arvo', // Set the font family
        size: 20, // Set the font size
        color: 'purple' // Set the font color
      }
    }, fixedrange: true, hovertemplate: 'Touchdowns %{x}',mirror:true,
    ticks:'outside',
    showline:true},
    yaxis: {     title: {
      text: 'QB INT in a Season',
      font: {
        family: 'Arvo', // Set the font family
        size: 20, // Set the font size
        color: 'purple' // Set the font color
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


fetch('igami.csv')
    .then(response => response.text())
    .then(csvData => {
        // Split the CSV data into rows
        const rows = csvData.split('\n');

        // Extract column headers
        const headers = rows[0].split(',').map(header => header.trim());

        // Process rows starting from index 1 (skipping the header row)
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');

            // Create an object to store data for each row
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = columns[j];
            }

            if (rowData.int !== undefined) {
                grid[rowData.int][rowData.td] += 1;
                switch (rowData.team) {
                  case "buf":
                    rowData.team = "Buffalo Bills";
                    break;
                  case "mia":
                    rowData.team = "Miami Dolphins";
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
                }
                tdint_info[rowData.int][rowData.td] += rowData.player + ","  + rowData.team + "," + rowData.year + "," + rowData.starts + '\n'
                
            }
            // Process rowData - you can log or manipulate the data here
            console.log(rowData.team);
        }

        // Create data for Plotly only after processing the CSV data
        var data = [{
            z: grid,
            type: 'heatmap',
            colorscale: [
                [0, 'white'],
                [0.05, 'purple'],
                [1, 'black']
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
                setTimeout(() => {
            // Split the string into individual entries
            const entries = info.split('\r\n').filter(entry => entry.trim() !== '');
            // Construct a table with each entry as a row
            let tableContent = '<table class="table"><thead><tr><th>Player Name</th><th>Team</th><th>Year</th><th>Starts</th></tr></thead><tbody>';
            entries.forEach(entry => {
                const [playerName, team, year, starts] = entry.split(','); // Assuming data is separated by spaces
                tableContent += `<tr><td>${playerName}</td><td>${team}</td><td>${year}</td><td>${starts}</td></tr>`;
            });
            tableContent += '</tbody></table>';

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
            }, 1000);
          }
        }
      });
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

    