import { useEffect, useMemo, useState } from 'react';
import { lookupPostcode, submitWasteSelection, fetchSkips, confirmBooking } from './api';
import type { Address, SkipOption, WasteType } from './types';
import './App.css';

type Step = 1 | 2 | 3 | 4 | 5;
type PlasterboardOption = 'bag' | 'sheet' | 'board';

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const plasterboardOptionLabels: Record<PlasterboardOption, string> = {
  bag: 'Separate bag',
  sheet: 'Sealed sheet',
  board: 'Full board',
};

function normalizePostcode(postcode: string) {
  return postcode.toUpperCase().replace(/\s+/g, '');
}

function App() {
  const [step, setStep] = useState<Step>(1);
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [manualLine1, setManualLine1] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [step2Error, setStep2Error] = useState('');
  const [step3Error, setStep3Error] = useState('');
  const [loadingSkips, setLoadingSkips] = useState(false);
  const [skipOptions, setSkipOptions] = useState<SkipOption[]>([]);
  const [selectedSkip, setSelectedSkip] = useState<SkipOption | null>(null);
  const [wasteType, setWasteType] = useState<WasteType>('general');
  const [plasterboardOption, setPlasterboardOption] = useState<PlasterboardOption | null>(null);
  const [bookingStatus, setBookingStatus] = useState<{ bookingId: string } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const postcodeValid = postcodeRegex.test(postcode.trim());

  const canProceedStep1 = useMemo(() => {
    if (!postcodeValid) return false;
    if (addresses.length > 0) return !!selectedAddressId;
    return manualLine1.trim().length > 0 && manualCity.trim().length > 0;
  }, [postcodeValid, addresses.length, selectedAddressId, manualLine1, manualCity]);

  const canProceedStep2 = useMemo(() => {
    if (wasteType === 'plasterboard') {
      return plasterboardOption !== null;
    }
    return true;
  }, [wasteType, plasterboardOption]);

  const serviceFee = selectedSkip ? 25 : 0;
  const vat = selectedSkip ? Math.round((selectedSkip.price + serviceFee) * 0.15) : 0;
  const total = selectedSkip ? selectedSkip.price + serviceFee + vat : 0;

  useEffect(() => {
    if (step === 3) {
      setStep3Error('');
      setLoadingSkips(true);
      fetchSkips(postcode, wasteType === 'heavy')
        .then((result) => {
          setSkipOptions(result.skips);
          const firstEnabled = result.skips.find((skip) => !skip.disabled) ?? null;
          setSelectedSkip((prev) => (prev && !prev.disabled ? prev : firstEnabled));
        })
        .catch((error) => setStep3Error(error.message))
        .finally(() => setLoadingSkips(false));
    }
  }, [step, postcode, wasteType]);

  const handleLookup = () => {
    setLookupError('');
    setLookupLoading(true);
    lookupPostcode(postcode)
      .then((result) => {
        setAddresses(result.addresses);
        setSelectedAddressId('');
      })
      .catch((error) => setLookupError(error.message))
      .finally(() => setLookupLoading(false));
  };

  const handleWasteSubmit = () => {
    setStep2Error('');
    submitWasteSelection({ heavyWaste: wasteType === 'heavy', plasterboard: wasteType === 'plasterboard', plasterboardOption })
      .then(() => setStep(3))
      .catch((error) => setStep2Error(error.message));
  };

  const handleConfirm = () => {
    if (!selectedSkip) return;
    setConfirmError('');
    setConfirmLoading(true);
    confirmBooking({
      postcode,
      addressId: addresses.length > 0 ? selectedAddressId : 'manual',
      heavyWaste: wasteType === 'heavy',
      plasterboard: wasteType === 'plasterboard',
      skipSize: selectedSkip.size,
      price: selectedSkip.price,
    })
      .then((result) => setBookingStatus({ bookingId: result.bookingId }))
      .catch((error) => setConfirmError(error.message))
      .finally(() => setConfirmLoading(false));
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p>Waste booking flow with deterministic fixtures and stable UI states.</p>
          <h1>Waste Booking Journey</h1>
        </div>
      </header>

      <main>
        <section className="step-card">
          <div className="step-header">
            <span>Step {step} of 4</span>
            <h2>{step === 1 ? 'Address / postcode' : step === 2 ? 'Waste selection' : step === 3 ? 'Skip size' : 'Review & confirm'}</h2>
          </div>

          {step === 1 && (
            <div className="step-body">
              <label htmlFor="postcode-input">UK postcode</label>
              <input
                id="postcode-input"
                data-testid="postcode-input"
                value={postcode}
                onChange={(event) => setPostcode(event.target.value)}
                placeholder="e.g. SW1A 1AA"
              />
              <button disabled={!postcodeValid || lookupLoading} data-testid="postcode-lookup-button" onClick={handleLookup}>
                {lookupLoading ? 'Looking up...' : 'Lookup address'}
              </button>
              {!postcodeValid && postcode.trim().length > 0 && <p className="field-error">Enter a valid UK postcode.</p>}
              {lookupError && (
                <div className="alert error" data-testid="postcode-error">
                  <p>{lookupError}</p>
                  <button onClick={handleLookup}>Retry lookup</button>
                </div>
              )}

              {addresses.length > 0 && (
                <div className="panel" data-testid="address-list">
                  <p>Found addresses for {postcode.trim().toUpperCase()}.</p>
                  <label htmlFor="address-select">Choose an address</label>
                  <select id="address-select" data-testid="address-select" value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)}>
                    <option value="">Select address</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.line1}, {address.city}
                      </option>
                    ))}
                  </select>
                  <p className="hint">Or use manual entry below if the address is not listed.</p>
                </div>
              )}

              {addresses.length === 0 && !lookupError && lookupLoading === false && postcodeValid && (
                <div className="panel empty" data-testid="empty-address-state">
                  <p>No addresses found for {postcode.trim().toUpperCase()}.</p>
                  <label htmlFor="manual-line1">Manual address line 1</label>
                  <input id="manual-line1" data-testid="manual-line1" value={manualLine1} onChange={(event) => setManualLine1(event.target.value)} placeholder="e.g. 32 Baker Street" />
                  <label htmlFor="manual-city">Town or city</label>
                  <input id="manual-city" data-testid="manual-city" value={manualCity} onChange={(event) => setManualCity(event.target.value)} placeholder="e.g. London" />
                </div>
              )}

              <div className="actions">
                <button disabled={!canProceedStep1} data-testid="step1-next" onClick={() => setStep(2)}>
                  Continue to waste type
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-body">
              <div className="radio-group" data-testid="waste-options">
                <label>
                  <input type="radio" name="waste" value="general" checked={wasteType === 'general'} onChange={() => setWasteType('general')} />
                  General waste
                </label>
                <label>
                  <input type="radio" name="waste" value="heavy" checked={wasteType === 'heavy'} onChange={() => setWasteType('heavy')} />
                  Heavy waste
                </label>
                <label>
                  <input type="radio" name="waste" value="plasterboard" checked={wasteType === 'plasterboard'} onChange={() => setWasteType('plasterboard')} />
                  Plasterboard
                </label>
              </div>

              {wasteType === 'plasterboard' && (
                <div className="panel" data-testid="plasterboard-options">
                  <p>Choose one plasterboard handling option:</p>
                  <label>
                    <input type="radio" name="plasterboardOption" value="bag" checked={plasterboardOption === 'bag'} onChange={() => setPlasterboardOption('bag')} />
                    Separate bag
                  </label>
                  <label>
                    <input type="radio" name="plasterboardOption" value="sheet" checked={plasterboardOption === 'sheet'} onChange={() => setPlasterboardOption('sheet')} />
                    Sealed sheet
                  </label>
                  <label>
                    <input type="radio" name="plasterboardOption" value="board" checked={plasterboardOption === 'board'} onChange={() => setPlasterboardOption('board')} />
                    Full board
                  </label>
                </div>
              )}

              {step2Error && <p className="alert error">{step2Error}</p>}

              <div className="actions">
                <button data-testid="step2-back" onClick={() => setStep(1)}>
                  Back
                </button>
                <button disabled={!canProceedStep2} data-testid="step2-next" onClick={handleWasteSubmit}>
                  Continue to skips
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-body">
              <p className="hint">Skip options depend on postcode and waste type. Disabled skips are unavailable.</p>
              {loadingSkips && <p data-testid="skips-loading">Loading skip options...</p>}
              {step3Error && (
                <div className="alert error">
                  <p>{step3Error}</p>
                  <button onClick={() => setStep(3)}>Retry skip lookup</button>
                </div>
              )}

              {!loadingSkips && !step3Error && (
                <div className="skip-grid" data-testid="skip-grid">
                  {skipOptions.map((skip) => (
                    <button
                      type="button"
                      key={skip.size}
                      data-testid={`skip-option-${skip.size}`}
                      className={`skip-card ${skip.disabled ? 'disabled' : selectedSkip?.size === skip.size ? 'selected' : ''}`}
                      disabled={skip.disabled}
                      onClick={() => setSelectedSkip(skip)}
                    >
                      <strong>{skip.size}</strong>
                      <span>{'\u00A3'}{skip.price}</span>
                      {skip.disabled && <span className="small">Unavailable for this selection</span>}
                    </button>
                  ))}
                </div>
              )}

              <div className="actions">
                <button data-testid="step3-back" onClick={() => setStep(2)}>
                  Back
                </button>
                <button disabled={!selectedSkip} data-testid="step3-next" onClick={() => setStep(4)}>
                  Continue to review
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-body">
              <div className="panel summary" data-testid="review-summary">
                <h3>Review booking</h3>
                <dl>
                  <dt>Postcode</dt>
                  <dd>{postcode.toUpperCase()}</dd>
                  <dt>Address</dt>
                  <dd>{addresses.length > 0 ? addresses.find((address) => address.id === selectedAddressId)?.line1 ?? '-' : `${manualLine1}, ${manualCity}`}</dd>
                  <dt>Waste type</dt>
                  <dd>
                    {wasteType === 'general'
                      ? 'General waste'
                      : wasteType === 'heavy'
                        ? 'Heavy waste'
                        : `Plasterboard (${plasterboardOption ? plasterboardOptionLabels[plasterboardOption] : ''})`}
                  </dd>
                  <dt>Skip size</dt>
                  <dd>{selectedSkip?.size}</dd>
                </dl>
              </div>

              <div className="panel price-breakdown" data-testid="price-breakdown">
                <h3>Price breakdown</h3>
                <div className="price-row"><span>Skip cost</span><span>{'\u00A3'}{selectedSkip?.price ?? 0}</span></div>
                <div className="price-row"><span>Service fee</span><span>{'\u00A3'}{serviceFee}</span></div>
                <div className="price-row"><span>VAT (15%)</span><span>{'\u00A3'}{vat}</span></div>
                <div className="price-row total"><span>Total</span><span>{'\u00A3'}{total}</span></div>
              </div>

              {confirmError && <p className="alert error">{confirmError}</p>}
              {bookingStatus ? (
                <div className="alert success" data-testid="booking-success">
                  Booking complete. Reference <strong>{bookingStatus.bookingId}</strong>.
                </div>
              ) : (
                <div className="actions">
                  <button data-testid="step4-back" onClick={() => setStep(3)}>
                    Back
                  </button>
                  <button disabled={confirmLoading} data-testid="confirm-booking" onClick={handleConfirm}>
                    {confirmLoading ? 'Confirming...' : 'Confirm booking'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
