import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var : ${key}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: required("CLIENT_URL"),
  mongoUri: required("MONGO_URI"),
  pistonUri:required("PISTON_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: required("GOOGLE_CLIENT_ID"),
  resendApiKey: required("RESEND_API_KEY"),
  emailFrom: required("EMAIL_FROM"),
  geminiApiKey:required("GEMINI_API_KEY"),
  openaiApiKey:required("OPENAI_API_KEY"),
  cloudinaryCloudName: required("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: required("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: required("CLOUDINARY_API_SECRET"),
};
