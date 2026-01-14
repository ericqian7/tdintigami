// Dark mode state
let isDarkMode = false;

// Toggle dark mode function
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);

  // Update Plotly graph colors
  const plotElement = document.getElementById('plot');
  if (plotElement && plotElement.data) {
    const updates = {
      'paper_bgcolor': isDarkMode ? '#16213e' : 'rgba(0,0,0,0)',
      'plot_bgcolor': isDarkMode ? '#16213e' : 'rgba(0,0,0,0)',
    };

    const axisUpdates = {
      'xaxis.tickcolor': isDarkMode ? '#4a5568' : '#e2e8f0',
      'xaxis.tickfont.color': isDarkMode ? '#a0aec0' : '#64748b',
      'xaxis.linecolor': isDarkMode ? '#4a5568' : '#e2e8f0',
      'xaxis.gridcolor': isDarkMode ? '#2d3748' : '#f1f5f9',
      'xaxis.title.font.color': isDarkMode ? '#e2e8f0' : '#334155',
      'yaxis.tickcolor': isDarkMode ? '#4a5568' : '#e2e8f0',
      'yaxis.tickfont.color': isDarkMode ? '#a0aec0' : '#64748b',
      'yaxis.linecolor': isDarkMode ? '#4a5568' : '#e2e8f0',
      'yaxis.gridcolor': isDarkMode ? '#2d3748' : '#f1f5f9',
      'yaxis.title.font.color': isDarkMode ? '#e2e8f0' : '#334155',
      'annotations[0].font.color': isDarkMode ? '#a0aec0' : '#64748b',
      'annotations[0].bgcolor': isDarkMode ? 'rgba(22,33,62,0.9)' : 'rgba(255,255,255,0.9)',
      'annotations[0].bordercolor': isDarkMode ? '#4a5568' : '#e2e8f0',
    };

    Plotly.relayout('plot', {...updates, ...axisUpdates});
  }

  // Save preference
  localStorage.setItem('darkMode', isDarkMode);
}

// Load dark mode preference on page load
function loadDarkModePreference() {
  const savedPreference = localStorage.getItem('darkMode');
  if (savedPreference === 'true') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
  }
}

// Initialize dark mode on load
document.addEventListener('DOMContentLoaded', function() {
  loadDarkModePreference();
  // If dark mode is on, update graph after it loads
  if (isDarkMode) {
    setTimeout(() => {
      const plotElement = document.getElementById('plot');
      if (plotElement && plotElement.data) {
        toggleDarkMode();
        toggleDarkMode();
      }
    }, 1000);
  }
});

// Team name to pro-football-reference abbreviation mapping
const teamAbbreviations = {
  'Arizona Cardinals': 'crd',
  'Atlanta Falcons': 'atl',
  'Baltimore Ravens': 'rav',
  'Buffalo Bills': 'buf',
  'Buffalo Bisons': 'bff',
  'Bos/Bkn Yanks/Tigers': 'byk',
  'BostonYanks': 'byk',
  'Carolina Panthers': 'car',
  'Chicago Bears': 'chi',
  'Chicago Rockets': 'cra',
  'Cincinnati Bengals': 'cin',
  'Cleveland Browns': 'cle',
  'Cleveland Rams': 'ram',
  'Dallas Cowboys': 'dal',
  'Dallas Texans': 'kan',
  'Denver Broncos': 'den',
  'Detroit Lions': 'det',
  'Green Bay Packers': 'gnb',
  'Houston Texans': 'htx',
  'Indianapolis Colts': 'clt',
  'Jacksonville Jaguars': 'jax',
  'Kansas City Chiefs': 'kan',
  'Las Vegas Raiders': 'rai',
  'Los Angeles Chargers': 'sdg',
  'Los Angeles Dons': 'lda',
  'Los Angeles Raiders': 'rai',
  'Los Angeles Rams': 'ram',
  'Miami Dolphins': 'mia',
  'Miami Seahawks': 'msa',
  'Minnesota Vikings': 'min',
  'New England Patriots': 'nwe',
  'New Orleans Saints': 'nor',
  'New York Bulldogs': 'nyy',
  'New York Giants': 'nyg',
  'New York Jets': 'nyj',
  'New York Titans': 'nyj',
  'New York Yankees': 'naa',
  'New York Yanks': 'nyy',
  'Philadelphia Eagles': 'phi',
  'Phi/Pit Eagles/Steelers': 'phi',
  'Pittsburgh Steelers': 'pit',
  'San Francisco 49ers': 'sfo',
  'Seattle Seahawks': 'sea',
  'Tampa Bay Buccaneers': 'tam',
  'Tennessee Titans': 'oti',
  'Washington Commanders': 'was',
  'Washington Redskins': 'was',
  'Washington Football Team': 'was',
  'Oakland Raiders': 'rai',
  'San Diego Chargers': 'sdg',
  'St. Louis Rams': 'ram',
  'Houston Oilers': 'oti',
  'Tennessee Oilers': 'oti',
  'Baltimore Colts': 'clt',
  'Phoenix Cardinals': 'crd',
  'St. Louis Cardinals': 'crd',
  'Chicago Cardinals': 'crd',
  'Boston Patriots': 'nwe',
  'Boston Braves': 'was',
  'Boston Redskins': 'was'
};

// Get team URL for pro-football-reference
function getTeamUrl(teamName, year) {
  // Handle combined teams (e.g., "Carolina Panthers/Chicago Bears")
  const firstTeam = teamName.split('/')[0].trim();
  const abbr = teamAbbreviations[firstTeam];
  if (abbr) {
    return `https://www.pro-football-reference.com/teams/${abbr}/${year}.htm`;
  }
  return null;
}

// layout for the grid
let layout = {
  width: 1300,
  height: 700,
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  xaxis: {
    title: {
      text: 'Passing Touchdowns',
      font: {
        family: 'Inter, sans-serif',
        size: 16,
        color: '#334155'
      },
      standoff: 10
    },
    side: 'top',
    fixedrange: true,
    mirror: true,
    ticks: 'outside',
    tickcolor: '#e2e8f0',
    tickfont: {
      family: 'Inter, sans-serif',
      size: 11,
      color: '#64748b'
    },
    showline: true,
    linecolor: '#e2e8f0',
    gridcolor: '#f1f5f9',
    dtick: 2
  },
  yaxis: {
    title: {
      text: 'Interceptions',
      font: {
        family: 'Inter, sans-serif',
        size: 16,
        color: '#334155'
      },
      standoff: 10
    },
    fixedrange: true,
    mirror: true,
    ticks: 'outside',
    tickcolor: '#e2e8f0',
    tickfont: {
      family: 'Inter, sans-serif',
      size: 11,
      color: '#64748b'
    },
    showline: true,
    linecolor: '#e2e8f0',
    gridcolor: '#f1f5f9',
    dtick: 2,
    autorange: 'reversed'
  },
  annotations: [
    {
      x: 0.99,
      y: 0.98,
      xref: 'paper',
      yref: 'paper',
      text: '* Pro Bowl  + First-Team All-Pro',
      showarrow: false,
      font: {
        family: 'Inter, sans-serif',
        size: 12,
        color: '#64748b'
      },
      bgcolor: 'rgba(255,255,255,0.9)',
      borderpad: 6,
      bordercolor: '#e2e8f0',
      borderwidth: 1
    }
  ],
  margin: {
    l: 60,
    r: 30,
    t: 60,
    b: 30
  }
};

// 6 global variables that represent filter options. These can be modified dynamically by the user.
let teamsSelected = "all";
let startingYear = 1932;
let endingYear = 2025;
let minStarts = 1;
let playerNameSearch = "";

// Simulation state
let isSimulating = false;
let simulationInterval = null;
let simulationStartYear = 1932;
let simulationEndYear = 1932;
let simulationComplete = true; // Track if simulation finished

// Toggle simulation play/pause
function toggleSimulation() {
  const simBtn = document.getElementById('simBtn');
  const yearSlider = document.getElementById('yearSlider');
  const yearDisplay = document.getElementById('yearRangeDisplay');

  if (isSimulating) {
    // Pause simulation (keep current position)
    isSimulating = false;
    simBtn.classList.remove('playing');
    if (simulationInterval) {
      clearTimeout(simulationInterval);
      simulationInterval = null;
    }
  } else {
    // Start or resume simulation
    isSimulating = true;
    simBtn.classList.add('playing');

    // Get current slider values
    let sliderValues = [1932, 2025];
    if (yearSlider && yearSlider.noUiSlider) {
      sliderValues = yearSlider.noUiSlider.get().map(v => parseInt(v));
    }

    // Check if we need to start fresh or continue from slider position
    if (simulationComplete) {
      // Start fresh - use current slider start year, begin end year from there
      simulationStartYear = sliderValues[0];
      simulationEndYear = sliderValues[0];
      simulationComplete = false;

      // Update global variables for start
      startingYear = simulationStartYear;
      endingYear = simulationEndYear;

      // Update display
      yearDisplay.textContent = simulationStartYear + ' - ' + simulationEndYear;

      // Initial render
      const initialCriteria = getFilterCriteria();
      processDataAndPlot(initialCriteria);

      // Update slider after initial render
      requestAnimationFrame(function() {
        if (yearSlider && yearSlider.noUiSlider) {
          yearSlider.noUiSlider.set([simulationStartYear, simulationEndYear]);
        }
      });
    }
    // If not complete, just resume from current position (simulationEndYear already set)

    // Run simulation step function
    function simulationStep() {
      if (!isSimulating) return;

      simulationEndYear++;

      if (simulationEndYear > 2025) {
        // Stop at end and mark as complete for next play
        isSimulating = false;
        simBtn.classList.remove('playing');
        simulationComplete = true;
        if (simulationInterval) {
          clearTimeout(simulationInterval);
          simulationInterval = null;
        }
        return;
      }

      // Update global variables
      startingYear = simulationStartYear;
      endingYear = simulationEndYear;

      // Update display directly
      yearDisplay.textContent = simulationStartYear + ' - ' + simulationEndYear;

      // Update the graph first
      const filterCriteria = getFilterCriteria();
      processDataAndPlot(filterCriteria);

      // Update slider after graph render
      requestAnimationFrame(function() {
        if (yearSlider && yearSlider.noUiSlider && isSimulating) {
          yearSlider.noUiSlider.set([simulationStartYear, simulationEndYear]);
        }
      });

      // Schedule next step
      simulationInterval = setTimeout(simulationStep, 120);
    }

    // Start first step after a short delay
    simulationInterval = setTimeout(simulationStep, 120);
  }
}

// Helper to get current filter criteria
function getFilterCriteria() {
  const switchStatusPro = document.getElementById('allProSwitch').checked;
  const switchProBowl = document.getElementById('proBowlSwitch').checked;

  let criteria = ['', [], [startingYear, endingYear, minStarts], playerNameSearch];

  if (switchProBowl) {
    criteria[0] += '*';
  }
  if (switchStatusPro) {
    criteria[0] += '+';
  }

  criteria[1] = teamsSelected === "all" ? ["all"] : teamsSelected;

  return criteria;
}

// Reset all filters to default values
function resetAllFilters() {
  // Stop simulation if running
  if (isSimulating) {
    toggleSimulation();
  }

  // Reset global variables
  teamsSelected = "all";
  startingYear = 1932;
  endingYear = 2025;
  minStarts = 1;
  playerNameSearch = "";

  // Reset team filter (Chosen.js)
  $('#carFilter').val([]).trigger('chosen:updated').trigger('change');

  // Reset player search and trigger input event
  const playerSearchInput = document.getElementById('playerSearch');
  playerSearchInput.value = '';
  playerSearchInput.dispatchEvent(new Event('input', { bubbles: true }));

  // Reset year slider
  const yearSlider = document.getElementById('yearSlider');
  if (yearSlider && yearSlider.noUiSlider) {
    yearSlider.noUiSlider.set([1932, 2025]);
  }

  // Reset min starts (Chosen.js)
  $('#minStarts').val('1').trigger('chosen:updated').trigger('change');

  // Reset toggle switches and trigger change
  document.getElementById('proBowlSwitch').checked = false;
  document.getElementById('allProSwitch').checked = false;

  // Call toggleSwitch to ensure filterCriteria is fully reset
  toggleSwitch();
}

// Helper function to check if player name matches search term
// Returns true if first or last name starts with the search term (case-insensitive)
function playerNameMatches(playerName, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return true; // No search term, match all
  }

  // Remove Pro Bowl (*) and All-Pro (+) markers from player name
  const cleanName = playerName.replace(/[*+]/g, '').trim().toLowerCase();
  const search = searchTerm.toLowerCase().trim();

  // Check if full name starts with or contains the search term
  if (cleanName.startsWith(search) || cleanName.includes(search)) {
    return true;
  }

  // Split name into parts (handles "First Last" and "First Middle Last")
  const nameParts = cleanName.split(/\s+/);

  // Check if any name part starts with the search term
  return nameParts.some(part => part.startsWith(search));
}

let isMobile; // displays website differently if viewing on mobile

processDataAndPlot(["", [teamsSelected], [1932, 2025, minStarts], playerNameSearch]); // first variable is probowl/all pro status, fourth is player name search
toggleSwitch();
window.addEventListener('resize', handleResize);
handleResize(); // Call the function initially to check the window size on page load



// read/interpret main csv file containg players. Displays interactive grid
function processDataAndPlot(filter) {
    // 56 by 43 grid (touchdown by interception).
    // Grid is to be displayed and tdint_info contains players,year,starts for each ratio
    let grid = new Array(43).fill(0).map(() => new Array(56).fill(0));
    let tdint_info = [];
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
        let wasValidData = false;
        const nameSearchTerm = filter[3] || ""; // Get player name search term
        for (const entry of combinedData) {
            if (entry.player.includes(filter[0]) && entry.year >= filter[2][0] && entry.year <= filter[2][1] && entry.starts >= filter[2][2] && playerNameMatches(entry.player, nameSearchTerm)) {
                if (filter[1].includes("all")) {
                  // Handle the case when 'all' is selected
                  grid[entry.int][entry.td] += 1;
                  wasValidData = true;
                  tdint_info[entry.int][entry.td] += entry.player + "," + entry.team + "," + entry.year + "," + entry.starts + '\n';
                }
                else {
                    // Loop through selected teams if 'all' is not selected
                    for (const selectedTeam of filter[1]) {
                        if (entry.team.includes(selectedTeam)) {
                        wasValidData = true;
                        grid[entry.int][entry.td] += 1;
                        tdint_info[entry.int][entry.td] += entry.player + "," + entry.team + "," + entry.year + "," + entry.starts + '\n';
                        }
                    }
                }
            }
        }
                                                            
        // Create data for Plotly only after processing the CSV data
        if (wasValidData) {
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
            hovertemplate: 'TD: %{x}<br>INT: %{y}<br>Players: %{z}<extra></extra>',
            colorbar: {
              tickformat: 'd',
              tickfont: {
                family: 'Inter, sans-serif',
                size: 11,
                color: '#64748b'
              }
            }

        }];
      }
      else {
        var data = [{
          z: grid,
          type: 'heatmap',
          colorscale: [
            [0, 'white'],
          ],
          hovertemplate: 'TD: %{x}<br>INT: %{y}<br>Players: %{z}<extra></extra>',
          colorbar: {
            tickformat: 'd',
            tickfont: {
              family: 'Inter, sans-serif',
              size: 11,
              color: '#64748b'
            }
          }

      }];
      }
      let config = {
        displayModeBar: true,
        responsive: true,
        dragmode: 'pan',
        modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
        displaylogo: false
      };
      if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(navigator.userAgent))){
        isMobile = true;
        Plotly.newPlot('plot', data, layout, config);
        const outerContainer = document.getElementById('container');
        const switchContainer = document.querySelector('.switch-container');
        const plotContainer = document.getElementsByClassName("plot-container plotly")[0];
        const actualPlot = document.getElementsByClassName("user-select-none svg-container")[0];
        switchContainer.style.flexWrap = "wrap";
        plotContainer.style.width = "auto";
        actualPlot.style.padding = '0';
        actualPlot.style.marginLeft = "auto";
        actualPlot.style.marginRight = "auto";
        actualPlot.style.width = 'auto';
        actualPlot.style.overflowX = "auto";
        actualPlot.style.whiteSpace = "nowrap";
        layout.annotations[0].font.size = 10;
        layout.xaxis.dtick = 4;
        layout.yaxis.dtick = 4;
        layout.xaxis.title.font.size = 13;
        layout.yaxis.title.font.size = 13;

        

        layout.dragmode = false;
      }
      else {
        isMobile = false;
     
      Plotly.newPlot('plot', data, layout, config);
      }

        // Create the Plotly graph after processing CSV data

        const plot = document.getElementById('plot'); // Get the Plotly plot element

        // Create crosshair elements if they don't exist
        if (!document.querySelector('.crosshair-h')) {
          const crosshairH = document.createElement('div');
          crosshairH.className = 'crosshair-h';
          plot.appendChild(crosshairH);

          const crosshairV = document.createElement('div');
          crosshairV.className = 'crosshair-v';
          plot.appendChild(crosshairV);
        }

        const crosshairH = document.querySelector('.crosshair-h');
        const crosshairV = document.querySelector('.crosshair-v');

        // Get the plot area element for bounds checking
        const plotArea = plot.querySelector('.plotly .draglayer');

        // Handle mouse movement for crosshair highlight bands
        plot.addEventListener('mousemove', function(e) {
          const plotRect = plot.getBoundingClientRect();
          const svgContainer = plot.querySelector('.main-svg');
          if (!svgContainer) return;

          const mouseX = e.clientX - plotRect.left;
          const mouseY = e.clientY - plotRect.top;

          // Get the actual plot area bounds (inside axes)
          const xaxis = plot._fullLayout.xaxis;
          const yaxis = plot._fullLayout.yaxis;

          if (xaxis && yaxis) {
            const plotLeft = xaxis._offset;
            const plotRight = xaxis._offset + xaxis._length;
            const plotTop = yaxis._offset;
            const plotBottom = yaxis._offset + yaxis._length;

            // Calculate cell size based on plot dimensions and data range
            const cellWidth = xaxis._length / 56; // 56 columns for TDs
            const cellHeight = yaxis._length / 43; // 43 rows for INTs

            // Check if mouse is within plot area
            if (mouseX >= plotLeft && mouseX <= plotRight && mouseY >= plotTop && mouseY <= plotBottom) {
              crosshairH.style.display = 'block';
              crosshairV.style.display = 'block';

              // Position and size the horizontal band (full row)
              crosshairH.style.top = mouseY + 'px';
              crosshairH.style.left = plotLeft + 'px';
              crosshairH.style.width = (plotRight - plotLeft) + 'px';
              crosshairH.style.height = cellHeight + 'px';

              // Position and size the vertical band (full column)
              crosshairV.style.left = mouseX + 'px';
              crosshairV.style.top = plotTop + 'px';
              crosshairV.style.height = (plotBottom - plotTop) + 'px';
              crosshairV.style.width = cellWidth + 'px';
            } else {
              crosshairH.style.display = 'none';
              crosshairV.style.display = 'none';
            }
          }
        });

        // Hide crosshairs when mouse leaves the plot
        plot.addEventListener('mouseleave', function() {
          crosshairH.style.display = 'none';
          crosshairV.style.display = 'none';
        });

        plot.on('plotly_click', function(data) {
          if (data.points) {
              const clickedPoint = data.points[0];
              const rowIndex = clickedPoint.y;
              const colIndex = clickedPoint.x;
              const info = tdint_info[rowIndex][colIndex];
              if (grid[rowIndex][colIndex] > 0) {
                
            // Split the string into individual entries
            const entries = info.split('\n');
            // Construct a table with each entry as a row
            let tableContent = '<table class="table"><thead><tr><th>Player Name</th><th>Team</th><th>Year</th><th>Starts</th></tr></thead><tbody>';
            for (let i = 0; i < entries.length - 1; i++) {
              const entry = entries[i];
              const [playerName, team, year, starts] = entry.split(',');
              const teamUrl = getTeamUrl(team, year);
              if (teamUrl) {
                tableContent += `<tr class="clickable-row" onclick="window.open('${teamUrl}', '_blank')"><td>${playerName}</td><td>${team}</td><td>${year}</td><td>${starts}</td></tr>`;
              } else {
                tableContent += `<tr><td>${playerName}</td><td>${team}</td><td>${year}</td><td>${starts}</td></tr>`;
              }
          }
          
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
  const switchStatusPro = document.getElementById('allProSwitch').checked;
const switchProBowl = document.getElementById('proBowlSwitch').checked;

const filterCriteria = ['', [''], [], '']; // first index for probowl/all pro, second for team name, third for year/starts, fourth for player name search
if (switchProBowl) {
  filterCriteria[0] += '*';
}
if (switchStatusPro) {
  filterCriteria[0] += '+';
}
  const lines = csvData.split('\n').slice(1);

  const teamDropdown = document.getElementById('carFilter');
  const minStartsDropdown = document.getElementById('minStarts');
  const yearSlider = document.getElementById('yearSlider');

  lines.forEach(line => {
    const teamName = line.trim();
    const option = document.createElement('option');
    option.value = teamName;
    option.textContent = teamName;
    teamDropdown.appendChild(option);
  });

  for (i = 1; i <= 17; i++) {
    const minStartOption = document.createElement('option');
    minStartOption.value = i;
    minStartOption.textContent = i;
    minStartsDropdown.appendChild(minStartOption);
  }

  // Initialize year range slider if not already created
  if (yearSlider && !yearSlider.noUiSlider) {
    noUiSlider.create(yearSlider, {
      start: [1932, 2025],
      connect: true,
      step: 1,
      range: {
        'min': 1932,
        'max': 2025
      },
      format: {
        to: function(value) {
          return Math.round(value);
        },
        from: function(value) {
          return Number(value);
        }
      }
    });

    // Update display on slide (skip during simulation)
    yearSlider.noUiSlider.on('update', function(values) {
      if (!isSimulating) {
        document.getElementById('yearRangeDisplay').textContent = values[0] + ' - ' + values[1];
      }
    });

    // Throttled graph update during drag
    let lastSlideUpdate = 0;
    const slideThrottle = 100; // ms between updates while dragging

    yearSlider.noUiSlider.on('slide', function(values) {
      if (!isSimulating) {
        const now = Date.now();
        if (now - lastSlideUpdate >= slideThrottle) {
          lastSlideUpdate = now;
          startingYear = parseInt(values[0]);
          endingYear = parseInt(values[1]);
          filterCriteria[2][0] = startingYear;
          filterCriteria[2][1] = endingYear;
          processDataAndPlot(filterCriteria);
        }
      }
    });

    // Update filter on change (when user releases)
    yearSlider.noUiSlider.on('change', function(values) {
      if (!isSimulating) {
        startingYear = parseInt(values[0]);
        endingYear = parseInt(values[1]);
        filterCriteria[2][0] = startingYear;
        filterCriteria[2][1] = endingYear;
        processDataAndPlot(filterCriteria);

        // Update simulation state so it continues from here
        simulationStartYear = startingYear;
        simulationEndYear = endingYear;
        simulationComplete = false; // Allow resume from this position
      }
    });
  }

  // Chosen.js initialization for the carFilter select element
  $(document).ready(function(){
    $('#carFilter').chosen({
      placeholder_text_multiple: "Select team(s)",
      width: "280px"
    });
    $('#minStarts').chosen({
      placeholder_text: "Min. Starts",
      width: "140px"
    });
    $(".search-field").css('font-size','14px');
    $(".chosen-results").css('font-size','14px');
    $(".chosen-choices").css('font-size','14px');


    $('#carFilter').on('change', function() {
      const selectedTeams = $(this).val();

      if (selectedTeams == null || selectedTeams.length === 0) {
        teamsSelected = "all";
      } else {
        teamsSelected = selectedTeams;
      }
      filterCriteria[1] = teamsSelected;
      processDataAndPlot(filterCriteria);
    });
    $('#minStarts').on('change', function() {
      const selectedMinStarts = $(this).val();

      if (!selectedMinStarts) {
        minStarts = 1;
      } else {
        minStarts = selectedMinStarts;
      }
      filterCriteria[2][2] = minStarts;

      processDataAndPlot(filterCriteria);
    });

    // Player name search with debouncing
    let searchTimeout;
    $('#playerSearch').on('input', function() {
      clearTimeout(searchTimeout);
      const searchValue = $(this).val();

      // Debounce to avoid too many updates while typing
      searchTimeout = setTimeout(function() {
        playerNameSearch = searchValue;
        filterCriteria[3] = playerNameSearch;
        processDataAndPlot(filterCriteria);
      }, 300);
    });
  });
  filterCriteria[2][0] = startingYear;
  filterCriteria[2][1] = endingYear;
  filterCriteria[2][2] = minStarts;

  filterCriteria[1] = teamsSelected;
  filterCriteria[3] = playerNameSearch;

  processDataAndPlot(filterCriteria); // Call processDataAndPlot inside the click event

})
.catch(error => console.error('Error:', error));


}

function handleResize() {
const windowWidth = window.innerWidth;
const maxWidth = screen.availWidth;

const actualPlot = document.getElementsByClassName("user-select-none svg-container")[0];
if (windowWidth < maxWidth && isMobile == false) {
  // Window has been shrunk from the original size
  actualPlot.style.width = 'auto';
  // Perform actions specific to window being shrunk from original size
}
else if (windowWidth == maxWidth && isMobile == false) {
  actualPlot.style.width = '1300px';
  
}
}