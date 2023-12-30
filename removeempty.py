# Define the path to your CSV file
file_path = 'igami.csv'  # Replace with the path to your CSV file

with open(file_path, 'r') as file:
    lines = file.readlines()

# Remove every other line starting from the second line (index 1)
modified_lines = lines[::2]

with open(file_path, 'w') as file:
    file.writelines(modified_lines)
