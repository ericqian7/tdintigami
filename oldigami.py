# Scrapes from first football season to first superbowl
# Script created after chartigami.py because I wanted to include data from the start of the NFL
# Easily modifable to scrape different data from profootballreference.com
import requests
from bs4 import BeautifulSoup
from bs4 import Comment
import time
import csv

# Set up season/team abbrs to iterate over and declare lists to be populated.
seasons = [str(season) for season in range(1932, 1966)] # From first superbowl to present day
team_abbrs = ['crd', 'atl', 'rav', 'buf', 'car', 'chi', 'cin', 'cle', 'dal', 'den', 'det', 'gnb', 'htx', 'clt', 'jax',
              'kan',
              'sdg', 'ram', 'rai', 'mia', 'min', 'nwe', 'nor', 'nyg', 'nyj', 'phi', 'pit', 'sea', 'sfo', 'tam', 'oti',
              'was', 'bkn', 'byk', 'naa', 'bba', 'bda', 'msa', 'lda', 'cra', 'bcl', 'nyy', 'dtx']
qb_name = []
pass_td = []
pass_int = []
year = []
teams = []
starts = []

# Iterate through each team in each season
for season in seasons:
    for team in team_abbrs:
      url = "https://www.pro-football-reference.com/teams/" + team + "/" + season + ".htm"
      time.sleep(4) # bypass request limit
      response = requests.get(url)
      soup = BeautifulSoup(response.text, 'html.parser')
      table = soup.find(id="all_passing")

      # Revelant data is commented out in webpage, so set up way to scrape comments
      if table:
         comments = table.find_all(string=lambda text: isinstance(text, Comment))
         comment_text = ''.join(comments)
         comment_soup = BeautifulSoup(comment_text, 'html.parser')
         comment_table = comment_soup.find('table')
         tr = comment_table.findAll('tr')
         pass_td_elements = comment_table.find_all("td", {"data-stat": "pass_td"})
         pass_int_elements = comment_table.find_all("td", {"data-stat": "pass_int"})
         player_name_elements = comment_table.find_all("td", {"data-stat": "player"})
         player_position_elements = comment_table.find_all("td", {"data-stat": "pos"})
         games_started_elements = comment_table.find_all("td", {"data-stat": "gs"})

         # populate lists for the given team in given season. Filter out non qb/non starter passings stats
         # List comprehension checks if position is "QB", then add td/int/name value
         pass_td_list = [int(td.get_text())
                    for td, position, starts in zip(pass_td_elements, player_position_elements, games_started_elements)
                    if position.get_text() == "QB" and int(starts.get_text()) > 0]
         pass_int_list = [int(interception.get_text())
                    for interception, position, starts in zip(pass_int_elements, player_position_elements, games_started_elements)
                    if position.get_text() == "QB" and int(starts.get_text()) > 0] 
         qb_name_list = [name.get_text()
                    for name, position, starts in zip(player_name_elements, player_position_elements, games_started_elements)
                    if position.get_text() == "QB" and int(starts.get_text()) > 0]
         num_starts_list = [int(starts.get_text())
                    for position, starts in zip(player_position_elements, games_started_elements)
                    if position.get_text() == "QB" and int(starts.get_text()) > 0]
         for name in qb_name_list:
            year.append(season)
            teams.append(team)
            
         # Extend list obtained from season to aggregate list.
         pass_td.extend(pass_td_list)
         pass_int.extend(pass_int_list)
         qb_name.extend(qb_name_list)
         starts.extend(num_starts_list)
      else:
         print('table not found' + season + team) # happens if team didn't exist in given season.



#print(pass_td)
#print(pass_int)
#print(qb_name)
#print(year)
#print(teams)
# Write to CSV file. Formate ex: Josh Allen, 37, 10, 2020
existing_data = []
with open('igami.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    header_skipped = False
    for row in reader:
        if not header_skipped:
            header_skipped = True
            continue  # Skip the header row
        existing_data.append(row)

with open('igami.csv', 'w') as test_file:
   csv_writer = csv.writer(test_file)
   csv_writer.writerow(['player name', 'team', 'year', 'td', 'int', 'starts'])
   for i in range (len(qb_name)):
    csv_writer.writerow([qb_name[i], teams[i], year[i], pass_td[i], pass_int[i], starts[i]])
   csv_writer.writerows(existing_data)