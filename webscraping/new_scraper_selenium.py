"""
Scrapes QB passing data for 2024 and 2025 seasons from pro-football-reference.com
Uses Selenium to avoid 403 errors
Outputs to new_statigami.csv with format: player,team,year,td,int,starts
Player names include * for Pro Bowl and + for First-Team All-Pro
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time
import csv
import random

try:
    from webdriver_manager.chrome import ChromeDriverManager
    USE_WEBDRIVER_MANAGER = True
except ImportError:
    USE_WEBDRIVER_MANAGER = False

# Current NFL team abbreviations (32 teams)
team_abbrs = [
    'crd',  # Arizona Cardinals
    'atl',  # Atlanta Falcons
    'rav',  # Baltimore Ravens
    'buf',  # Buffalo Bills
    'car',  # Carolina Panthers
    'chi',  # Chicago Bears
    'cin',  # Cincinnati Bengals
    'cle',  # Cleveland Browns
    'dal',  # Dallas Cowboys
    'den',  # Denver Broncos
    'det',  # Detroit Lions
    'gnb',  # Green Bay Packers
    'htx',  # Houston Texans
    'clt',  # Indianapolis Colts
    'jax',  # Jacksonville Jaguars
    'kan',  # Kansas City Chiefs
    'sdg',  # Los Angeles Chargers
    'ram',  # Los Angeles Rams
    'rai',  # Las Vegas Raiders
    'mia',  # Miami Dolphins
    'min',  # Minnesota Vikings
    'nwe',  # New England Patriots
    'nor',  # New Orleans Saints
    'nyg',  # New York Giants
    'nyj',  # New York Jets
    'phi',  # Philadelphia Eagles
    'pit',  # Pittsburgh Steelers
    'sea',  # Seattle Seahawks
    'sfo',  # San Francisco 49ers
    'tam',  # Tampa Bay Buccaneers
    'oti',  # Tennessee Titans
    'was',  # Washington Commanders
]

# Years to scrape
seasons = ['2024', '2025']


def setup_driver():
    """Set up Chrome driver with options."""
    options = Options()
    # Run in headless mode (no visible browser window)
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    if USE_WEBDRIVER_MANAGER:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    return driver


def get_team_name(soup):
    """Extract full team name from the page."""
    target_div = soup.find('div', {'data-template': 'Partials/Teams/Summary'})
    if target_div:
        spans = target_div.find_all('span')
        if len(spans) >= 2:
            return spans[1].get_text().strip()

    # Fallback: try h1
    h1 = soup.find('h1')
    if h1:
        text = h1.get_text().strip()
        for season in seasons:
            text = text.replace(season, '').strip()
        text = text.replace('Statistics', '').strip()
        return text

    return "Unknown Team"


def parse_awards(awards_text):
    """Parse awards text to return suffix for player name."""
    suffix = ""
    if awards_text:
        awards_lower = awards_text.lower()
        if 'pb' in awards_lower or 'pro bowl' in awards_lower:
            suffix += '*'
        if 'ap1' in awards_lower or '1st' in awards_lower:
            suffix += '+'
    return suffix


def scrape_team_season(driver, team_abbr, season):
    """Scrape QB data for a single team and season."""
    url = f"https://www.pro-football-reference.com/teams/{team_abbr}/{season}.htm"
    print(f"Scraping: {url}")

    try:
        driver.get(url)

        # Wait for page to load
        time.sleep(random.uniform(2, 4))

        # Get page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Get team name
        team_name = get_team_name(soup)
        print(f"  Team: {team_name}")

        # Find the passing table
        passing_table = soup.find('table', {'id': 'passing'})

        if not passing_table:
            wrapper = soup.find('div', {'id': 'all_passing'})
            if wrapper:
                passing_table = wrapper.find('table', {'id': 'passing'})

        if not passing_table:
            print(f"  No passing table found")
            return []

        tbody = passing_table.find('tbody')
        if not tbody:
            print(f"  No tbody found")
            return []

        rows = tbody.find_all('tr')
        results = []

        for row in rows:
            if 'thead' in row.get('class', []):
                continue

            # Get position
            pos_cell = row.find('td', {'data-stat': 'pos'})
            if not pos_cell:
                continue
            position = pos_cell.get_text().strip()

            if position != 'QB':
                continue

            # Get games started
            gs_cell = row.find('td', {'data-stat': 'games_started'})
            if not gs_cell:
                continue

            try:
                games_started = int(gs_cell.get_text().strip())
            except ValueError:
                games_started = 0

            if games_started < 1:
                continue

            # Get player name
            name_cell = row.find('td', {'data-stat': 'name_display'})
            if not name_cell:
                continue

            name_link = name_cell.find('a')
            player_name = name_link.get_text().strip() if name_link else name_cell.get_text().strip()

            # Get passing TDs
            td_cell = row.find('td', {'data-stat': 'pass_td'})
            try:
                pass_td = int(td_cell.get_text().strip()) if td_cell else 0
            except ValueError:
                pass_td = 0

            # Get interceptions
            int_cell = row.find('td', {'data-stat': 'pass_int'})
            try:
                pass_int = int(int_cell.get_text().strip()) if int_cell else 0
            except ValueError:
                pass_int = 0

            # Get awards
            awards_cell = row.find('td', {'data-stat': 'awards'})
            awards_text = awards_cell.get_text().strip() if awards_cell else ""
            awards_suffix = parse_awards(awards_text)

            full_name = player_name + awards_suffix

            results.append({
                'player': full_name,
                'team': team_name,
                'year': season,
                'td': pass_td,
                'int': pass_int,
                'starts': games_started
            })

            print(f"    Found: {full_name} - {pass_td} TD, {pass_int} INT, {games_started} starts")

        return results

    except Exception as e:
        print(f"  Error: {e}")
        return []


def main():
    print("Starting Selenium scraper...")
    driver = setup_driver()

    all_data = []

    try:
        # Warm up - visit homepage first
        print("Warming up - visiting homepage...")
        driver.get("https://www.pro-football-reference.com/")
        time.sleep(5)

        for season in seasons:
            print(f"\n=== Scraping {season} season ===\n")

            for team_abbr in team_abbrs:
                # Random delay between requests
                delay = random.uniform(3, 6)
                time.sleep(delay)

                data = scrape_team_season(driver, team_abbr, season)
                all_data.extend(data)

    finally:
        driver.quit()

    # Write to CSV
    output_file = 'new_statigami.csv'
    print(f"\n=== Writing {len(all_data)} records to {output_file} ===")

    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['player', 'team', 'year', 'td', 'int', 'starts'])

        for record in all_data:
            writer.writerow([
                record['player'],
                record['team'],
                record['year'],
                record['td'],
                record['int'],
                record['starts']
            ])

    print(f"Done! Wrote {len(all_data)} QB records to {output_file}")


if __name__ == '__main__':
    main()
