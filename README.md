# 🦡 This Is A Jungle - Gamified Leaderboard

A fun, interactive leaderboard game where players progress as a honey badger hunting through the savanna to achieve independence!

## 🎮 Features

- **Interactive Savanna Map**: Players appear as honey badgers positioned along a winding savanna path
- **Manual Point Management**: Easy upvote (▲) / downvote (▼) buttons to adjust points
- **5 Epic Levels**:
  - 🍼 Wannabe Rato-Esquilo (0 pts)
  - 🦡 Bee and Snail Eater (100 pts)
  - 💪 Chicken and Rabbit Assassin (250 pts)
  - 👑 Rattle Snake Abuser (500 pts)
  - 🏆 Almost Chuck Norris Level (1000 pts)
- **Real-time Leaderboard**: Automatically sorts by score with color-coded indicators
- **Persistent Storage**: All changes saved in browser localStorage (no database needed!)
- **Unique Player Colors**: Each player has a distinct colored badge for easy identification
- **Responsive Design**: Works on desktop and mobile

## 🚀 GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - This Is A Jungle game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/thisisajungle.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch and root folder
   - Click Save
   - Your game will be live at: `https://YOUR_USERNAME.github.io/thisisajungle/`

## 🎯 How to Use

### Viewing the Game
1. Open the game in any browser (all users see the same data from `data.json`)
2. Hover over honey badgers to see player details
3. Watch the leaderboard rankings

### Updating Points (Admin)
1. Click ▲ to add 10 points or ▼ to subtract 10 points
2. A notification will appear with instructions
3. Open browser console (F12) to see the updated JSON
4. Copy the JSON output from the console
5. Replace the contents of `data.json` with the new JSON
6. Commit and push to GitHub:
   ```bash
   git add data.json
   git commit -m "Update player scores"
   git push
   ```
7. Refresh the page on GitHub Pages - all users will see the updated scores!

### Quick Update Workflow
```bash
# After updating scores in the browser:
git add data.json
git commit -m "Update scores - [brief description]"
git push
```

GitHub Pages typically updates within 1-2 minutes after pushing.

## 💾 Data Persistence

- **Shared State**: All users see the same data from `data.json` file
- **No Database Required**: Uses static JSON file hosted on GitHub
- **Manual Updates**: Admin updates `data.json` and pushes to GitHub to persist changes
- **Universal Access**: Any browser accessing the GitHub Pages URL sees the current state
- **Version Control**: All score changes are tracked in Git history

### Data File Structure
The `data.json` file contains:
- `lastUpdated`: ISO timestamp of last update
- `players`: Array of player objects with id, name, avatar, points, and color

## 🎨 Customization

Want to modify the game? Here's where to look:

- **Player Data**: Edit in `index.html` (search for `.player-badge`)
- **Level Names**: Edit in `script.js` (look for `LEVELS` array)
- **Point Increments**: Change the `10` in onclick handlers to any value
- **Colors**: Modify `data-color` attributes in HTML
- **Path Positions**: Adjust `PATH_CHECKPOINTS` in `script.js`

## 📁 Files

- `index.html` - Main page structure
- `styles.css` - All styling and animations
- `script.js` - Game logic and point management
- `savana.png` - Background savanna track image

## 🦡 Why Honey Badger?

Because honey badgers are fearless, relentless, and fight anything - just like your team conquering challenges!

---

Made with 💪 for team motivation and fun!
