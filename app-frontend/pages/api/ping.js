// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function helloAPI(req, res) {
  res.status(200).json({
    "description": "The service is up and running."
  })
}
