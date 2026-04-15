# Bug Reports

## Bug 1: Postcode lookup error recovery
- Severity: Medium
- Priority: High
- Environment: Local development, any browser
- Steps:
  1. Enter `BS1 4DJ` in postcode input.
  2. Click `Lookup address`.
  3. Observe server error.
  4. Click `Retry lookup`.
- Actual: First lookup fails with error, retry succeeds.
- Expected: Error state should clearly allow retry and preserve the entered postcode.
- Evidence: `BS1 4DJ` triggers a retry path and the lookup error state is visible.

## Bug 2: Missing manual city field still allows step progression if postcode lookup not performed
- Severity: Low
- Priority: Medium
- Environment: Local development
- Steps:
  1. Enter `EC1A 1BB` and click lookup.
  2. In the empty address state, fill `Manual address line 1` but leave the city blank.
  3. Attempt to continue.
- Actual: Continue remains disabled, but the user feedback for required manual fields is only implicit.
- Expected: The UX should show an explicit validation message for the missing city field.
- Evidence: Empty manual address path blocks progression without inline field guidance.

## Bug 3: Plasterboard option reset when switching to heavy waste
- Severity: Medium
- Priority: Medium
- Environment: Local development
- Steps:
  1. Choose `Plasterboard` and select `Full board`.
  2. Switch to `Heavy waste`.
  3. Switch back to `Plasterboard`.
- Actual: The previous plasterboard selection may not persist, causing the user to reselect.
- Expected: Previously selected plasterboard handling option should remain selected when toggling between choices.
- Evidence: State transition reveals inconsistent branch memory for plasterboard handling.
