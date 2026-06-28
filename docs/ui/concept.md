# Golf Swing AI - UI Concept

## 1. Auth Flow
- **View**: Simple centered login/register card.
- **Interactions**: Username/Password input -> Auth API -> Dashboard.

## 2. Analysis Dashboard
- **Layout**: Three-column grid.
- **Column 1 (Video)**: 
    - Central video player.
    - Horizontal timeline at bottom with phase markers (Address, Takeaway, Top, Downswing, Impact, Followthrough).
- **Column 2 (Metrics)**: 
    - "TrackMan-style" data cards.
    - Real-time updates as video timeline scrubs.
    - Key metrics: Club Angle, Shoulder Tilt, Hip Rotation, Tempo.
- **Column 3 (AI Guidance)**: 
    - Dynamic tips panel based on detected metric deviations.
    - Suggested drills with links to instructional content.

## 3. Technical Constraints
- Nesting: Max 2 levels.
- File length: Max 600 lines.
- State: React hooks for navigation and user session.
