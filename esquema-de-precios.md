Make a UI based on this Screen Printing Pricing Logic
Inputs

* `quantity` — number of pieces (integer, 1+)
* `locations[]` — array of up to 5 print locations, each with:
   * `name` — one of: front, back, left_sleeve, right_sleeve, neck_label
   * `cm2` — print area in cm² (number)
   * `colors` — number of colors (0–6, where 0 = not printed)
Constants
Quantity tiers (base fee + rate per cm², for 1 color)
Tier Quantity range Base Rate per cm² T1 1–9 10,000 7.90 T2 10–24 6,800 7.90 T3 25–49 4,740 5.50 T4 50–99 4,270 5.00 T5 100–199 3,710 4.30 T6 200–499 3,150 3.70

Colors 1 2 3 4 5 6 Factor 1.00 1.40 1.70 1.95 2.15 2.30
Rationale: each additional color = new screen + new press pass, with diminishing marginal cost (registration and press setup are amortized).
Multi-location discount (applied on total, after summing locations)
Active locations 1 2 3 4 5 Discount 0% 7% 12% 15% 17%
A location counts as "active" when `colors > 0 AND cm² > 0`.
Calculation steps

```
1. Determine tier from quantity → { base, rate }

2. For each location:
     if colors == 0 or cm² == 0:
         location_price = 0
     else:
         location_price = (base + rate × cm²) × color_factor[colors]

3. subtotal_per_piece = sum of all location_price values

4. active_locations = count of locations where colors > 0 AND cm² > 0

5. discount_pct = multi_location_discount[active_locations]
   discount_amount = subtotal_per_piece × discount_pct

6. final_per_piece = subtotal_per_piece − discount_amount

7. order_total = final_per_piece × quantity

```

Pseudocode

```javascript
const TIERS = [
  { min: 1,   max: 9,   base: 6800, rate: 7.9 },
  { min: 10,  max: 24,  base: 6800, rate: 7.9 },
  { min: 25,  max: 49,  base: 4740, rate: 5.5 },
  { min: 50,  max: 99,  base: 4270, rate: 5.0 },
  { min: 100, max: 199, base: 3710, rate: 4.3 },
  { min: 200, max: 499, base: 3150, rate: 3.7 },
];

const COLOR_FACTOR = [0, 1.00, 1.40, 1.70, 1.95, 2.15, 2.30];
// index 0 = not printed; index 1–6 = active color counts

const MULTI_LOC_DISCOUNT = [0, 0, 0.07, 0.12, 0.15, 0.17];
// index = number of active locations (0–5)

function quote(quantity, locations) {
  const tier = TIERS.find(t => quantity >= t.min && quantity <= t.max);

  let subtotal = 0;
  let active = 0;

  const breakdown = locations.map(loc => {
    const isActive = loc.colors > 0 && loc.cm2 > 0;
    const price = isActive
      ? (tier.base + tier.rate * loc.cm2) * COLOR_FACTOR[loc.colors]
      : 0;
    if (isActive) active++;
    subtotal += price;
    return { ...loc, price };
  });

  const discountPct = MULTI_LOC_DISCOUNT[Math.min(active, 5)];
  const discountAmount = subtotal * discountPct;
  const perPiece = subtotal - discountAmount;
  const total = perPiece * quantity;

  return {
    tier,
    breakdown,
    subtotalPerPiece: subtotal,
    activeLocations: active,
    discountPct,
    discountAmount,
    perPiece,
    quantity,
    total,
  };
}

```

Business rules

* Locations are independent: the same cm² and colors inputs apply regardless of which location it is
* Maximum 6 colors per location
* minimum order quantity of 10 pieces
* 500+ quantity: not defined — either extend with a new tier or require a custom quote


Precios base de remera

Inicio Rango	Fin Rango	Economica	Superior	Premium
10	24	30,000	45,000	90,000
24	49	28,000	42,000	84,000
50	99	26,000	39,000	78,000
100	199	22,000	33,000	66,000
200	499	18,000	27,000	54,000