MAXIMUM SECURITY RESEARCH FACILITY
Google Sites and QR setup

1. Unzip the package. Upload the HTML, CSS, and JavaScript files together
   to one HTTPS static host that permits embeds. Keep all files on the
   same host and in the same directory. Use a neutral host or domain if
   your GitHub username should also stay out of the embed source.

2. In Google Sites, create seven Full page embeds using Pages > + >
   Full page embed. Use these pairings:

   Google Sites page          File to embed from your static host
   Introduction               index.html
   Stage 1                    stage-1.html
   Stage 2                    stage-2.html
   Stage 3                    stage-3.html
   Stage 4                    stage-4.html
   Stage 5                    stage-5.html
   Ending                     ending.html

   Publish the Google Site. Open the published pages and copy each URL
   from your browser's address bar. Use the published view URLs.

3. Open routes.js and paste those seven Google Sites URLs into the
   corresponding entries. Upload the edited routes.js to your static
   host. The game uses Google Sites navigation once all seven entries
   are set. Until then it uses standalone links for preview.

4. Make one QR code per station using the published Google Sites URL for
   that stage. The same QR code works for all six teams. Share the
   Introduction link with students first so they can pick their team.

5. Test on the published Google Site. Choose a team, clear Stage 1, then
   open the Stage 2 Google Sites URL in a new tab in the same browser.
   Verify that your team is shown. Try Back. Next, open the same Stage 2
   URL in a fresh browser profile. It should show “No mission found on
   this device” and link to the introduction. Also check that Start,
   Back and the ending links change the top-level Google Sites page.

HOW IT PLAYS
- Correct answers show the scene and unlock the next stage. Students scan
  the next station's QR code when ready. The intro opens Stage 1 directly.
- Back goes to the previous game page without erasing progress.
- Progress is tied to one active team per browser profile. Use the same
  browser for every scan. A different device or in-app browser starts
  fresh. Clearing site data removes the saved mission. Selecting a team
  again from the introduction starts a new mission after confirmation.
- The Google Sites pages should all use the same published site origin.
  The embedded game must be allowed to use browser storage and to open
  the parent page when a student clicks Start or Back.
- In answers.js each team has its own row and each row lists its five
  answers in order. Keep the entries quoted to preserve leading zeroes.
  Stage 1 expects four digits. Answers are checked client-side.

LOCAL PREVIEW
From the unzipped folder, run python3 -m http.server 8000, then open
http://localhost:8000/index.html. Leave routes.js empty to test standalone
navigation. Open stage-2.html in a fresh browser profile to test the gate.
