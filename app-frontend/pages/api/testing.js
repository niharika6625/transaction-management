// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function newApi(req, res) {
    // res.status(200).json({
    //   "description": "hhg."
    // })
    res.status(404).json({ error: 'Transaction not found' });
  }
  