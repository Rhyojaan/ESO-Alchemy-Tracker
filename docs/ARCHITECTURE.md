# Project Codename Architecture v1

## Purpose

Project Codename is the long-term ESO companion app.

The Alchemist is the first profession module.

The architecture should make it easy to add future professions, collections, and Aldren intelligence without turning the app into one giant file again.

---

## Current Stable Files

- index.html
- style.css
- script.js

These remain the working app until each piece is safely moved.

---

## Folder Structure

/assets
  Images, icons, and future visual files.

/css
  Modular style files.

/docs
  Project planning, roadmap, design decisions, and architecture notes.

/js
  Future JavaScript modules.

---

## Future JavaScript Modules

/js/data
  ESO data tables.

/js/core
  Save system, profiles, shared helpers.

/js/alchemy
  Reagents, solvents, Laboratory, planner.

/js/aldren
  Greetings, reports, recommendations, announcements.

/js/professions
  Future profession modules.

/js/collections
  Sets, motifs, recipes, furnishings, antiquities.

---

## Design Rules

1. Every commit must leave the app working.

2. Do not add empty profession tabs.

3. A profession appears only when it is usable.

4. Aldren should explain what the player can do right now.

5. The player should enter information once.

6. Profession levels determine correct material tiers.

7. Project Codename is the app umbrella name until the final name is chosen.

8. The Alchemist is the Alchemy module, not the final app name.
9. Aldren is the primary guide inside the app. He leads the player across professions, collections, motifs, recipes, and long-term goals.

10. Other systems provide data. Aldren turns that data into advice.
---

## Next Refactor Plan

1. Continue splitting CSS safely.
2. Keep script.js working until JavaScript modules are planned.
3. Split JavaScript by feature, not by random chunks.
4. Test after every small change.
5. Commit after every successful test.