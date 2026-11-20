ASTER RESEARCH FACILITY
Classroom escape room

GOOGLE SITES
1. Unzip the package.
2. Upload the seven HTML pages and the CSS/JS files together to the same
   directory on an HTTPS static web host that permits iframe embedding.
3. Open the hosted index.html and select a team to check the game.
4. In Google Sites, choose Pages, Add, Full page embed. Paste the hosted
   index.html URL, choose Insert, then publish the Google Site.
5. Open the published Google Site as a student would and complete a test run.
   Each team should use one browser tab for its run.

Google Sites help: https://support.google.com/sites/answer/90569

LOCAL PREVIEW
From this folder, run python3 -m http.server 8000. Open
http://localhost:8000/index.html. Keep the server running while you preview.

TEACHER EDITS
- answers.js has a row for each team. The five entries are in barrier order.
  Keep answers in quotation marks to preserve leading zeroes. The first
  barrier expects exactly four digits.
- The five stage HTML pages contain the story and answer prompts. Add any
  physical or digital task instructions above the answer form for that stage.
- Progress and the optional RESET message live in the current browser
  session. Returning to the introduction and selecting a team starts a new run.
- This static classroom game validates answers in the browser, so students
  with access to developer tools can inspect the answer file and page source.
