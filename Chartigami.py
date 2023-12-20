import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import matplotlib.colors as mcolors
import csv
td_int_list = []
csv_data = 'igami.csv'
with open(csv_data, newline='') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Extracting td and int values and converting them to integers
        td = int(row['td'])
        intrcpt = int(row['int'])
        
        # Storing td and int values as a tuple in the list
        td_int_list.append((td, intrcpt))
# Set the grid size
num_rows = 36
num_cols = 56

# Create an empty grid represented by a NumPy array
grid = np.zeros((num_rows, num_cols))  # Create a grid filled with zeros

# Mark the filled squares in the grid
print('made')
for row, col in td_int_list:
    print('col is' + str(col))
    print('row is ' + str(row))
    grid[col,row] += 1  # Mark the corresponding cell as 1 (or any other value for visualization)
colors = [(0, 'white'), (0.05, 'green'), (1, 'black')]  # Blue to White to Red
custom_cmap = mcolors.LinearSegmentedColormap.from_list('blue_to_red', colors)


# Plotting the grid using imshow
plt.figure(figsize=(200, 48))
plt.title('TDINTigami')
plt.xlabel('QB Passing TD in a Season')
plt.ylabel('QB INT in a season')
plt.xticks(np.arange(0.5, num_cols, 2), np.arange(0, num_cols, 2))
plt.yticks(np.arange(0.5, num_rows, 1), np.arange(0, num_rows, 1))
plt.ylim(num_rows, 0)
img = plt.imshow(grid, cmap=custom_cmap, origin='lower', extent=[0, num_cols, 0, num_rows], alpha=0.6)

for i in range(num_rows):
    for j in range(num_cols):
        if int(grid[i,j]) >= 1:
          print(grid[i,j])
          plt.text(j + 0.5, i + 0.5, int(grid[i, j]), ha='center', va='center', color='black', fontsize=8)

cbar = plt.colorbar(img, ticks=np.arange(grid.max() + 1), format='%d')  # Set ticks from 0 to the maximum value in the grid
cbar.set_label('Occurred')
plt.show()
