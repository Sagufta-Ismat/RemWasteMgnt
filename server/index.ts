import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface Address {
  id: string;
  line1: string;
  city: string;
}

const addressFixtures: Record<string, Address[]> = {
  'SW1A 1AA': Array.from({ length: 12 }).map((_, index) => ({
    id: `addr_${index + 1}`,
    line1: `${10 + index} Downing Street`,
    city: 'London',
  })),
  'EC1A 1BB': [],
};

const bsRetryState: Record<string, number> = {};

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

const simulateLatency = (postcode: string) => {
  return postcode.toUpperCase().replace(/\s+/g, '') === 'M11AE';
};

app.post('/api/postcode/lookup', async (req: Request, res: Response) => {
  const postcodeRaw = String(req.body?.postcode || '').trim();
  const postcode = postcodeRaw.toUpperCase();

  if (!postcode || !postcodeRegex.test(postcode)) {
    return res.status(400).json({ error: 'Invalid UK postcode format' });
  }

  if (postcode.replace(/\s+/g, '') === 'BS14DJ') {
    const attempts = bsRetryState[postcode] ?? 0;
    bsRetryState[postcode] = attempts + 1;
    if (attempts === 0) {
      return res.status(500).json({ error: 'Server error, please retry' });
    }
  }

  const sendResult = () => {
    const addresses = addressFixtures[postcode] ?? [];
    return res.json({ postcode: postcodeRaw, addresses });
  };

  if (simulateLatency(postcode)) {
    return setTimeout(sendResult, 1400);
  }

  return sendResult();
});

app.post('/api/waste-types', (req: Request, res: Response) => {
  const { heavyWaste, plasterboard, plasterboardOption } = req.body;
  if (typeof heavyWaste !== 'boolean' || typeof plasterboard !== 'boolean') {
    return res.status(400).json({ error: 'Invalid waste type payload' });
  }
  if (plasterboard && !plasterboardOption) {
    return res.status(400).json({ error: 'Plasterboard option required' });
  }
  return res.json({ ok: true });
});

app.get('/api/skips', (req: Request, res: Response) => {
  const postcode = String(req.query.postcode || '');
  const heavyWaste = String(req.query.heavyWaste || 'false') === 'true';

  const sizeList = [
    { size: '4-yard', price: 120 },
    { size: '6-yard', price: 145 },
    { size: '8-yard', price: 175 },
    { size: '10-yard', price: 200 },
    { size: '12-yard', price: 245 },
    { size: '14-yard', price: 280 },
    { size: '16-yard', price: 320 },
    { size: '20-yard', price: 395 },
  ];

  const skips = sizeList.map((item) => ({
    size: item.size,
    price: item.price,
    disabled:
      (!heavyWaste && ['14-yard', '20-yard'].includes(item.size)) ||
      (heavyWaste && ['12-yard', '16-yard'].includes(item.size)),
  }));

  const normalizedPostcode = postcode.toUpperCase().replace(/\s+/g, '');
  if (!postcodeRegex.test(normalizedPostcode.replace(/(.{1,4})(.+)/, '$1 $2'))) {
    return res.status(400).json({ error: 'Invalid postcode query' });
  }

  return res.json({ skips });
});

app.post('/api/booking/confirm', (req: Request, res: Response) => {
  const { postcode, addressId, heavyWaste, plasterboard, skipSize, price } = req.body;

  if (!postcode || !skipSize || typeof price !== 'number') {
    return res.status(400).json({ error: 'Missing booking fields' });
  }
  if (!addressId) {
    return res.status(400).json({ error: 'Address is required' });
  }
  return res.json({ status: 'success', bookingId: 'BK-12345' });
});

const clientPath = path.join(process.cwd(), 'dist');
app.use(express.static(clientPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const port = Number(process.env.PORT || 4174);
app.listen(port, () => {
  console.log(`Booking flow server listening on http://localhost:${port}`);
});
