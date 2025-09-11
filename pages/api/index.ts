import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  message: string;
  version: string;
  endpoints: string[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
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