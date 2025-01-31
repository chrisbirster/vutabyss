# Notes on [FSRSv5](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
default parameters:
[0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621]


## Formula

### The stability after a same-day review:
\[ S(S, G) = S \cdot e^{w_{17} \cdot (G - 3 + w_{18})} \]

---

### The initial difficulty after the first rating:
\[ D_0(G) = w_4 - e^{w_5 \cdot (G - 1)} + 1 \]

Where \( w_4 = D_0(1) \), i.e., the initial difficulty when the first rating is `Again`.

---

### Linear Damping for the new difficulty after review:
\[ \Delta D(G) = -w_6 \cdot (G - 3) \]

\[ D' = D + \Delta D \cdot \frac{10 - D}{9} \]

---

### Mean reversion target in FSRS 5:
\[ D'' = w_7 \cdot D_0(4) + (1 - w_7) \cdot D' \]

In earlier versions, \( D_0(3) \) was the target.

The other formulas are the same as FSRS-4.5.

## FSRSv4.5 Formula

### The formula of the forgetting curve:

#### The retrievability after \( t \) days since the last review:
\[ R(t, S) = \left( 1 + \text{FACTOR} \cdot \frac{t}{S} \right)^{\text{DECAY}} \]

Where \( R(t, S) = 0.9 \) when \( t = S \).

---

#### The next interval can be calculated by solving for \( t \) in the above equation after substituting the requested retention (\( r \)) in place of \( R \):
\[ I(r, S) = \frac{S}{\text{FACTOR}} \cdot \left( r^{\frac{1}{\text{DECAY}}} - 1 \right) \]

Where \( I(r, S) = S \) when \( r = 0.9 \).

---

#### In FSRS-4.5:
- \( \text{DECAY} = -0.5 \)
- \( \text{FACTOR} = \frac{19}{81} \)

