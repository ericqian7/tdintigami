import csv
import plotly.graph_objs as go

# Load data from the CSV file
td_int_list = []
csv_data = 'igami.csv'

with open(csv_data, newline='') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Extracting td and int values and converting them to integers
        td = int(row['td'])
        intrcpt = int(row['int'])
        name = str(row['player name'])
        team = str(row['team'])
        year = str(row['year'])
        starts = str(row['starts'])
        # Storing td and int values as a tuple in the list
        td_int_list.append((td, intrcpt, name, team, year, starts))

# Set the grid size
max_int = 36
max_td = 56

# Create an empty grid represented by a NumPy array
grid = [[0 for _ in range(max_td)] for _ in range(max_int)]

# Fill the grid
for td, intrcpt, name, team, year, starts in td_int_list:
    grid[intrcpt][td] += 1

# Create a customized colorscale
custom_colors = [
    [0, 'white'],    # Lower frequency values will be closer to white
    [0.05, 'green'], 
    [1.0, 'black'],  # Higher frequency values will be closer to dark red
]

# Create heatmap data with the customized colorscale
heatmap = go.Heatmap(
    z=grid,
    colorscale=custom_colors  # Use the customized colorscale
)
layout = go.Layout(
    title='TDINTigami',
    xaxis=dict(title='QB Passing TD in a Season'),
    yaxis=dict(title='QB INT in a season'),
)

fig = go.Figure(data=[heatmap], layout=layout)

# Plot the graph using Plotly
fig.show()
