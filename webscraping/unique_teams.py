import csv

# Read the original CSV file and extract unique team names
unique_teams = set()
with open('statigami.csv', 'r', newline='') as file:
    reader = csv.DictReader(file)
    for row in reader:
        unique_teams.add(row['team'])

# Convert set of unique team names to a sorted list
sorted_teams = sorted(list(unique_teams))

# Write the sorted team names to a new CSV file
with open('sorted_teams.csv', 'w', newline='') as new_file:
    writer = csv.writer(new_file)
    writer.writerow(['team'])
    for team in sorted_teams:
        writer.writerow([team])
