const { PendingOrder, CompletedOrder, sequelize,User } = require('../models/model');
const { Op, Sequelize } = require('sequelize');


exports.CreateTransaction = async (req, res) => {
    let { role, UserId, buyerQty, buyerPrice, sellerPrice, sellerQty, type } = req.body;
    buyerPrice = Number(buyerPrice);
    sellerPrice = Number(sellerPrice);
    buyerQty = Number(buyerQty);
    sellerQty = Number(sellerQty);

    // Verify UserId existence
    const user = await User.findByPk(UserId);
    if (!user) {
        return res.status(400).send({ success: false, msg: "User does not exist." });
    }

    // Start a transaction to ensure atomicity
    const t = await sequelize.transaction();

    try {
        if (type === "buyer") {
            console.log("Buyer order:", { UserId, buyerQty, buyerPrice });

            const matchingSellerOrder = await PendingOrder.findOne({
                where: {
                    sellerPrice: buyerPrice,
                    sellerQty: { [Op.gt]: 0 },
                    orderStatus: 'pending'
                },
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (matchingSellerOrder) {
                const matchedQty = Math.min(buyerQty, matchingSellerOrder.sellerQty);

                // Create a completed order
                await CompletedOrder.create({
                    buyerId: UserId,
                    price: buyerPrice,
                    qty: matchedQty
                }, { transaction: t });

                // Update or remove the seller order
                const remainingSellerQty = matchingSellerOrder.sellerQty - matchedQty;
                if (remainingSellerQty > 0) {
                    await matchingSellerOrder.update({ sellerQty: remainingSellerQty }, { transaction: t });
                } else {
                    await matchingSellerOrder.destroy({ transaction: t });
                }

                // Create or update the buyer order
                const remainingBuyerQty = buyerQty - matchedQty;
                if (remainingBuyerQty > 0) {
                    const existingBuyerOrder = await PendingOrder.findOne({
                        where: {
                            buyerId: UserId,
                            buyerPrice,
                            orderStatus: 'pending'
                        },
                        lock: t.LOCK.UPDATE,
                        transaction: t
                    });

                    if (existingBuyerOrder) {
                        await existingBuyerOrder.update({
                            buyerQty: existingBuyerOrder.buyerQty + remainingBuyerQty
                        }, { transaction: t });
                    } else {
                        await PendingOrder.create({
                            buyerId: UserId,
                            buyerQty: remainingBuyerQty,
                            buyerPrice,
                            orderStatus: 'pending'
                        }, { transaction: t });
                    }
                }

                await t.commit();
                return res.status(201).send({ success: true, msg: "Order matched and completed.", qty: matchedQty });
            } else {
                // If no matching seller order, check for existing buyer order with the same price
                const existingBuyerOrder = await PendingOrder.findOne({
                    where: {
                        buyerId: UserId,
                        buyerPrice,
                        orderStatus: 'pending'
                    },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });

                if (existingBuyerOrder) {
                    await existingBuyerOrder.update({
                        buyerQty: existingBuyerOrder.buyerQty + buyerQty
                    }, { transaction: t });
                    await t.commit();
                    return res.status(200).send({ success: true, msg: "Buyer order quantity updated.", order: existingBuyerOrder });
                } else {
                    const newOrder = await PendingOrder.create({
                        buyerId: UserId,
                        buyerQty,
                        buyerPrice,
                        orderStatus: 'pending'
                    }, { transaction: t });

                    await t.commit();
                    return res.status(201).send({ success: true, msg: "Buyer order added to Pending Orders.", order: newOrder });
                }
            }
        } else if (type === "seller") {
            console.log("Seller order:", { UserId, sellerQty, sellerPrice });
            if(role=="seller"){
                return res.status(200).send({success:false,msg:"you are not authorised for selling log as seller"})
            }
            const matchingBuyerOrder = await PendingOrder.findOne({
                where: {
                    buyerPrice: sellerPrice,
                    buyerQty: { [Op.gt]: 0 },
                    orderStatus: 'pending'
                },
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (matchingBuyerOrder) {
                const matchedQty = Math.min(sellerQty, matchingBuyerOrder.buyerQty);

                // Create a completed order
                await CompletedOrder.create({
                    buyerId: matchingBuyerOrder.buyerId,
                    price: sellerPrice,
                    qty: matchedQty
                }, { transaction: t });

                // Update or remove the buyer order
                const remainingBuyerQty = matchingBuyerOrder.buyerQty - matchedQty;
                if (remainingBuyerQty > 0) {
                    await matchingBuyerOrder.update({ buyerQty: remainingBuyerQty }, { transaction: t });
                } else {
                    await matchingBuyerOrder.destroy({ transaction: t });
                }

                // Create or update the seller order
                const remainingSellerQty = sellerQty - matchedQty;
                if (remainingSellerQty > 0) {
                    const existingSellerOrder = await PendingOrder.findOne({
                        where: {
                            sellerId: UserId,
                            sellerPrice,
                            orderStatus: 'pending'
                        },
                        lock: t.LOCK.UPDATE,
                        transaction: t
                    });

                    if (existingSellerOrder) {
                        await existingSellerOrder.update({
                            sellerQty: existingSellerOrder.sellerQty + remainingSellerQty
                        }, { transaction: t });
                    } else {
                        await PendingOrder.create({
                            sellerId: UserId,
                            sellerQty: remainingSellerQty,
                            sellerPrice,
                            orderStatus: 'pending'
                        }, { transaction: t });
                    }
                }

                await t.commit();
                return res.status(201).send({ success: true, msg: "Order partially/fully matched and completed.", qty: matchedQty });
            } else {
                // If no matching buyer order, check for existing seller order with the same price
                const existingSellerOrder = await PendingOrder.findOne({
                    where: {
                        sellerId: UserId,
                        sellerPrice,
                        orderStatus: 'pending'
                    },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });

                if (existingSellerOrder) {
                    await existingSellerOrder.update({
                        sellerQty: existingSellerOrder.sellerQty + sellerQty
                    }, { transaction: t });
                    await t.commit();
                    return res.status(200).send({ success: true, msg: "Seller order quantity updated.", order: existingSellerOrder });
                } else {
                    const newOrder = await PendingOrder.create({
                        sellerId: UserId,
                        sellerQty,
                        sellerPrice,
                        orderStatus: 'pending'
                    }, { transaction: t });

                    await t.commit();
                    return res.status(201).send({ success: true, msg: "Seller order added to Pending Orders.", order: newOrder });
                }
            }
        } else {
            await t.rollback();
            return res.status(400).send({ success: false, msg: "Invalid order type." });
        }
    } catch (error) {
        await t.rollback();
        console.error("Error creating pending order:", error);
        return res.status(500).send({ success: false, err: error });
    }
};





exports.GetPendingTable = async (req, res) => {
    try {

        // Fetch the pending orders with associated buyer and seller details
        const getFullTable = await PendingOrder.findAll({
            include: [
                {
                    model: User,
                    as: 'buyer', 
                    attributes: ['id', 'username', 'email'],
                },
                {
                    model: User,
                    as: 'seller', 
                    attributes: ['id', 'username', 'email'],
                }
            ]
        });
        const getFullTablePend = await PendingOrder.findAll();
console.log("Pending Orders:", getFullTable);
        console.log("getfulltable",getFullTable);
        if (!getFullTable.length) {
            return res.status(200).send({ success: false, msg: "Pending table is empty" });
        }

        return res.status(200).send({ success: true, data: getFullTable });
    } catch (error) {
        console.error("Error fetching pending table:", error);
        return res.status(500).send({ success: false, err: error });
    }
};


exports.GetCompletedTable = async (req, res) => {
    try {
        // Fetch the completed orders with associated buyer and seller details
        const getCompletedTable = await CompletedOrder.findAll({
            include: [
                {
                    model: User,
                    as: 'buyer', // Use the same alias defined in the association
                    attributes: ['id', 'username', 'email'], // Fetch buyer details
                }
            ]
        });
        console.log("getcompletedtable",getCompletedTable);
        if (!getCompletedTable.length) {
            return res.status(200).send({ success: false, msg: "Completed table is empty" });
        }

        return res.status(200).send({ success: true, data: getCompletedTable });
    } catch (error) {
        console.error("Error fetching completed table:", error);
        return res.status(500).send({ success: false, err: error });
    }
};
