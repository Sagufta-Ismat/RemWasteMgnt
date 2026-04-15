# Manual Test Cases

| ID | Scenario | Steps | Expected Result | Category | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Valid postcode lookup returns addresses | Enter `SW1A 1AA`, click lookup | 12+ addresses shown | Positive | Branch selection |
| 2 | Empty address result shows manual entry | Enter `EC1A 1BB`, click lookup | Empty state shows manual address fields | Edge | Empty state |
| 3 | Postcode validation rejects invalid format | Enter `1234`, click lookup | Validation error displayed | Negative | Input validation |
| 4 | Retry after BS1 4DJ server error | Enter `BS1 4DJ`, lookup fails, retry | Second attempt succeeds | API failure | State transition |
| 5 | Simulated latency on M1 1AE | Enter `M1 1AE`, lookup | Loading indicator shown until response | Edge | Latency state |
| 6 | Select manual address after empty lookup | `EC1A 1BB` empty, fill manual fields, continue | Progress to waste selection | Positive | Manual address entry |
| 7 | General waste path without plasterboard | Choose general waste | Continue to skip selection | Positive | Branching |
| 8 | Heavy waste path with disabled skips | Choose heavy waste | At least 2 skip options disabled | Positive | Disabled logic |
| 9 | Plasterboard path shows three options | Choose plasterboard | Three handling options appear | Positive | Branching |
| 10 | Block next when plasterboard option missing | Choose plasterboard, do not select option | Next button disabled | Negative | Input state |
| 11 | Skip selection disabled button state | Show skip list | Disabled skip cards are unclickable | Positive | Disabled state |
| 12 | Skip options load with mixed enabled/disabled | After waste selection | 8 skip options shown | Positive | Richness gate |
| 13 | Price breakdown calculates correctly | Select skip and review | Skip price, fee, VAT, total shown | Positive | Review summary |
| 14 | Prevent double submit on booking | Click confirm twice quickly | Only one request allowed | Edge | UI state |
| 15 | Review displays manual address if used | Use manual address path | Manual address shown in summary | Positive | Review content |
| 16 | Return to previous step from skip selection | In step 3 click back | Returns to waste selection | State transition | Navigation |
| 17 | Return to previous step from waste selection | In step 2 click back | Returns to postcode step | State transition | Navigation |
| 18 | Error retry button works for postcode lookup | Force `BS1 4DJ`, retry | Error dismisses and result loads | API failure | Retry state |
| 19 | Error uses accessible message region | Error message visible | Error text announced visually | Edge | Accessibility |
| 20 | Step 1 cannot proceed without address | `SW1A 1AA` no selection | Continue disabled | Negative | Input requirement |
| 21 | Step 2 cannot proceed if plasterboard option missing | Choose plasterboard, no option | Continue disabled | Negative | Validation |
| 22 | Step 3 cannot proceed without skip selection | Skip not selected | Next disabled | Negative | Input requirement |
| 23 | Invalid skip data route rejected | Manipulate query string | API returns error | API failure | Back-end validation |
| 24 | Confirm button disabled while submitting | Click confirm | Button changes to loading state | Edge | Double submit prevention |
| 25 | Address lookup preserves postcode formatting | Enter lowercase postcode | Normalized search works | Edge | Normalization |
| 26 | Heavy waste disables at least 2 skip sizes | Choose heavy waste | Disabled skip cards count >= 2 | Functional | Richness gate |
| 27 | Plasterboard review text includes option | Select plasterboard bag | Review mentions bag | Positive | Summary accuracy |
| 28 | Postcode input persists on back navigation | Go back from waste step | Postcode remains filled | State transition | UX |
| 29 | Skip fetch error message appears | Force skip endpoint failure | Error shown and retry offered | API failure | Error state |
| 30 | Booking confirmation returns reference | Confirm booking | `BK-12345` shown | Positive | Success state |
| 31 | Manual city field required for manual address | `EC1A 1BB` manual line1 only | Continue disabled | Negative | Input requirement |
| 32 | Manual address path can submit booking | Empty postcode result, enter manual address, book | Booking success | Positive | Full path |
| 33 | Loading state present for postcode lookup | Lookup on `M1 1AE` | Loading text appears | Edge | Loading state |
| 34 | Review page uses actual price values | Selected skip 4-yard | Total matches breakdown | Positive | Price accuracy |
| 35 | UI shows disabled skip visibility clearly | Disabled skip item label visible | Unavailable label shown | Positive | UX evidence |
