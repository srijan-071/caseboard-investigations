# Accessibility Notes

CASEBOARD should remain usable with keyboard navigation, screen readers, and reduced-motion preferences.

## Interactive controls

- Use native buttons for actions such as filtering, creating, editing, deleting, and completing cases.
- Keep aria-pressed state synchronized with the active filter.
- Provide an accessible name for icon-only controls.
- Keep focus visible when controls receive keyboard focus.

## Dialogs

The task dialog should:

- move focus into the dialog when it opens,
- provide a clear accessible title,
- keep keyboard focus inside the dialog while open,
- close on Escape when that behavior is available,
- return focus to the control that opened it when it closes.

## Dynamic content

Case counts and filtered task results use live regions where appropriate. Live announcements should communicate meaningful state changes without repeating every visual detail.

## Motion

Animations should not be required to understand or operate the task list. Where the UI supports reduced-motion preferences, honor them for transitions and animated list changes.

## Verification

For UI changes, test at least:

1. keyboard-only navigation,
2. dialog open/edit/close flow,
3. screen-reader labels for interactive controls,
4. visible focus states,
5. reduced-motion behavior.

This document is a review checklist, not a substitute for testing the rendered application.
