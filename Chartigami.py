import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import matplotlib.colors as mcolors
from mpl_toolkits.axes_grid1 import host_subplot
from mpl_toolkits.axes_grid1 import make_axes_locatable
import tkinter as tk
from tkinter import ttk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

import csv
"""
def toggle_grid():
    # Toggle grid based on the checkbox state
    if var.get() == 1:
        plt.grid(True)
    else:
        plt.grid(False)
    canvas.draw()  # Redraw the canvas with the updated grid state
"""
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
grid = np.zeros((max_int, max_td))  # Create a grid filled with zeros
info_with_tdint = [[[] for _ in range(max_td)] for _ in range(max_int)]

# Mark the filled squares in the grid
print('made')
for td, intrcpt, name, team, year, starts in td_int_list:
    grid[intrcpt,td] += 1  # Mark the corresponding cell as 1 (or any other value for visualization)
    info_with_tdint[int(intrcpt)][int(td)].append(name + "," + team + "," + year + "," + starts)
colors = [(0, 'white'), (0.05, 'green'), (1, 'black')]  # Blue to White to Red
custom_cmap = mcolors.LinearSegmentedColormap.from_list('blue_to_red', colors)


# Plotting the grid using imshow

plt.figure(figsize=(400, 48))
#plt.figure().set_figwidth(600)
#plt.figure().set_figheight(150)
plt.title('TDINTigami')
plt.xlabel('QB Passing TD in a Season')
plt.ylabel('QB INT in a season')
plt.xticks(np.arange(0.5, max_td, 2), np.arange(0, max_td, 2))
plt.yticks(np.arange(0.5, max_int, 1), np.arange(0, max_int, 1))
plt.ylim(max_int, 0)
img = plt.imshow(grid, cmap=custom_cmap, origin='lower', extent=[0, max_td, 0, max_int], alpha=0.6)
#plt.grid(True, which='both', color='black', linestyle='-', linewidth=0.5)

"""
fig, ax = plt.subplots()
plt.grid(True, which='both', color='black', linestyle='-', linewidth=0.5)
root = tk.Tk()
root.title("Toggle Gridlines")
var = tk.IntVar()
check = tk.Checkbutton(root, text="Gridlines", variable=var, command=toggle_grid)
check.pack()
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.draw()
canvas.get_tk_widget().pack()
root.mainloop()
"""
for i in range(max_int):
    for j in range(max_td):
        print('hey grid is' + str(grid[i,j]))
        if int(grid[i,j]) >= 1:
          plt.text(j + 0.5, i + 0.5, int(grid[i, j]), ha='center', va='center', color='black', fontsize=8)

cbar = plt.colorbar(img, ticks=np.arange(grid.max() + 1), format='%d')  # Set ticks from 0 to the maximum value in the grid
cbar.set_label('Occurred')




# Function to create a pop-up figure with associated information
def create_popup(value, associated_list):
    parsed_data = [entry.split(',') for entry in associated_list]

    # Define text content with a newline for scrollable display
    text_content = value + '\n'
    data = ['Name', 'Team', 'Year', 'Starts']  # Manually add headers
    new_data = [data] + parsed_data

    # Create a Tkinter window
    popup = tk.Tk()
    popup.title(text_content)

    # Create a Treeview widget
    tree = ttk.Treeview(popup, columns=data, show="headings")

    # Add columns
    for col in data:
        tree.heading(col, text=col)
        tree.column(col, width=100)  # Set column width

    # Add data rows
    for row in new_data:
        tree.insert("", "end", values=row)

    # Create a scrollbar
    scrollbar = ttk.Scrollbar(popup, orient=tk.VERTICAL, command=tree.yview)
    tree.configure(yscrollcommand=scrollbar.set)

    # Place Treeview and scrollbar
    tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    popup.mainloop()
# Function to handle mouse click events
def onclick(event):
    if event.xdata is not None and event.ydata is not None:
        col = int(event.xdata + 0.5)  # Get the clicked column
        row = int(event.ydata + 0.5)  # Get the clicked row
        if 0 <= row < max_int and 0 <= col < max_td and grid[row][col] > 0:
            print('col is' + str(col))
            print('row is' + str(row))
            value = str(col) + " touchdowns, " + str(row) + " interceptions"
            associated_list = info_with_tdint[row][col]
           # formatted = associated_list.replace('\\n', '\n')
            create_popup(value, associated_list)





fig = plt.gcf()
cid = fig.canvas.mpl_connect('button_press_event', onclick)



plt.show()