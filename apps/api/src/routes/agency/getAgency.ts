import { pool } from '../../../postgress-config';
import { get_agency } from '../../queries'
import { Request, Response } from "express"

export const get_age = async (req: Request, res: Response) => {
  try {
    const response = await pool.query(get_agency);
    return res.status(200).json({ success: true, message: response.rows[0] })
  } catch (error: any) {
    console.error("error while fetching agency : ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
