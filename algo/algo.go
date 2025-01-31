package algorithm

import (
	"math"
)

// Rating corresponds to G=1..4
type Rating int

const (
	_ Rating = iota
	Again
	Hard
	Good
	Easy
)

// FSRSParams holds the 19 parameters in an array.
type FSRSParams struct {
	W [19]float64
}

// Provide a helper to load default parameters easily:
func DefaultParams() FSRSParams {
	return FSRSParams{
		W: [19]float64{
			0.40255, 1.18385, 3.173, 15.69105, 7.1949,
			0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
			1.01925, 1.9395, 0.11, 0.29605, 2.2698,
			0.2315, 2.9898, 0.51655, 0.6621,
		},
	}
}

// 1) Same-day stability:
//
// S'(S, G) = S * e^( w17 * ( (G - 3) + w18 ) )
//
// w17 => params.W[16], w18 => params.W[17]
func SameDayStability(oldS float64, grade Rating, params FSRSParams) float64 {
	w17 := params.W[16]
	w18 := params.W[17]
	exponent := w17 * (float64(grade) - 3 + w18)
	return oldS * math.Exp(exponent)
}

// 2) Initial difficulty:
//
// D0(G) = w4 - exp( w5*(G - 1) ) + 1
//
// w4 => params.W[3], w5 => params.W[4]
func InitialDifficulty(grade Rating, params FSRSParams) float64 {
	w4 := params.W[3]
	w5 := params.W[4]
	val := w4 - math.Exp(w5*(float64(grade)-1)) + 1
	// clamp [1..10]
	if val < 1 {
		val = 1
	}
	if val > 10 {
		val = 10
	}
	return val
}

// 3) Linear damping:
//
// ΔD(G) = - w6 * (G - 3)
// D' = D + ΔD * ((10 - D)/9)
//
// w6 => params.W[5]
func LinearDampingDifficulty(oldD float64, grade Rating, params FSRSParams) float64 {
	w6 := params.W[5]
	deltaD := -w6 * (float64(grade) - 3)
	dPrime := oldD + deltaD*((10-oldD)/9)
	return dPrime
}

// 4) Mean reversion:
//
// D” = w7 * D0(4) + (1 - w7)*D'
//
// w7 => params.W[6]
// D0(4) => initialDifficulty(Easy)
func MeanReversionDifficulty(dPrime float64, params FSRSParams) float64 {
	w7 := params.W[6]
	d0Easy := InitialDifficulty(Easy, params)
	dDoublePrime := w7*d0Easy + (1-w7)*dPrime

	// clamp [1..10]
	if dDoublePrime < 1 {
		dDoublePrime = 1
	}
	if dDoublePrime > 10 {
		dDoublePrime = 10
	}
	return dDoublePrime
}

// Additional: FSRS-4.5 forgetting curve
// R(t, S) = (1 + factor*(t/S))^decay
// DECAY=-0.5, FACTOR=19/81
const Decay45 = -0.5
const Factor45 = 19.0 / 81.0

func ForgettingCurve(tDays float64, S float64) float64 {
	if S < 1e-9 {
		return 0.0
	}
	x := 1.0 + Factor45*(tDays/S)
	if x < 1e-9 {
		x = 1e-9
	}
	return math.Pow(x, Decay45)
}

// NextInterval for requested retention, from FSRS 4.5
// I(r, S) = (S / factor)*( r^(1/decay) - 1 )
func NextInterval(r float64, S float64) float64 {
	val := (S / Factor45) * (math.Pow(r, 1.0/Decay45) - 1.0)
	if val < 0 {
		val = 0
	}
	return val
}

// Example "reviewCard" function that uses these pieces
func ReviewCard(
	oldS, oldD float64,
	daysSince float64,
	grade Rating,
	params FSRSParams,
	sameDay bool,
	requestedRetention float64,
) (newS, newD, R, interval float64) {

	// 1) Stability
	if sameDay {
		newS = SameDayStability(oldS, grade, params)
	} else {
		// For demonstration, if rating=Again => half the oldS, else *1.2
		if grade == Again {
			newS = oldS * 0.5
		} else {
			newS = oldS * 1.2
		}
		if newS < 0.1 {
			newS = 0.1
		}
	}

	// 2) Difficulty: linear damping + mean reversion
	dPrime := LinearDampingDifficulty(oldD, grade, params)
	newD = MeanReversionDifficulty(dPrime, params)

	// 3) Retrievability
	R = ForgettingCurve(daysSince, oldS)

	// 4) Next interval
	interval = NextInterval(requestedRetention, newS)
	if interval < 1 {
		interval = 1
	}
	return
}
