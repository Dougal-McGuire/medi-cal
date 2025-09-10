export default function handler(req, res) {
  res.status(200).json({
    message: "Medical Calculator API",
    version: "1.0.0",
    endpoints: [
      "/api/calculators/bmi",
      "/api/calculators/bsa",
      "/api/calculators/creatinine-clearance"
    ]
  });
}