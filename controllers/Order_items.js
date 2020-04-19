const express = require('express')
const router = express.Router()

const { order,order_item,customer,driver,product } = require('../models/index');


exports.getOrderDetailById = async (req,res)=>{
    const userId = req.params.id
    try {
        const orderData = await order.findAll({
          where:{user_id:userId},
            include: [{
                model: order_item,
                attributes: ['quantity'],
              include: [{
                model: product,
                attributes: ['name']
            }]
          }]
        })
        
        res.json({
            message: 'success retrieve data',
			status: true,
			data: orderData
        })

    } catch (error) {
        res.status(500).json({
			status: false,
			message: error
        })
    }
}