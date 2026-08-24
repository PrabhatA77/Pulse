import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs:15*60*1000,
    limit:10,
    standardHeaders:true,
    legacyHeaders:false,
    message:{message:"Too many attempts. Please try again later."},
});

export const otpLimiter = rateLimit({
    windowMs:10*60*1000,
    limit:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:{message:"Too many OTP requests. Please try again later."}
});

// Covers the "Run" button — hit frequently while iterating on code,
// so it's looser than submit/analyze, but still capped to stop someone
// from hammering the Piston sandbox.
export const executeLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many run requests. Please slow down and try again shortly." },
});

// Covers "Submit" (writes an Interview doc) and "Analyze" (costs an
// OpenAI call) — tighter since these are more expensive per-request.
export const submissionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many submissions. Please try again later." },
});